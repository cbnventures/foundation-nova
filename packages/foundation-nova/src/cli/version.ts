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
import { CHARACTER_LEADING_V, TEXT_PARENTHESIS_CONTENT, TEXT_RUSTC_VERSION } from '@/lib/regex.js';
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
    let list: CLIVersionRunList = {};

    // Get installation versions for the installed Node.js copy.
    if (options.node || options.all) {
      list = {
        ...list,
        node: CLIVersion.getNodeVersion(),
      };
    }

    // Get installation versions for the installed environment managers.
    if (options.env || options.all) {
      list = {
        ...list,
        env: CLIVersion.getEnvironmentManagerVersion(),
      };
    }

    // Get installation versions for the operating system.
    if (options.os || options.all) {
      list = {
        ...list,
        os: CLIVersion.getOsVersion(),
      };
    }

    // Get installation versions for the installed web browsers.
    if (options.browser || options.all) {
      list = {
        ...list,
        browsers: CLIVersion.getBrowserVersion(),
      };
    }

    // Get installation versions for the installed interpreters.
    if (options.interpreter || options.all) {
      list = {
        ...list,
        interpreters: CLIVersion.getInterpreterVersion(),
      };
    }

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
    for (const [key, value] of Object.entries(list)) {
      // Skip empty tables.
      if (Object.keys(value).length === 0) {
        continue;
      }

      const table = new Table({
        head: [
          chalk.bold.yellow(itemColumnTitlePrettyNames[`key-${key}`] ?? 'Key'),
          chalk.bold.yellow(itemColumnTitlePrettyNames[`value-${key}`] ?? 'Value'),
        ],
        style: {
          head: [],
          border: [],
        },
      });

      for (const [innerKey, innerValue] of Object.entries(value)) {
        table.push([
          itemBrandPrettyNames[innerKey] ?? itemTypePrettyNames[innerKey] ?? chalk.grey(innerKey),
          innerValue,
        ]);
      }

      console.log(`\n${itemCategoryPrettyNames[key] ?? chalk.grey(key)}`);
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
      const nodeJsVersion = executeShell('node -v', {
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
      const npmVersion = executeShell('npm -v', {
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
      const yarnVersion = executeShell('yarn -v', {
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
      let nvmVersion;

      if (os.platform() === 'win32') {
        nvmVersion = executeShell('nvm --version', {
          stdio: [
            'ignore',
            'pipe',
            'ignore',
          ],
        });
      } else {
        const userShell = process.env['SHELL'] || '/bin/bash';

        // Because UNIX just wants to be special in their own way.
        nvmVersion = executeShell(`${userShell} -lc "nvm --version"`, {
          env: process.env,
          stdio: [
            'ignore',
            'pipe',
            'ignore',
          ],
        });
      }

      if (nvmVersion !== null) {
        managers = {
          ...managers,
          nvm: nvmVersion,
        };
      }
    } catch {
      /* empty */
    }

    // Attempt to retrieve the Volta version.
    try {
      const voltaVersion = executeShell('volta --version', {
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
      }) ?? '';
      const lines = javaVersion.trim().split('\n');

      if (lines !== undefined) {
        const [firstLine, secondLine] = lines;

        if (
          firstLine !== undefined
          && secondLine !== undefined
        ) {
          /**
           * First line examples:
           *
           * "java 21.0.2 2024-01-16 LTS"
           * "openjdk 21.0.8 2025-07-15 LTS"
           *
           * @since 1.0.0
           */
          const firstLineSplit = firstLine.split(' ');
          const distribution = firstLineSplit[0] ?? 'java';

          /**
           * Second line examples:
           *
           * "Java(TM) SE Runtime Environment (build 21.0.2+13-LTS-58)"
           * "OpenJDK Runtime Environment Temurin-21.0.8+9 (build 21.0.8+9-LTS)"
           * "OpenJDK Runtime Environment Zulu17.46+19-CA (build 17.0.9+9-LTS)"
           * "OpenJDK Runtime Environment Corretto-17.0.8.7.1 (build 17.0.8+7-LTS)"
           * "Eclipse OpenJ9 VM IBM Semeru Runtime Open Edition 17.0.6+10 (build openj9-0.36.0, JCL version 17.0.6+10)"
           *
           * @since 1.0.0
           */
          const secondLineSplit = secondLine.match(TEXT_PARENTHESIS_CONTENT)?.[1]?.split(', ') ?? '';
          const build = (secondLineSplit[0]) ? secondLineSplit[0].replace('build ', '') : 'N/A';

          // Build output string.
          interpreters = {
            ...interpreters,
            java: `${distribution} (build: ${build})`,
          };
        }
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
          rust: `${version} (build: ${buildHash} ${buildDate}, source: ${source})`,
        };
      }
    } catch {
      /* empty */
    }

    return interpreters;
  }
}
