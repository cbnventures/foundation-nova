import * as os from 'os';

import chalk from 'chalk';

import {
  itemBrandPrettyNames,
  itemCategoryPrettyNames,
  itemColumnTitlePrettyNames,
  itemTypePrettyNames,
} from '@/lib/item.js';
import { MarkdownTable } from '@/toolkit/index.js';
import {
  PATTERN_DOUBLE_QUOTED_STRING_CAPTURE,
  PATTERN_JAVA_VERSION_LINE,
  PATTERN_LEADING_NON_DIGITS,
  PATTERN_RUSTC_VERSION_LINE,
  PATTERN_SEMVER,
} from '@/lib/regex.js';
import {
  executeShell,
  parseLinuxOsReleaseFile,
  parseWindowsRegistryQuery,
  pathExists,
} from '@/lib/utility.js';
import type {
  CLIUtilityVersionGetBrowserVersionBrowsers,
  CLIUtilityVersionGetBrowserVersionReturns,
  CLIUtilityVersionGetEnvironmentManagerVersionManagers,
  CLIUtilityVersionGetEnvironmentManagerVersionReturns,
  CLIUtilityVersionGetInterpreterVersionInterpreters,
  CLIUtilityVersionGetInterpreterVersionReturns,
  CLIUtilityVersionGetNodeVersionReturns,
  CLIUtilityVersionGetNodeVersionTools,
  CLIUtilityVersionGetOsVersionArchitecture,
  CLIUtilityVersionGetOsVersionBuild,
  CLIUtilityVersionGetOsVersionKernel,
  CLIUtilityVersionGetOsVersionName,
  CLIUtilityVersionGetOsVersionReturns,
  CLIUtilityVersionGetOsVersionVersion,
  CLIUtilityVersionPrintList,
  CLIUtilityVersionPrintReturns,
  CLIUtilityVersionRunList,
  CLIUtilityVersionRunOptions,
  CLIUtilityVersionRunReturns,
  CLIUtilityVersionRunTasks,
} from '@/types/cli/utility.d.ts';

/**
 * CLI Utility - Version.
 *
 * @since 1.0.0
 */
export class CLIUtilityVersion {
  /**
   * CLI Utility - Version - Run.
   *
   * @param {CLIUtilityVersionRunOptions} options - Options.
   *
   * @returns {CLIUtilityVersionRunReturns}
   *
   * @since 1.0.0
   */
  public static async run(options: CLIUtilityVersionRunOptions): CLIUtilityVersionRunReturns {
    const tasks: CLIUtilityVersionRunTasks = [];

    // Node.js + Tools.
    if (options.node || options.all || Object.keys(options).length === 0) {
      tasks.push(CLIUtilityVersion.getNodeVersion().then((response) => ['node', response]));
    }

    // Environment Managers.
    if (options.env || options.all || Object.keys(options).length === 0) {
      tasks.push(CLIUtilityVersion.getEnvironmentManagerVersion().then((response) => ['env', response]));
    }

    // Operating System.
    if (options.os || options.all || Object.keys(options).length === 0) {
      tasks.push(CLIUtilityVersion.getOsVersion().then((response) => ['os', response]));
    }

    // Web Browsers.
    if (options.browser || options.all || Object.keys(options).length === 0) {
      tasks.push(CLIUtilityVersion.getBrowserVersion().then((response) => ['browsers', response]));
    }

    // Interpreters / Runtimes.
    if (options.interpreter || options.all || Object.keys(options).length === 0) {
      tasks.push(CLIUtilityVersion.getInterpreterVersion().then((response) => ['interpreters', response]));
    }

    // Run all async calls in parallel and convert the results back to the list.
    const results = await Promise.all(tasks);
    const list = Object.fromEntries(results) as CLIUtilityVersionRunList;

    // Print out the versions to the console.
    CLIUtilityVersion.print(list);
  }

  /**
   * CLI Utility - Version - Print.
   *
   * @param {CLIUtilityVersionPrintList} list - List.
   *
   * @private
   *
   * @returns {CLIUtilityVersionPrintReturns}
   *
   * @since 1.0.0
   */
  private static print(list: CLIUtilityVersionPrintList): CLIUtilityVersionPrintReturns {
    // Each category maps to a rows-by-key object used to render a single two-column table.
    for (const [category, rowsByKey] of Object.entries(list)) {
      // Skip empty objects.
      if (Object.keys(rowsByKey).length === 0) {
        continue;
      }

      // Build the table.
      const table = new MarkdownTable([
        chalk.bold.yellow(itemColumnTitlePrettyNames[`key-${category}`] ?? 'Key'),
        chalk.bold.yellow(itemColumnTitlePrettyNames[`value-${category}`] ?? 'Value'),
      ], {
        padDelimiterRow: false,
        minimumColumnWidth: 10,
      });

      // Push data into the table.
      for (const [rowKey, rowValue] of Object.entries(rowsByKey)) {
        table.addRow([
          itemBrandPrettyNames[rowKey] ?? itemTypePrettyNames[rowKey] ?? chalk.grey(rowKey),
          rowValue,
        ]);
      }

      // Print the table.
      process.stdout.write(`${itemCategoryPrettyNames[category] ?? chalk.grey(category)}\n`);
      process.stdout.write(`${table.render()}\n\n`);
    }
  }

  /**
   * CLI Utility - Version - Get node version.
   *
   * @private
   *
   * @returns {CLIUtilityVersionGetNodeVersionReturns}
   *
   * @since 1.0.0
   */
  private static async getNodeVersion(): CLIUtilityVersionGetNodeVersionReturns {
    const [
      nodeJsVersion,
      npmVersion,
      yarnVersion,
      pnpmVersion,
      bunVersion,
    ] = await Promise.all([
      executeShell('node --version'),
      executeShell('npm --version'),
      executeShell('yarn --version'),
      executeShell('pnpm --version'),
      executeShell('bun --version'),
    ]);

    let tools: CLIUtilityVersionGetNodeVersionTools = {};

    // Attempt to retrieve the Node.js version.
    if (nodeJsVersion.code === 0) {
      const match = nodeJsVersion.textOut.match(PATTERN_SEMVER)?.[1];

      if (match !== undefined) {
        tools = {
          ...tools,
          nodeJs: match,
        };
      }
    }

    // Attempt to retrieve the Node Package Manager (npm) version.
    if (npmVersion.code === 0) {
      const match = npmVersion.textOut.match(PATTERN_SEMVER)?.[1];

      if (match !== undefined) {
        tools = {
          ...tools,
          npm: match,
        };
      }
    }

    // Attempt to retrieve the Yarn version.
    if (yarnVersion.code === 0) {
      const match = yarnVersion.textOut.match(PATTERN_SEMVER)?.[1];

      if (match !== undefined) {
        tools = {
          ...tools,
          yarn: match,
        };
      }
    }

    // Attempt to retrieve the Performant Node Package Manager (pnpm) version.
    if (pnpmVersion.code === 0) {
      const match = pnpmVersion.textOut.match(PATTERN_SEMVER)?.[1];

      if (match !== undefined) {
        tools = {
          ...tools,
          pnpm: match,
        };
      }
    }

    // Attempt to retrieve the Bun version.
    if (bunVersion.code === 0) {
      const match = bunVersion.textOut.match(PATTERN_SEMVER)?.[1];

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
   * CLI Utility - Version - Get environment manager version.
   *
   * @private
   *
   * @returns {CLIUtilityVersionGetEnvironmentManagerVersionReturns}
   *
   * @since 1.0.0
   */
  private static async getEnvironmentManagerVersion(): CLIUtilityVersionGetEnvironmentManagerVersionReturns {
    const [nvmVersion, voltaVersion] = await Promise.all([
      executeShell('nvm --version'),
      executeShell('volta --version'),
    ]);

    let managers: CLIUtilityVersionGetEnvironmentManagerVersionManagers = {};

    // Attempt to retrieve the Node Version Manager (nvm-posix) version.
    if (os.platform() !== 'win32' && nvmVersion.code === 0) {
      const match = nvmVersion.textOut.match(PATTERN_SEMVER)?.[1];

      if (match !== undefined) {
        managers = {
          ...managers,
          nvmPosix: match,
        };
      }
    }

    // Attempt to retrieve the Node Version Manager for Windows (nvm-windows) version.
    if (os.platform() === 'win32' && nvmVersion.code === 0) {
      const match = nvmVersion.textOut.match(PATTERN_SEMVER)?.[1];

      if (match !== undefined) {
        managers = {
          ...managers,
          nvmWindows: match,
        };
      }
    }

    // Attempt to retrieve the Volta version.
    if (voltaVersion.code === 0) {
      const match = voltaVersion.textOut.match(PATTERN_SEMVER)?.[1];

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
   * CLI Utility - Version - Get os version.
   *
   * @private
   *
   * @returns {CLIUtilityVersionGetOsVersionReturns}
   *
   * @since 1.0.0
   */
  private static async getOsVersion(): CLIUtilityVersionGetOsVersionReturns {
    const platform = os.platform();
    const architecture: CLIUtilityVersionGetOsVersionArchitecture = os.arch();
    const kernel: CLIUtilityVersionGetOsVersionKernel = os.release();

    let name: CLIUtilityVersionGetOsVersionName = platform;
    let version: CLIUtilityVersionGetOsVersionVersion = os.version();
    let build: CLIUtilityVersionGetOsVersionBuild = '—';

    // macOS.
    if (platform === 'darwin') {
      const [productName, productVersion, buildVersion] = await Promise.all([
        executeShell('sw_vers -productName'),
        executeShell('sw_vers -productVersion'),
        executeShell('sw_vers -buildVersion'),
      ]);

      name = productName.textOut ?? 'macOS';
      version = productVersion.textOut ?? version;
      build = buildVersion.textOut ?? '—';
    }

    // Windows.
    if (platform === 'win32') {
      const registryQuery = await parseWindowsRegistryQuery('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion');
      const currentBuild = registryQuery['CurrentBuild']?.data ?? registryQuery['CurrentBuildNumber']?.data;
      const updateBuildRevision = registryQuery['UBR']?.data;

      name = registryQuery['ProductName']?.data ?? 'Windows';
      version = registryQuery['DisplayVersion']?.data ?? registryQuery['ReleaseId']?.data ?? version;
      build = (currentBuild) ? ((updateBuildRevision) ? `${currentBuild}.${updateBuildRevision}` : currentBuild) : '—';
    }

    // Linux.
    if (platform === 'linux') {
      const osRelease = await parseLinuxOsReleaseFile();

      name = osRelease['NAME'] ?? 'Linux';
      version = osRelease['VERSION'] ?? '—';
      build = osRelease['BUILD_ID'] ?? '—';
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
   * CLI Utility - Version - Get browser version.
   *
   * @private
   *
   * @returns {CLIUtilityVersionGetBrowserVersionReturns}
   *
   * @since 1.0.0
   */
  private static async getBrowserVersion(): CLIUtilityVersionGetBrowserVersionReturns {
    const platform = os.platform();

    let browsers: CLIUtilityVersionGetBrowserVersionBrowsers = {};

    // macOS (must have "./Contents/Info" file and "CFBundleShortVersionString" key).
    if (platform === 'darwin') {
      const supportedBrowsers = {
        chrome: 'Google Chrome.app',
        safari: 'Safari.app',
        edge: 'Microsoft Edge.app',
        firefox: 'Firefox.app',
        opera: 'Opera.app',
        brave: 'Brave Browser.app',
        vivaldi: 'Vivaldi.app',
        libreWolf: 'LibreWolf.app',
      };
      const pairs = await Promise.allSettled(
        Object.entries(supportedBrowsers).map(async (supportedBrowser) => {
          const key = supportedBrowser[0];
          const appName = supportedBrowser[1];
          const system = `/Applications/${appName}`;
          const user = `${process.env['HOME'] ?? ''}/Applications/${appName}`;

          const [hasSystem, hasUser] = await Promise.all([pathExists(system), pathExists(user)]);
          const appPath = (hasSystem) ? system : (hasUser) ? user : null;

          if (appPath === null) {
            return null;
          }

          const versionResponse = await executeShell(`defaults read "${appPath}/Contents/Info" CFBundleShortVersionString`);

          if (versionResponse.code !== 0) {
            return null;
          }

          const version = versionResponse.textOut.trim();

          return [key, version] as const;
        }),
      );
      const entries = pairs
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value)
        .filter((value) => value !== null);

      browsers = {
        ...browsers,
        ...Object.fromEntries(entries),
      };
    }

    // Windows (must be registered into "App Paths" and have "VersionInfo.ProductVersion" key).
    if (platform === 'win32') {
      const supportedBrowsers = {
        chrome: 'chrome.exe',
        edge: 'msedge.exe',
        firefox: 'firefox.exe',
        opera: 'opera.exe',
        brave: 'brave.exe',
        vivaldi: 'vivaldi.exe',
      };
      const pairs = await Promise.allSettled(
        Object.entries(supportedBrowsers).map(async (supportedBrowser) => {
          const key = supportedBrowser[0];
          const exeName = supportedBrowser[1];
          const query = await parseWindowsRegistryQuery([
            `HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\${exeName}`,
            `HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\${exeName}`,
            `HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\App Paths\\${exeName}`,
          ]);

          // Skip if the "(Default)" key does not exist.
          if (query['(Default)'] === undefined) {
            return null;
          }

          // Access the "(Default)" key's data.
          let exePath = query['(Default)'].data;

          // Remove double quotes from the ends of the string.
          exePath = exePath.replace(PATTERN_DOUBLE_QUOTED_STRING_CAPTURE, '$1');

          // Get the product version through the PowerShell command via Command Prompt.
          const version = (await executeShell(`powershell -Command "(Get-Item '${exePath}').VersionInfo.ProductVersion"`)).textOut.trim();

          return [key, version] as const;
        }),
      );
      const entries = pairs
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value)
        .filter((value) => value !== null);

      browsers = {
        ...browsers,
        ...Object.fromEntries(entries),
      };
    }

    // Linux (must have a command that exists in PATH and supports the "--version" argument).
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
      const pairs = await Promise.allSettled(
        Object.entries(supportedBrowsers).map(async (supportedBrowser) => {
          const key = supportedBrowser[0];
          const commandName = supportedBrowser[1];
          const commandResponse = await executeShell(`command -v ${commandName}`);

          // The browser isn't installed.
          if (commandResponse.code !== 0) {
            return null;
          }

          const versionResponse = await executeShell(`${commandName} --version`);

          if (versionResponse.code !== 0) {
            return null;
          }

          const version = versionResponse.textOut.trim().replace(PATTERN_LEADING_NON_DIGITS, '');

          return [key, version] as const;
        }),
      );
      const entries = pairs
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value)
        .filter((value) => value !== null);

      browsers = {
        ...browsers,
        ...Object.fromEntries(entries),
      };
    }

    return browsers;
  }

  /**
   * CLI Utility - Version - Get interpreter version.
   *
   * @private
   *
   * @returns {CLIUtilityVersionGetInterpreterVersionReturns}
   *
   * @since 1.0.0
   */
  private static async getInterpreterVersion(): CLIUtilityVersionGetInterpreterVersionReturns {
    const [javaVersion, rustVersion] = await Promise.all([
      executeShell('java --version'),
      executeShell('rustc --version'),
    ]);

    let interpreters: CLIUtilityVersionGetInterpreterVersionInterpreters = {};

    // Attempt to retrieve the Java version.
    if (javaVersion.code === 0) {
      const match = javaVersion.textOut.match(new RegExp(PATTERN_JAVA_VERSION_LINE, 'mi'));
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
    if (rustVersion.code === 0) {
      const match = rustVersion.textOut.match(PATTERN_RUSTC_VERSION_LINE);
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
