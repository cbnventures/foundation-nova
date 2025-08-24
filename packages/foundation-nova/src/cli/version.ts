import os from 'os';

import { CHARACTER_LEADING_V } from '@/lib/regex.js';
import { executeShell, parseLinuxOsReleaseFile, parseWindowsRegistryQuery } from '@/lib/utility.js';
import type {
  CLIVersionGetNodeVerReturns,
  CLIVersionGetOsVerArchitecture,
  CLIVersionGetOsVerBuild,
  CLIVersionGetOsVerDisplayName,
  CLIVersionGetOsVerKernel,
  CLIVersionGetOsVerName,
  CLIVersionGetOsVerReturns,
  CLIVersionGetOsVerSystemDetail,
  CLIVersionGetOsVerVersion,
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
    let list = {};

    // Get environment versions related to Node.
    if (options.node || options.all) {
      list = {
        ...list,
        ...CLIVersion.getNodeVer(),
      };
    }

    // Get environment versions related to your OS.
    if (options.os || options.all) {
      list = {
        ...list,
        ...CLIVersion.getOsVer(),
      };
    }

    // Print out the options to the UI.
    console.log(list);
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
    const displayName: CLIVersionGetOsVerDisplayName = [];
    const systemDetail: CLIVersionGetOsVerSystemDetail = [];
    const platform = os.platform();

    let name: CLIVersionGetOsVerName = platform;
    let version: CLIVersionGetOsVerVersion = os.version() ?? null;
    let build: CLIVersionGetOsVerBuild = null;
    let architecture: CLIVersionGetOsVerArchitecture = os.arch();
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

    // Build the display name parts.
    displayName.push(name);

    if (version !== null) {
      displayName.push(version);
    }

    // Build the system detail parts.
    systemDetail.push(`architecture: ${architecture}`);

    if (build !== null) {
      systemDetail.push(`build: ${build}`);
    }

    systemDetail.push(`kernel: ${kernel}`);

    return {
      os: `${displayName.join(' ')} (${systemDetail.join(', ')})`,
    };
  }
}
