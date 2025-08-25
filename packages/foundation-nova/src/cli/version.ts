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
import { CHARACTER_LEADING_V } from '@/lib/regex.js';
import { executeShell, parseLinuxOsReleaseFile, parseWindowsRegistryQuery } from '@/lib/utility.js';
import type {
  CLIVersionGetBrowserVerBrowsers,
  CLIVersionGetBrowserVerReturns,
  CLIVersionGetNodeVerReturns,
  CLIVersionGetOsVerArchitecture,
  CLIVersionGetOsVerBuild,
  CLIVersionGetOsVerKernel,
  CLIVersionGetOsVerName,
  CLIVersionGetOsVerReturns,
  CLIVersionGetOsVerVersion,
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

    // Get installation versions for your Node.js copy.
    if (options.node || options.all) {
      list = {
        ...list,
        node: CLIVersion.getNodeVer(),
      };
    }

    // Get installation versions for your operating system.
    if (options.os || options.all) {
      list = {
        ...list,
        os: CLIVersion.getOsVer(),
      };
    }

    // Get installation versions for your installed web browsers.
    if (options.browser || options.all) {
      list = {
        ...list,
        browsers: CLIVersion.getBrowserVer(),
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
      const table = new Table({
        head: [
          chalk.bold.yellow(itemColumnTitlePrettyNames[`key-${key}`] ?? 'Key'),
          chalk.bold.yellow(itemColumnTitlePrettyNames[`value-${key}`] ?? 'Value'),
        ],
        style: {
          head: [],
          border: [],
        },
        colWidths: [20, 25],
      });

      for (const [innerKey, innerValue] of Object.entries(value)) {
        table.push([
          itemBrandPrettyNames[innerKey] ?? itemTypePrettyNames[innerKey] ?? '—',
          innerValue,
        ]);
      }

      console.log(`\n${itemCategoryPrettyNames[key]}`);
      console.log(table.toString());
    }
  }

  /**
   * CLI Version - Get node ver.
   *
   * @private
   *
   * @returns {CLIVersionGetNodeVerReturns}
   *
   * @since 1.0.0
   */
  private static getNodeVer(): CLIVersionGetNodeVerReturns {
    let nodeJsVersion = null;
    let npmVersion = null;

    // Attempt to retrieve the Node.js version.
    try {
      nodeJsVersion = executeShell('node -v');

      // Remove the leading "v" from the version output.
      if (nodeJsVersion !== null) {
        nodeJsVersion = nodeJsVersion.replace(CHARACTER_LEADING_V, '');
      }
    } catch {
      /* empty */
    }

    // Attempt to retrieve the Node Package Manager (npm) version.
    try {
      npmVersion = executeShell('npm -v');
    } catch {
      /* empty */
    }

    return {
      nodeJs: nodeJsVersion,
      npm: npmVersion,
    };
  }

  /**
   * CLI Version - Get os ver.
   *
   * @private
   *
   * @returns {CLIVersionGetOsVerReturns}
   *
   * @since 1.0.0
   */
  private static getOsVer(): CLIVersionGetOsVerReturns {
    const platform = os.platform();

    let name: CLIVersionGetOsVerName = platform;
    let version: CLIVersionGetOsVerVersion = os.version() ?? null;
    let architecture: CLIVersionGetOsVerArchitecture = os.arch();
    let build: CLIVersionGetOsVerBuild = null;
    let kernel: CLIVersionGetOsVerKernel = os.release();

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
      const versionId = osRelease['VERSION_ID'];

      name = osRelease['PRETTY_NAME'] ?? osRelease['NAME'] ?? 'Linux';
      version = (versionId && !name.includes(versionId)) ? versionId : null;
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
   * CLI Version - Get browser ver.
   *
   * @private
   *
   * @returns {CLIVersionGetBrowserVerReturns}
   *
   * @since 1.0.0
   */
  private static getBrowserVer(): CLIVersionGetBrowserVerReturns {
    const platform = os.platform();

    let browsers: CLIVersionGetBrowserVerBrowsers = {};

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
}
