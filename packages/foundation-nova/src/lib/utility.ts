import { execSync } from 'child_process';
import os from 'os';

import {
  CHARACTER_SINGLE_QUOTE,
  LINEBREAK_CRLF_OR_LF,
  PATTERN_QUOTED_STRING_CAPTURE,
  PATTERN_REGISTRY_QUERY_LINE,
} from '@/lib/regex.js';
import type {
  ExecuteShellCommand,
  ExecuteShellReturns,
  IsExecSyncErrorError,
  IsExecSyncErrorObject,
  IsExecSyncErrorTypeGuard,
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
 * @param {ExecuteShellCommand} command - Command.
 *
 * @returns {ExecuteShellReturns}
 *
 * @since 1.0.0
 */
export function executeShell(command: ExecuteShellCommand): ExecuteShellReturns {
  let fullCommand;

  if (os.platform() === 'win32') {
    fullCommand = `${command} 2>&1`;
  } else {
    // Use the user's login shell so profiles load, like Terminal.
    const shell = process.env['SHELL'] || ((os.platform() === 'darwin') ? '/bin/zsh' : '/bin/bash');
    const payload = `${command} 2>&1`.replace(new RegExp(CHARACTER_SINGLE_QUOTE, 'g'), '\'\\\'\'');

    fullCommand = `${shell} -l -i -c '${payload}'`;
  }

  try {
    const out = execSync(fullCommand, {
      encoding: 'utf8',
      stdio: [
        'ignore',
        'pipe',
        'pipe',
      ],
      windowsHide: true,
      timeout: 15000,
      env: {
        ...process.env,
        ...(process.env['PATH'] !== undefined && process.env['_VOLTA_TOOL_RECURSION'] !== undefined) ? {
          PATH: `C:\\Program Files\\Volta\\;${process.env['PATH']}`,
        } : {},
        COREPACK_ENABLE_STRICT: '0',
      },
      cwd: process.cwd(),
      maxBuffer: 8 * 1024 * 1024, // 8 MB.
    });

    return {
      text: out.trimEnd(),
      errorCode: 0,
    };
  } catch (error) {
    let text = '';
    let code = 1;

    if (isExecSyncError(error)) {
      if (error.stdout !== undefined) {
        text = `${error.stdout}`;
      }

      // Concatenate the error message.
      if (error.stderr !== undefined) {
        text = (text !== '') ? `${text} ${error.stderr}` : `${error.stderr}`;
      }

      if (error.status != null) {
        code = error.status;
      }
    }

    return {
      text: text.trimEnd(),
      errorCode: code,
    };
  }
}

/**
 * Is exec sync error.
 *
 * @param {IsExecSyncErrorError} error - Error.
 *
 * @returns {boolean}
 *
 * @since 1.0.0
 */
export function isExecSyncError(error: IsExecSyncErrorError): error is IsExecSyncErrorTypeGuard {
  if (error === null || typeof error !== 'object') {
    return false;
  }

  const object = error as IsExecSyncErrorObject;
  const hasStatus = 'status' in object && (object['status'] === null || typeof object['status'] === 'number');
  const hasSignal = 'signal' in object && (object['signal'] === null || typeof object['signal'] === 'string');
  const hasProcessId = 'pid' in object && typeof object['pid'] === 'number';
  const hasOutput = 'output' in object && Array.isArray(object['output']);
  const hasStdout = 'stdout' in object && typeof object['stdout'] === 'string';
  const hasStderr = 'stderr' in object && typeof object['stderr'] === 'string';

  // Treat presence of any canonical "execSync" fields as sufficient.
  return hasStatus || hasSignal || hasProcessId || hasOutput || hasStdout || hasStderr;
}

/**
 * Parse linux os release file.
 *
 * @returns {ParseLinuxOsReleaseFileReturns}
 *
 * @since 1.0.0
 */
export function parseLinuxOsReleaseFile(): ParseLinuxOsReleaseFileReturns {
  const query = executeShell('cat /etc/os-release');
  const lines = query.text.split(LINEBREAK_CRLF_OR_LF);
  const osReleaseEntries: ParseLinuxOsReleaseFileOsReleaseEntries = {};

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
    value = value.replace(PATTERN_QUOTED_STRING_CAPTURE, '$1');

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
    const query = executeShell(`reg query "${path}"`);
    const lines = query.text.split(LINEBREAK_CRLF_OR_LF);
    const registryKeys: ParseWindowsRegistryQueryRegistryKeys = {};

    for (const line of lines) {
      const matches = line.match(PATTERN_REGISTRY_QUERY_LINE);

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
