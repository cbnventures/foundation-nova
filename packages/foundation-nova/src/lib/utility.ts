import { exec, spawn } from 'child_process';
import { promises } from 'fs';
import os from 'os';
import { promisify } from 'util';

import {
  CHARACTER_SINGLE_QUOTE,
  LINEBREAK_CRLF_OR_LF,
  PATTERN_DOUBLE_QUOTED_STRING_CAPTURE,
  PATTERN_REGISTRY_QUERY_LINE,
} from '@/lib/regex.js';
import type {
  DetectUnixShellReturns,
  ExecuteShellCommand,
  ExecuteShellReturns,
  IsCommandExistsCommand,
  IsCommandExistsReturns,
  IsExecuteShellErrorError,
  IsExecuteShellErrorObject,
  IsExecuteShellErrorTypeGuard,
  ParseLinuxOsReleaseFileOsReleaseEntries,
  ParseLinuxOsReleaseFileReturns,
  ParseWindowsRegistryQueryRegistryKeys,
  ParseWindowsRegistryQueryRegistryKeyType,
  ParseWindowsRegistryQueryRegistryPaths,
  ParseWindowsRegistryQueryReturns,
  PathExistsPath,
  PathExistsReturns,
} from '@/types/utility.d.ts';

/**
 * Detect unix shell.
 *
 * @returns {DetectUnixShellReturns}
 *
 * @since 1.0.0
 */
export function detectUnixShell(): DetectUnixShellReturns {
  const platform = os.platform();

  let shell = process.env['SHELL'] ?? '/bin/sh';

  // macOS.
  if (platform === 'darwin') {
    shell = '/bin/zsh';
  }

  // Linux.
  if (platform === 'linux') {
    shell = '/bin/bash';
  }

  // IBM AIX and Solaris / illumos.
  if (['aix', 'sunos'].includes(platform)) {
    shell = '/bin/ksh';
  }

  return shell;
}

/**
 * Execute shell.
 *
 * @param {ExecuteShellCommand} command - Command.
 *
 * @returns {ExecuteShellReturns}
 *
 * @since 1.0.0
 */
export async function executeShell(command: ExecuteShellCommand): ExecuteShellReturns {
  const execAsync = promisify(exec);
  const platform = os.platform();

  let fullCommand;

  if (platform === 'win32') {
    fullCommand = `cmd.exe /d /s /c '${command} 2>&1'`;
  } else {
    const shell = detectUnixShell();
    const payload = `${command} 2>&1`.replace(new RegExp(CHARACTER_SINGLE_QUOTE, 'g'), '\'\\\'\'');

    if (shell === '/bin/sh') {
      // todo test on /bin/sh. need to create our own beautiful console logger.
      console.warn('"executeShell" running in compatibility mode. Some versions may not be detected.');

      fullCommand = `${shell} -c '${payload}'`;
    } else {
      // Make the execution look like a normal interactive shell, but without interactivity side effects.
      fullCommand = `set +m; ${shell} -l -i -c '${payload}'; set -m;`;
    }
  }

  // todo convert this to a debug command.
  console.info('fullCommand', fullCommand);

  try {
    const { stdout } = await execAsync(fullCommand, {
      encoding: 'utf-8',
      windowsHide: true,
      timeout: 15000,
      env: {
        ...process.env,
        ...(process.env['PATH'] !== undefined && process.env['_VOLTA_TOOL_RECURSION'] !== undefined) ? {
          PATH: `C:\\Program Files\\Volta\\;${process.env['PATH']}`,
        } : {},
        ...(await isCommandExists('corepack')) ? {
          COREPACK_ENABLE_STRICT: '0',
        } : {},
      },
      cwd: process.cwd(),
      maxBuffer: 8 * 1024 * 1024, // 8 MB.
    });

    // todo convert this to a debug command.
    console.info('ok response', {
      text: stdout.trim(),
      code: 0,
    });

    // "stderr" is already redirected into "stdout" (via "2>&1"), so "text" includes both.
    return {
      text: stdout.trim(),
      code: 0,
    };
  } catch (error) {
    let text = '';
    let code = 1;

    if (isExecuteShellError(error)) {
      if (error.stdout !== undefined) {
        text = `${error.stdout}`;
      }

      if (error.code !== undefined) {
        code = error.code;
      }
    }

    // todo convert this to a debug command.
    console.info('fail response', {
      text: text.trim(),
      code: 0,
    });

    return {
      text: text.trim(),
      code: code,
    };
  }
}

/**
 * Is command exists.
 *
 * @param {IsCommandExistsCommand} command - Command.
 *
 * @returns {IsCommandExistsReturns}
 *
 * @since 1.0.0
 */
export async function isCommandExists(command: IsCommandExistsCommand): IsCommandExistsReturns {
  return new Promise((resolve) => {
    const childProcess = spawn(command, {
      stdio: 'ignore',
    });

    // If the command is missing from PATH, Node emits an "error" (ENOENT).
    childProcess.once('error', () => {
      return resolve(false);
    });

    // If the command exists.
    childProcess.once('exit', () => {
      return resolve(true);
    });
  });
}

/**
 * Is execute shell error.
 *
 * @param {IsExecuteShellErrorError} error - Error.
 *
 * @returns {boolean}
 *
 * @since 1.0.0
 */
export function isExecuteShellError(error: IsExecuteShellErrorError): error is IsExecuteShellErrorTypeGuard {
  if (error === null || typeof error !== 'object') {
    return false;
  }

  const object = error as IsExecuteShellErrorObject;
  const hasCmd = 'cmd' in object && typeof object['cmd'] === 'string';
  const hasKilled = 'killed' in object && typeof object['killed'] === 'boolean';
  const hasCode = 'code' in object && typeof object['code'] === 'number';
  const hasSignal = 'signal' in object && typeof object['signal'] === 'string';

  // Worth noting that "stderr" is merged into "stdout" and encoding is forced to "string".
  const hasStdout = 'stdout' in object && typeof object['stdout'] === 'string';
  const hasStderr = 'stderr' in object && typeof object['stderr'] === 'string';

  // Treat presence of any canonical "execAsync" fields as sufficient.
  return hasCmd || hasKilled || hasCode || hasSignal || hasStdout || hasStderr;
}

/**
 * Parse linux os release file.
 *
 * @returns {ParseLinuxOsReleaseFileReturns}
 *
 * @since 1.0.0
 */
export async function parseLinuxOsReleaseFile(): ParseLinuxOsReleaseFileReturns {
  const query = await executeShell('cat /etc/os-release');
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
    value = value.replace(PATTERN_DOUBLE_QUOTED_STRING_CAPTURE, '$1');

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
export async function parseWindowsRegistryQuery(registryPaths: ParseWindowsRegistryQueryRegistryPaths): ParseWindowsRegistryQueryReturns {
  const paths = Array.isArray(registryPaths) ? registryPaths : [registryPaths];

  for (const path of paths) {
    const query = await executeShell(`reg query "${path}"`);
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

/**
 * Path exists.
 *
 * @param {PathExistsPath} path - Path.
 *
 * @returns {PathExistsReturns}
 *
 * @since 1.0.0
 */
export async function pathExists(path: PathExistsPath): PathExistsReturns {
  try {
    await promises.access(path);

    return true;
  } catch {
    return false;
  }
}
