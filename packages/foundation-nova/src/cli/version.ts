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
import {
  TEXT_JAVA_VERSION,
  TEXT_RUSTC_VERSION,
  TEXT_SEMVER,
  TEXT_TRIM_TO_FIRST_DIGIT,
} from '@/lib/regex.js';
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

      // Build the table.
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

      // Push data into the table.
      for (const [rowKey, rowValue] of Object.entries(rowsByKey)) {
        table.push([
          itemBrandPrettyNames[rowKey] ?? itemTypePrettyNames[rowKey] ?? chalk.grey(rowKey),
          rowValue,
        ]);
      }

      // Print the table.
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
    const nodeJsVersion = executeShell('node --version');
    const npmVersion = executeShell('npm --version');
    const yarnVersion = executeShell('yarn --version');
    const pnpmVersion = executeShell('pnpm --version');
    const bunVersion = executeShell('bun --version');

    let tools: CLIVersionGetNodeVersionTools = {};

    // Attempt to retrieve the Node.js version.
    if (nodeJsVersion.errorCode === 0) {
      const match = nodeJsVersion.text.match(TEXT_SEMVER)?.[1];

      if (match !== undefined) {
        tools = {
          ...tools,
          nodeJs: match,
        };
      }
    }

    // Attempt to retrieve the Node Package Manager (npm) version.
    if (npmVersion.errorCode === 0) {
      const match = npmVersion.text.match(TEXT_SEMVER)?.[1];

      if (match !== undefined) {
        tools = {
          ...tools,
          npm: match,
        };
      }
    }

    // Attempt to retrieve the Yarn version.
    if (yarnVersion.errorCode === 0) {
      const match = yarnVersion.text.match(TEXT_SEMVER)?.[1];

      if (match !== undefined) {
        tools = {
          ...tools,
          yarn: match,
        };
      }
    }

    // Attempt to retrieve the Performant Node Package Manager (pnpm) version.
    if (pnpmVersion.errorCode === 0) {
      const match = pnpmVersion.text.match(TEXT_SEMVER)?.[1];

      if (match !== undefined) {
        tools = {
          ...tools,
          pnpm: match,
        };
      }
    }

    // Attempt to retrieve the Bun version.
    if (bunVersion.errorCode === 0) {
      const match = bunVersion.text.match(TEXT_SEMVER)?.[1];

      if (match !== undefined) {
        tools = {
          ...tools,
          bun: match,
        };
      }
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
    const nvmVersion = executeShell('nvm --version');
    const voltaVersion = executeShell('volta --version');

    let managers: CLIVersionGetEnvironmentManagerVersionManagers = {};

    // Attempt to retrieve the Node Version Manager (nvm) version.
    if (os.platform() !== 'win32' && nvmVersion.errorCode === 0) {
      const match = nvmVersion.text.match(TEXT_SEMVER)?.[1];

      if (match !== undefined) {
        managers = {
          ...managers,
          nvm: match,
        };
      }
    }

    // Attempt to retrieve the Node Version Manager for Windows (nvm-windows) version.
    if (os.platform() === 'win32' && nvmVersion.errorCode === 0) {
      const match = nvmVersion.text.match(TEXT_SEMVER)?.[1];

      if (match !== undefined) {
        managers = {
          ...managers,
          nvmWindows: match,
        };
      }
    }

    // Attempt to retrieve the Volta version.
    if (nvmVersion.errorCode === 0) {
      const match = voltaVersion.text.match(TEXT_SEMVER)?.[1];

      if (match !== undefined) {
        managers = {
          ...managers,
          volta: match,
        };
      }
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
      name = executeShell('sw_vers -productName').text ?? 'macOS';
      version = executeShell('sw_vers -productVersion').text ?? version;
      build = executeShell('sw_vers -buildVersion').text;
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
      const supportedBrowsers = {
        'chrome': 'Google Chrome.app',
        'safari': 'Safari.app',
        'edge': 'Microsoft Edge.app',
        'firefox': 'Firefox.app',
        'opera': 'Opera.app',
        'brave': 'Brave Browser.app',
        'vivaldi': 'Vivaldi.app',
        'orion': 'Orion.app',
        'libreWolf': 'LibreWolf.app',
      };

      for (const supportedBrowser of Object.entries(supportedBrowsers)) {
        browsers = {
          ...browsers,
          ...(existsSync(`/Applications/${supportedBrowser[1]}`)) ? {
            [supportedBrowser[0]]: executeShell(`defaults read "/Applications/${supportedBrowser[1]}/Contents/Info" CFBundleShortVersionString`).text,
          } : {},
        };
      }
    }

    // Windows (must be registered into "App Paths" and have "VersionInfo.ProductVersion" key).
    if (platform === 'win32') {
      const supportedBrowsers = {
        'chrome': 'chrome.exe',
        'edge': 'msedge.exe',
        'firefox': 'firefox.exe',
        'opera': 'opera.exe',
        'brave': 'brave.exe',
        'vivaldi': 'vivaldi.exe',
      };

      for (const supportedBrowser of Object.entries(supportedBrowsers)) {
        const query = parseWindowsRegistryQuery([
          `HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\${supportedBrowser[1]}`,
          `HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\${supportedBrowser[1]}`,
        ]);

        browsers = {
          ...browsers,
          ...(query['(Default)']?.data !== undefined) ? {
            [supportedBrowser[0]]: executeShell(`powershell -Command "(Get-Item '${query['(Default)']?.data}').VersionInfo.ProductVersion"`).text,
          } : {},
        };
      }
    }

    // Linux (must have a command that exists in PATH).
    if (platform === 'linux') {
      const supportedBrowsers = {
        'chrome': 'google-chrome',
        'firefox': 'firefox',
        'brave': 'brave-browser',
        'vivaldi': 'vivaldi',
        'opera': 'opera',
        'edge': 'microsoft-edge',
        'libreWolf': 'librewolf',
      };

      for (const supportedBrowser of Object.entries(supportedBrowsers)) {
        browsers = {
          ...browsers,
          ...(executeShell(`command -v ${supportedBrowser[1]}`).errorCode === 0) ? {
            [supportedBrowser[0]]: executeShell(`${supportedBrowser[1]} --version`).text.replace(TEXT_TRIM_TO_FIRST_DIGIT, ''),
          } : {},
        };
      }
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
    const javaVersion = executeShell('java --version');
    const rustVersion = executeShell('rustc --version');

    let interpreters: CLIVersionGetInterpreterVersionInterpreters = {};

    // Attempt to retrieve the Java version.
    if (javaVersion.errorCode === 0) {
      const match = javaVersion.text.match(TEXT_JAVA_VERSION);
      const matchVersion = match?.[1] ?? 'N/A';
      const matchDistribution = match?.[2] ?? 'N/A';
      const matchBuild = match?.[4] ?? 'N/A';

      if (match !== null) {
        interpreters = {
          ...interpreters,
          java: `${matchVersion} (distro: ${matchDistribution}, build: ${matchBuild})`,
        };
      }
    }

    // Attempt to retrieve the Rust version.
    if (rustVersion.errorCode === 0) {
      const match = rustVersion.text.match(TEXT_RUSTC_VERSION);
      const matchVersion = match?.[1] ?? 'N/A';
      const matchBuildHash = match?.[2] ?? 'N/A';
      const matchBuildDate = match?.[3] ?? 'N/A';
      const matchSource = match?.[4] ?? 'rustup';

      if (match !== null) {
        interpreters = {
          ...interpreters,
          rust: `${matchVersion} (build hash: ${matchBuildHash}, build date: ${matchBuildDate}, source: ${matchSource})`,
        };
      }
    }

    return interpreters;
  }
}
