import os from 'os';

import chalk from 'chalk';

import {
  itemBrandPrettyNames,
  itemCategoryPrettyNames,
  itemColumnTitlePrettyNames,
  itemTypePrettyNames,
} from '@/lib/item.js';
import { MarkdownTable } from '@/lib/markdown-table.js';
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
  CLIVersionRunTasks,
} from '@/types/cli.d.ts';

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
  public static async run(options: CLIVersionRunOptions): CLIVersionRunReturns {
    const tasks: CLIVersionRunTasks = [];

    // Node.js + Tools.
    if (options.node || options.all) {
      tasks.push(CLIVersion.getNodeVersion().then((response) => ['node', response]));
    }

    // Environment Managers.
    if (options.env || options.all) {
      tasks.push(CLIVersion.getEnvironmentManagerVersion().then((response) => ['env', response]));
    }

    // Operating System.
    if (options.os || options.all) {
      tasks.push(CLIVersion.getOsVersion().then((response) => ['os', response]));
    }

    // Web Browsers.
    if (options.browser || options.all) {
      tasks.push(CLIVersion.getBrowserVersion().then((response) => ['browsers', response]));
    }

    // Interpreters / Runtimes.
    if (options.interpreter || options.all) {
      tasks.push(CLIVersion.getInterpreterVersion().then((response) => ['interpreters', response]));
    }

    // Run all async calls in parallel and convert the results back to the list.
    const results = await Promise.all(tasks);
    const list = Object.fromEntries(results) as CLIVersionRunList;

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
      console.info(`\n${itemCategoryPrettyNames[category] ?? chalk.grey(category)}`);
      console.info(table.render());
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
  private static async getNodeVersion(): CLIVersionGetNodeVersionReturns {
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

    let tools: CLIVersionGetNodeVersionTools = {};

    // Attempt to retrieve the Node.js version.
    if (nodeJsVersion.code === 0) {
      const match = nodeJsVersion.text.match(PATTERN_SEMVER)?.[1];

      if (match !== undefined) {
        tools = {
          ...tools,
          nodeJs: match,
        };
      }
    }

    // Attempt to retrieve the Node Package Manager (npm) version.
    if (npmVersion.code === 0) {
      const match = npmVersion.text.match(PATTERN_SEMVER)?.[1];

      if (match !== undefined) {
        tools = {
          ...tools,
          npm: match,
        };
      }
    }

    // Attempt to retrieve the Yarn version.
    if (yarnVersion.code === 0) {
      const match = yarnVersion.text.match(PATTERN_SEMVER)?.[1];

      if (match !== undefined) {
        tools = {
          ...tools,
          yarn: match,
        };
      }
    }

    // Attempt to retrieve the Performant Node Package Manager (pnpm) version.
    if (pnpmVersion.code === 0) {
      const match = pnpmVersion.text.match(PATTERN_SEMVER)?.[1];

      if (match !== undefined) {
        tools = {
          ...tools,
          pnpm: match,
        };
      }
    }

    // Attempt to retrieve the Bun version.
    if (bunVersion.code === 0) {
      const match = bunVersion.text.match(PATTERN_SEMVER)?.[1];

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
  private static async getEnvironmentManagerVersion(): CLIVersionGetEnvironmentManagerVersionReturns {
    const [nvmVersion, voltaVersion] = await Promise.all([
      executeShell('nvm --version'),
      executeShell('volta --version'),
    ]);

    let managers: CLIVersionGetEnvironmentManagerVersionManagers = {};

    // Attempt to retrieve the Node Version Manager (nvm-posix) version.
    if (os.platform() !== 'win32' && nvmVersion.code === 0) {
      const match = nvmVersion.text.match(PATTERN_SEMVER)?.[1];

      if (match !== undefined) {
        managers = {
          ...managers,
          nvmPosix: match,
        };
      }
    }

    // Attempt to retrieve the Node Version Manager for Windows (nvm-windows) version.
    if (os.platform() === 'win32' && nvmVersion.code === 0) {
      const match = nvmVersion.text.match(PATTERN_SEMVER)?.[1];

      if (match !== undefined) {
        managers = {
          ...managers,
          nvmWindows: match,
        };
      }
    }

    // Attempt to retrieve the Volta version.
    if (voltaVersion.code === 0) {
      const match = voltaVersion.text.match(PATTERN_SEMVER)?.[1];

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
  private static async getOsVersion(): CLIVersionGetOsVersionReturns {
    const platform = os.platform();
    const architecture: CLIVersionGetOsVersionArchitecture = os.arch();
    const kernel: CLIVersionGetOsVersionKernel = os.release();

    let name: CLIVersionGetOsVersionName = platform;
    let version: CLIVersionGetOsVersionVersion = os.version();
    let build: CLIVersionGetOsVersionBuild = '—';

    // macOS.
    if (platform === 'darwin') {
      const [productName, productVersion, buildVersion] = await Promise.all([
        executeShell('sw_vers -productName'),
        executeShell('sw_vers -productVersion'),
        executeShell('sw_vers -buildVersion'),
      ]);

      name = productName.text ?? 'macOS';
      version = productVersion.text ?? version;
      build = buildVersion.text ?? '—';
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
   * CLI Version - Get browser version.
   *
   * @private
   *
   * @returns {CLIVersionGetBrowserVersionReturns}
   *
   * @since 1.0.0
   */
  private static async getBrowserVersion(): CLIVersionGetBrowserVersionReturns {
    const platform = os.platform();

    let browsers: CLIVersionGetBrowserVersionBrowsers = {};

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

          const version = versionResponse.text.trim();

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
          const version = (await executeShell(`powershell -Command "(Get-Item '${exePath}').VersionInfo.ProductVersion"`)).text.trim();

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

          const version = versionResponse.text.trim().replace(PATTERN_LEADING_NON_DIGITS, '');

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
   * CLI Version - Get interpreter version.
   *
   * @private
   *
   * @returns {CLIVersionGetInterpreterVersionReturns}
   *
   * @since 1.0.0
   */
  private static async getInterpreterVersion(): CLIVersionGetInterpreterVersionReturns {
    const [javaVersion, rustVersion] = await Promise.all([
      executeShell('java --version'),
      executeShell('rustc --version'),
    ]);

    let interpreters: CLIVersionGetInterpreterVersionInterpreters = {};

    // Attempt to retrieve the Java version.
    if (javaVersion.code === 0) {
      const match = javaVersion.text.match(new RegExp(PATTERN_JAVA_VERSION_LINE, 'mi'));
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
      const match = rustVersion.text.match(PATTERN_RUSTC_VERSION_LINE);
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
