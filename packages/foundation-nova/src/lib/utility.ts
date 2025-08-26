import { execSync } from 'child_process';

import { TEXT_REGISTRY_QUERY_LINE_PATTERN, TEXT_LINE_SPLIT, TEXT_QUOTED_STRING_PATTERN } from '@/lib/regex.js';
import type {
  ExecuteShellCommand,
  ExecuteShellOptions,
  ExecuteShellReturns,
  ParseLinuxOsReleaseFileOsReleaseEntries,
  ParseLinuxOsReleaseFileReturns,
  ParseWindowsRegistryQueryRegistryKeys,
  ParseWindowsRegistryQueryRegistryKeyType,
  ParseWindowsRegistryQueryRegistryPaths,
  ParseWindowsRegistryQueryReturns,
} from '@/types/utility.d.ts';

/**
 * Execute shell.
 *
 * @param {ExecuteShellCommand} command   - Command.
 * @param {ExecuteShellOptions} [options] - Options.
 *
 * @returns {ExecuteShellReturns}
 *
 * @since 1.0.0
 */
export function executeShell(command: ExecuteShellCommand, options?: ExecuteShellOptions): ExecuteShellReturns {
  try {
    return execSync(command, {
      encoding: 'utf-8',
      ...options,
    }).trim();
  } catch {
    return null;
  }
}

/**
 * Parse linux os release file.
 *
 * @returns {ParseLinuxOsReleaseFileReturns}
 *
 * @since 1.0.0
 */
export function parseLinuxOsReleaseFile(): ParseLinuxOsReleaseFileReturns {
  const query = executeShell('cat /etc/os-release') ?? '';
  const lines = query.split(TEXT_LINE_SPLIT);

  let osReleaseEntries: ParseLinuxOsReleaseFileOsReleaseEntries = {};

  for (const line of lines) {
    // Skip empty or commented lines.
    if (line === '' || line.startsWith('#')) {
      continue;
    }

    const [key, ...rest] = line.split('=');

    if (key === undefined) {
      continue;
    }

    // Rejoin in case value itself contains "=".
    let value = rest.join('=');

    // Strip wrapping quotes.
    value = value.replace(TEXT_QUOTED_STRING_PATTERN, '$1');

    osReleaseEntries[key] = value;
  }

  return osReleaseEntries;
}

/**
 * Parse windows registry query.
 *
 * @param {ParseWindowsRegistryQueryRegistryPaths} registryPaths - Registry paths.
 *
 * @returns {ParseWindowsRegistryQueryReturns}
 *
 * @since 1.0.0
 */
export function parseWindowsRegistryQuery(registryPaths: ParseWindowsRegistryQueryRegistryPaths): ParseWindowsRegistryQueryReturns {
  const paths = Array.isArray(registryPaths) ? registryPaths : [registryPaths];

  for (const path of paths) {
    const query = executeShell(`reg query "${path}" 2>nul`) ?? '';
    const lines = query.split(TEXT_LINE_SPLIT);

    let registryKeys: ParseWindowsRegistryQueryRegistryKeys = {};

    for (const line of lines) {
      const matches = line.match(TEXT_REGISTRY_QUERY_LINE_PATTERN);

      if (matches !== null) {
        const registryKey = matches[1];
        const registryKeyType = matches[2];
        const registryKeyData = matches[3];

        if (
          registryKey !== undefined
          && registryKeyType !== undefined
          && registryKeyData !== undefined
        ) {
          registryKeys[registryKey] = {
            type: registryKeyType as ParseWindowsRegistryQueryRegistryKeyType,
            data: registryKeyData.trim(),
          };
        }
      }
    }

    // If we parsed any keys for this path, return immediately (fallback behavior).
    if (Object.keys(registryKeys).length > 0) {
      return registryKeys;
    }
  }

  // No results.
  return {};
}
