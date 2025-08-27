import { existsSync } from 'fs';
import os from 'os';

import chalk from 'chalk';
import Table from 'cli-table3';

import {
  itemBrandPrettyNames,
  itemCategoryPrettyNames,
  itemColumnTitlePrettyNames,
  itemTypePrettyNames,
} from '@/lib/item.js';
import { CHARACTER_LEADING_V, TEXT_JAVA_VERSION, TEXT_RUSTC_VERSION } from '@/lib/regex.js';
import { executeShell, parseLinuxOsReleaseFile, parseWindowsRegistryQuery } from '@/lib/utility.js';
import type {
  CLIVersionGetBrowserVersionBrowsers,
  CLIVersionGetBrowserVersionReturns,
  CLIVersionGetEnvironmentManagerVersionManagers,
  CLIVersionGetEnvironmentManagerVersionReturns,
  CLIVersionGetInterpreterVersionInterpreters,
  CLIVersionGetInterpreterVersionReturns,
  CLIVersionGetNodeVersionReturns,
  CLIVersionGetNodeVersionTools,
  CLIVersionGetOsVersionArchitecture,
  CLIVersionGetOsVersionBuild,
  CLIVersionGetOsVersionKernel,
  CLIVersionGetOsVersionName,
  CLIVersionGetOsVersionReturns,
  CLIVersionGetOsVersionVersion,
  CLIVersionPrintList,
  CLIVersionPrintReturns,
  CLIVersionRunList,
  CLIVersionRunOptions,
  CLIVersionRunReturns,
} from '@/types/cli.js';

/**
 * CLI Version.
 *
 * @since 1.0.0
 */
export class CLIVersion {
  /**
   * CLI Version - Run.
   *
   * @param {CLIVersionRunOptions} options - Options.
   *
   * @returns {CLIVersionRunReturns}
   *
   * @since 1.0.0
   */
  public static run(options: CLIVersionRunOptions): CLIVersionRunReturns {
    const list: CLIVersionRunList = {
      // Node.js Environment.
      ...(options.node || options.all) ? {
        node: CLIVersion.getNodeVersion(),
      } : {},

      // Environment Managers.
      ...(options.env || options.all) ? {
        env: CLIVersion.getEnvironmentManagerVersion(),
      } : {},

      // Operating System.
      ...(options.os || options.all) ? {
        os: CLIVersion.getOsVersion(),
      } : {},

      // Web Browsers.
      ...(options.browser || options.all) ? {
        browsers: CLIVersion.getBrowserVersion(),
      } : {},

      // Interpreters and Runtimes.
      ...(options.interpreter || options.all) ? {
        interpreters: CLIVersion.getInterpreterVersion(),
      } : {},
    };

    // Print out the versions to the console.
    CLIVersion.print(list);
  }

  /**
   * CLI Version - Print.
   *
   * @param {CLIVersionPrintList} list - List.
   *
   * @private
   *
   * @returns {CLIVersionPrintReturns}
   *
   * @since 1.0.0
   */
  private static print(list: CLIVersionPrintList): CLIVersionPrintReturns {
    // Each category maps to a rows-by-key object used to render a single two-column table.
    for (const [category, rowsByKey] of Object.entries(list)) {
      // Skip empty objects.
      if (Object.keys(rowsByKey).length === 0) {
        continue;
      }

      const table = new Table({
        head: [
          chalk.bold.yellow(itemColumnTitlePrettyNames[`key-${category}`] ?? 'Key'),
          chalk.bold.yellow(itemColumnTitlePrettyNames[`value-${category}`] ?? 'Value'),
        ],
        style: {
          head: [],
          border: [],
        },
      });

      for (const [rowKey, rowValue] of Object.entries(rowsByKey)) {
        table.push([
          itemBrandPrettyNames[rowKey] ?? itemTypePrettyNames[rowKey] ?? chalk.grey(rowKey),
          rowValue,
        ]);
      }

      console.log(`\n${itemCategoryPrettyNames[category] ?? chalk.grey(category)}`);
      console.log(table.toString());
    }
  }

  /**
   * CLI Version - Get node version.
   *
   * @private
   *
   * @returns {CLIVersionGetNodeVersionReturns}
   *
   * @since 1.0.0
   */
  private static getNodeVersion(): CLIVersionGetNodeVersionReturns {
    let tools: CLIVersionGetNodeVersionTools = {};

    // Attempt to retrieve the Node.js version.
    try {
      const nodeJsVersion = executeShell('node --version', {
        stdio: [
          'ignore',
          'pipe',
          'ignore',
        ],
      });

      // Remove the leading "v" from the version output.
      if (nodeJsVersion !== null) {
        tools = {
          ...tools,
          nodeJs: nodeJsVersion.replace(CHARACTER_LEADING_V, ''),
        };
      }
    } catch {
      /* empty */
    }

    // Attempt to retrieve the Node Package Manager (npm) version.
    try {
      const npmVersion = executeShell('npm --version', {
        stdio: [
          'ignore',
          'pipe',
          'ignore',
        ],
      });

      if (npmVersion !== null) {
        tools = {
          ...tools,
          npm: npmVersion,
        };
      }
    } catch {
      /* empty */
    }

    // Attempt to retrieve the Yarn version.
    try {
      const yarnVersion = executeShell('yarn --version', {
        stdio: [
          'ignore',
          'pipe',
          'ignore',
        ],
      });

      if (yarnVersion !== null) {
        tools = {
          ...tools,
          yarn: yarnVersion,
        };
      }
    } catch {
      /* empty */
    }

    // Attempt to retrieve the Performant Node Package Manager (pnpm) version.
    try {
      const pnpmVersion = executeShell('pnpm --version', {
        env: {
          ...process.env,
          COREPACK_ENABLE_STRICT: '0',
        },
        stdio: [
          'ignore',
          'pipe',
          'ignore',
        ],
      });

      if (pnpmVersion !== null) {
        tools = {
          ...tools,
          pnpm: pnpmVersion,
        };
      }
    } catch {
      /* empty */
    }

    // Attempt to retrieve the Bun version.
    try {
      const bunVersion = executeShell('bun --version', {
        stdio: [
          'ignore',
          'pipe',
          'ignore',
        ],
      });

      if (bunVersion !== null) {
        tools = {
          ...tools,
          bun: bunVersion,
        };
      }
    } catch {
      /* empty */
    }

    return tools;
  }

  /**
   * CLI Version - Get environment manager version.
   *
   * @private
   *
   * @returns {CLIVersionGetEnvironmentManagerVersionReturns}
   *
   * @since 1.0.0
   */
  private static getEnvironmentManagerVersion(): CLIVersionGetEnvironmentManagerVersionReturns {
    let managers: CLIVersionGetEnvironmentManagerVersionManagers = {};

    // Attempt to retrieve the Node Version Manager (nvm) version.
    try {
      // Windows has their own version.
      if (os.platform() !== 'win32') {
        const userShell = process.env['SHELL'] || '/bin/bash';
        const nvmVersion = executeShell(`${userShell} -lic "nvm --version"`, {
          env: process.env,
          stdio: [
            'ignore',
            'pipe',
            'ignore',
          ],
        });

        if (nvmVersion !== null) {
          managers = {
            ...managers,
            nvm: nvmVersion,
          };
        }
      }
    } catch {
      /* empty */
    }

    // Attempt to retrieve the Node Version Manager for Windows (nvm) version.
    try {
      if (os.platform() === 'win32') {
        const nvmWindowsVersion = executeShell('nvm --version', {
          stdio: [
            'ignore',
            'pipe',
            'ignore',
          ],
        });

        if (nvmWindowsVersion !== null) {
          managers = {
            ...managers,
            nvmWindows: nvmWindowsVersion,
          };
        }
      }
    } catch {
      /* empty */
    }

    // Attempt to retrieve the Volta version.
    try {
      const userShell = process.env['SHELL'] || '/bin/bash';
      const voltaVersion = executeShell(`${userShell} -lic "volta --version"`, {
        env: process.env,
        stdio: [
          'ignore',
          'pipe',
          'ignore',
        ],
      });

      if (voltaVersion !== null) {
        managers = {
          ...managers,
          volta: voltaVersion,
        };
      }
    } catch {
      /* empty */
    }

    return managers;
  }

  /**
   * CLI Version - Get os version.
   *
   * @private
   *
   * @returns {CLIVersionGetOsVersionReturns}
   *
   * @since 1.0.0
   */
  private static getOsVersion(): CLIVersionGetOsVersionReturns {
    const platform = os.platform();

    let name: CLIVersionGetOsVersionName = platform;
    let version: CLIVersionGetOsVersionVersion = os.version() ?? null;
    let architecture: CLIVersionGetOsVersionArchitecture = os.arch();
    let build: CLIVersionGetOsVersionBuild = null;
    let kernel: CLIVersionGetOsVersionKernel = os.release();

    // macOS.
    if (platform === 'darwin') {
      name = executeShell('sw_vers -productName') ?? 'macOS';
      version = executeShell('sw_vers -productVersion') ?? version;
      build = executeShell('sw_vers -buildVersion');
    }

    // Windows.
    if (platform === 'win32') {
      const registryQuery = parseWindowsRegistryQuery('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion');
      const currentBuild = registryQuery['CurrentBuild']?.data ?? registryQuery['CurrentBuildNumber']?.data;
      const updateBuildRevision = registryQuery['UBR']?.data;

      name = registryQuery['ProductName']?.data ?? 'Windows';
      version = registryQuery['DisplayVersion']?.data ?? registryQuery['ReleaseId']?.data ?? version;
      build = (currentBuild) ? ((updateBuildRevision) ? `${currentBuild}.${updateBuildRevision}` : currentBuild) : null;
    }

    // Linux.
    if (platform === 'linux') {
      const osRelease = parseLinuxOsReleaseFile();

      name = osRelease['NAME'] ?? 'Linux';
      version = osRelease['VERSION'] ?? null;
      build = osRelease['BUILD_ID'] ?? null;
    }

    return {
      name,
      version,
      architecture,
      build,
      kernel,
    };
  }

  /**
   * CLI Version - Get browser version.
   *
   * @private
   *
   * @returns {CLIVersionGetBrowserVersionReturns}
   *
   * @since 1.0.0
   */
  private static getBrowserVersion(): CLIVersionGetBrowserVersionReturns {
    const platform = os.platform();

    let browsers: CLIVersionGetBrowserVersionBrowsers = {};

    // macOS (must have "./Contents/Info" file and "CFBundleShortVersionString" key).
    if (platform === 'darwin') {
      browsers = {
        ...(existsSync('/Applications/Google Chrome.app')) ? {
          chrome: executeShell('defaults read "/Applications/Google Chrome.app/Contents/Info" CFBundleShortVersionString'),
        } : {},
        ...(existsSync('/Applications/Safari.app')) ? {
          safari: executeShell('defaults read "/Applications/Safari.app/Contents/Info" CFBundleShortVersionString'),
        } : {},
        ...(existsSync('/Applications/Microsoft Edge.app')) ? {
          edge: executeShell('defaults read "/Applications/Microsoft Edge.app/Contents/Info" CFBundleShortVersionString'),
        } : {},
        ...(existsSync('/Applications/Firefox.app')) ? {
          firefox: executeShell('defaults read "/Applications/Firefox.app/Contents/Info" CFBundleShortVersionString'),
        } : {},
        ...(existsSync('/Applications/Opera.app')) ? {
          opera: executeShell('defaults read "/Applications/Opera.app/Contents/Info" CFBundleShortVersionString'),
        } : {},
        ...(existsSync('/Applications/Brave Browser.app')) ? {
          brave: executeShell('defaults read "/Applications/Brave Browser.app/Contents/Info" CFBundleShortVersionString'),
        } : {},
        ...(existsSync('/Applications/Vivaldi.app')) ? {
          vivaldi: executeShell('defaults read "/Applications/Vivaldi.app/Contents/Info" CFBundleShortVersionString'),
        } : {},
        ...(existsSync('/Applications/Orion.app')) ? {
          orion: executeShell('defaults read "/Applications/Orion.app/Contents/Info" CFBundleShortVersionString'),
        } : {},
        ...(existsSync('/Applications/LibreWolf.app')) ? {
          libreWolf: executeShell('defaults read "/Applications/LibreWolf.app/Contents/Info" CFBundleShortVersionString'),
        } : {},
      };
    }

    // Windows (must be registered into "App Paths" and have "VersionInfo.ProductVersion" key).
    if (platform === 'win32') {
      const chromeQuery = parseWindowsRegistryQuery([
        'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\chrome.exe',
        'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\chrome.exe',
      ]);
      const edgeQuery = parseWindowsRegistryQuery([
        'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\msedge.exe',
        'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\msedge.exe',
      ]);
      const firefoxQuery = parseWindowsRegistryQuery([
        'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\firefox.exe',
        'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\firefox.exe',
      ]);
      const operaQuery = parseWindowsRegistryQuery([
        'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\opera.exe',
        'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\opera.exe',
      ]);
      const braveQuery = parseWindowsRegistryQuery([
        'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\brave.exe',
        'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\brave.exe',
      ]);
      const vivaldiQuery = parseWindowsRegistryQuery([
        'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\vivaldi.exe',
        'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\vivaldi.exe',
      ]);

      browsers = {
        ...(chromeQuery['(Default)']?.data !== undefined) ? {
          'chrome': executeShell(`powershell -NoProfile -Command "(Get-Item '${chromeQuery['(Default)']?.data}').VersionInfo.ProductVersion"`),
        } : {},
        ...(edgeQuery['(Default)']?.data !== undefined) ? {
          'edge': executeShell(`powershell -NoProfile -Command "(Get-Item '${edgeQuery['(Default)']?.data}').VersionInfo.ProductVersion"`),
        } : {},
        ...(firefoxQuery['(Default)']?.data !== undefined) ? {
          'firefox': executeShell(`powershell -NoProfile -Command "(Get-Item '${firefoxQuery['(Default)']?.data}').VersionInfo.ProductVersion"`),
        } : {},
        ...(operaQuery['(Default)']?.data !== undefined) ? {
          'opera': executeShell(`powershell -NoProfile -Command "(Get-Item '${operaQuery['(Default)']?.data}').VersionInfo.ProductVersion"`),
        } : {},
        ...(braveQuery['(Default)']?.data !== undefined) ? {
          'brave': executeShell(`powershell -NoProfile -Command "(Get-Item '${braveQuery['(Default)']?.data}').VersionInfo.ProductVersion"`),
        } : {},
        ...(vivaldiQuery['(Default)']?.data !== undefined) ? {
          'vivaldi': executeShell(`powershell -NoProfile -Command "(Get-Item '${vivaldiQuery['(Default)']?.data}').VersionInfo.ProductVersion"`),
        } : {},
      };
    }

    // Linux (must have a command that exists in PATH).
    if (platform === 'linux') {
      browsers = {
        ...(executeShell('command -v google-chrome')) ? {
          'chrome': executeShell('google-chrome --version')?.replace('Google Chrome ', '') ?? null,
        } : {},
        ...(executeShell('command -v firefox')) ? {
          'firefox': executeShell('firefox --version')?.replace('Mozilla Firefox ', '') ?? null,
        } : {},
        ...(executeShell('command -v brave-browser')) ? {
          'brave': executeShell('brave-browser --version')?.replace('Brave Browser ', '') ?? null,
        } : {},
        ...(executeShell('command -v vivaldi')) ? {
          'vivaldi': executeShell('vivaldi --version')?.replace('Vivaldi ', '') ?? null,
        } : {},
        ...(executeShell('command -v opera')) ? {
          'opera': executeShell('opera --version') ?? null,
        } : {},
        ...(executeShell('command -v microsoft-edge')) ? {
          'edge': executeShell('microsoft-edge --version')?.replace('Microsoft Edge ', '') ?? null,
        } : {},
        ...(executeShell('command -v librewolf')) ? {
          'libreWolf': executeShell('librewolf --version')?.replace('Mozilla LibreWolf ', '') ?? null,
        } : {},
      };
    }

    return browsers;
  }

  /**
   * CLI Version - Get interpreter version.
   *
   * @private
   *
   * @returns {CLIVersionGetInterpreterVersionReturns}
   *
   * @since 1.0.0
   */
  private static getInterpreterVersion(): CLIVersionGetInterpreterVersionReturns {
    let interpreters: CLIVersionGetInterpreterVersionInterpreters = {};

    // Attempt to retrieve the Java version.
    try {
      const javaVersion = executeShell('java --version', {
        stdio: [
          'ignore',
          'pipe',
          'ignore',
        ],
      });

      if (javaVersion !== null) {
        const javaVersionMatch = javaVersion.match(TEXT_JAVA_VERSION);
        const javaVersionMatchVersion = javaVersionMatch?.[1] ?? 'N/A';
        const javaVersionMatchDistribution = javaVersionMatch?.[2] ?? 'N/A';
        const javaVersionMatchBuild = javaVersionMatch?.[4] ?? 'N/A';

        // Build output string.
        interpreters = {
          ...interpreters,
          java: `${javaVersionMatchVersion} (distro: ${javaVersionMatchDistribution}, build: ${javaVersionMatchBuild})`,
        };
      }
    } catch {
      /* empty */
    }

    // Attempt to retrieve the Rust version.
    try {
      const rustVersion = executeShell('rustc --version', {
        stdio: [
          'ignore',
          'pipe',
          'ignore',
        ],
      });

      if (rustVersion !== null) {
        const rustVersionMatch = rustVersion.match(TEXT_RUSTC_VERSION);

        const version = rustVersionMatch?.[1];
        const buildHash = rustVersionMatch?.[2];
        const buildDate = rustVersionMatch?.[3];
        const source = rustVersionMatch?.[4] ?? 'rustup';

        interpreters = {
          ...interpreters,
          rust: `${version} (build hash: ${buildHash}, build date: ${buildDate}, source: ${source})`,
        };
      }
    } catch {
      /* empty */
    }

    return interpreters;
  }
}
