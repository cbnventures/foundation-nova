import { exec, spawn } from 'child_process';
import { promises as fs } from 'fs';
import * as os from 'os';
import * as path from 'path';
import { promisify } from 'util';

import {
  CHARACTER_DOUBLE_QUOTE,
  CHARACTER_SINGLE_QUOTE,
  LINEBREAK_CRLF_OR_LF,
  PATTERN_DOUBLE_QUOTED_STRING_CAPTURE,
  PATTERN_REGISTRY_QUERY_LINE,
} from '@/lib/regex.js';
import { Logger } from '@/toolkit/index.js';
import type {
  CurrentTimestampPadLeftNumber,
  CurrentTimestampPadLeftReturns,
  CurrentTimestampPadLeftWidth,
  CurrentTimestampReturns,
  DetectShellReturns,
  DiscoverPathsWithFileDirection,
  DiscoverPathsWithFileFileName,
  DiscoverPathsWithFileResults,
  DiscoverPathsWithFileReturns,
  DiscoverPathsWithFileVisited,
  ExecuteShellCommand,
  ExecuteShellQuotePosixString,
  ExecuteShellQuoteWindowsString,
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
} from '@/types/lib/utility.d.ts';

/**
 * Current timestamp.
 *
 * @returns {CurrentTimestampReturns}
 *
 * @since 1.0.0
 */
export function currentTimestamp(): CurrentTimestampReturns {
  const now = new Date();

  /**
   * Current timestamp - Pad left.
   *
   * @param {CurrentTimestampPadLeftNumber} number - Number.
   * @param {CurrentTimestampPadLeftWidth}  width  - Width.
   *
   * @private
   *
   * @returns {CurrentTimestampPadLeftReturns}
   *
   * @since 1.0.0
   */
  const padLeft = (number: CurrentTimestampPadLeftNumber, width: CurrentTimestampPadLeftWidth = 2): CurrentTimestampPadLeftReturns => {
    const currentWidth = (width < 2) ? 2 : width;

    return number.toString().padStart(currentWidth, '0');
  };

  const year = now.getFullYear();
  const month = padLeft(now.getMonth() + 1);
  const day = padLeft(now.getDate());
  const hour = padLeft(now.getHours());
  const minute = padLeft(now.getMinutes());
  const second = padLeft(now.getSeconds());
  const millisecond = now.getMilliseconds().toString().padStart(3, '0');

  const timezoneOffsetMinutes = -now.getTimezoneOffset();
  const timezoneSign = (timezoneOffsetMinutes >= 0) ? '+' : '-';
  const timezoneAbs = Math.abs(timezoneOffsetMinutes);
  const timezoneHours = padLeft(Math.trunc(timezoneAbs / 60));
  const timezoneMinutes = padLeft(timezoneAbs % 60);

  return `[${year}-${month}-${day} ${hour}:${minute}:${second}.${millisecond} ${timezoneSign}${timezoneHours}${timezoneMinutes}]`;
}

/**
 * Detect shell.
 *
 * @returns {DetectShellReturns}
 *
 * @since 1.0.0
 */
export function detectShell(): DetectShellReturns {
  const platform = os.platform();

  // Windows.
  if (platform === 'win32') {
    return 'cmd.exe';
  }

  // macOS.
  if (platform === 'darwin') {
    return '/bin/zsh';
  }

  // Linux.
  if (platform === 'linux') {
    return '/bin/bash';
  }

  // AIX / Solaris.
  if (['aix', 'sunos'].includes(platform)) {
    return '/bin/ksh';
  }

  return '/bin/sh';
}

/**
 * Discover paths with file.
 *
 * @param {DiscoverPathsWithFileFileName}  fileName  - File name.
 * @param {DiscoverPathsWithFileDirection} direction - Direction.
 *
 * @returns {DiscoverPathsWithFileReturns}
 *
 * @since 1.0.0
 */
export async function discoverPathsWithFile(fileName: DiscoverPathsWithFileFileName, direction: DiscoverPathsWithFileDirection): DiscoverPathsWithFileReturns {
  const startDirectory = process.cwd();
  const results: DiscoverPathsWithFileResults = [];

  if (direction === 'backward') {
    const rootDirectory = path.parse(startDirectory).root;

    let currentDirectory = startDirectory;

    while (true) {
      const targetPath = path.join(currentDirectory, fileName);

      try {
        Logger.customize({ name: 'discoverPathsWithFile::backward' }).debug(`Current directory: "${currentDirectory}"`);

        // Attempt to access the specified file.
        await fs.access(targetPath);

        // If specified file is found, the current directory is noted.
        results.push(currentDirectory);
      } catch {
        /* empty */
      }

      // Stop if current directory is the root directory.
      if (currentDirectory === rootDirectory) {
        break;
      }

      // Traverse towards the root directory.
      currentDirectory = path.dirname(currentDirectory);
    }
  }

  if (direction === 'forward') {
    const queue = [startDirectory];
    const visited = new Set<DiscoverPathsWithFileVisited>();
    const skipDirectories = new Set([
      'node_modules',
      'dist',
      'build',
      'out',
      'coverage',
    ]);

    while (queue.length > 0) {
      const currentDirectory = queue.shift();

      if (currentDirectory === undefined) {
        continue;
      }

      Logger.customize({ name: 'discoverPathsWithFile::forward' }).debug(`Current directory: "${currentDirectory}"`);

      let realDirectory: string;

      try {
        // Resolve symlinks to avoid visiting the same location multiple times.
        realDirectory = await fs.realpath(currentDirectory);
      } catch {
        continue;
      }

      if (visited.has(realDirectory)) {
        continue;
      }

      visited.add(realDirectory);

      let entries;

      try {
        // Attempt to read the directory contents.
        entries = await fs.readdir(realDirectory, { withFileTypes: true });
      } catch {
        continue;
      }

      let hasTargetFile = false;

      for (const entry of entries) {
        // If directory contains the target file.
        if (entry.isFile() && entry.name === fileName) {
          hasTargetFile = true;

          continue;
        }

        if (!entry.isDirectory()) {
          continue;
        }

        // Skips all dot-prefixed directory and what's listed in "skipDirectories".
        if (entry.name.startsWith('.') || skipDirectories.has(entry.name)) {
          continue;
        }

        const nextDirectory = path.join(realDirectory, entry.name);

        // Queue sub-directories for traversal.
        queue.push(nextDirectory);
      }

      if (hasTargetFile) {
        // Record directories that include the target file.
        results.push(realDirectory);
      }
    }
  }

  return results;
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
  const shell = detectShell();

  let fullCommand = command;

  const quotePosix = (string: ExecuteShellQuotePosixString) => string.replace(new RegExp(CHARACTER_SINGLE_QUOTE, 'g'), '\'\\\'\'');
  const quoteWindows = (string: ExecuteShellQuoteWindowsString) => string.replace(new RegExp(CHARACTER_DOUBLE_QUOTE, 'g'), '"');

  // Windows.
  if (shell === 'cmd.exe') {
    fullCommand = `cmd.exe /d /s /c "${quoteWindows(fullCommand)}"`;
  }

  // macOS.
  if (shell === '/bin/zsh') {
    fullCommand = `/bin/zsh -l -i -c '${quotePosix(fullCommand)}'`;
  }

  // Linux.
  if (shell === '/bin/bash') {
    fullCommand = `setsid -w /bin/bash -l -i -c '${quotePosix(fullCommand)}' </dev/null`;
  }

  // Fallback.
  if (shell === '/bin/sh') {
    fullCommand = `/bin/sh -c '${quotePosix(fullCommand)}'`;
  }

  try {
    const { stdout, stderr } = await execAsync(fullCommand, {
      encoding: 'utf-8',
      windowsHide: true,
      timeout: 15000,
      env: {
        ...process.env,
        ...(await isCommandExists('corepack')) ? {
          COREPACK_ENABLE_STRICT: '0',
        } : {},
        ...(process.env['_VOLTA_TOOL_RECURSION'] !== undefined) ? {
          PATH: [
            ...(process.env['ProgramW6432']) ? [`${process.env['ProgramW6432']}\\Volta\\`] : [],
            ...(process.env['LOCALAPPDATA']) ? [`${process.env['LOCALAPPDATA']}\\Volta\\bin`] : [],
            ...(process.env['PATH']) ? [process.env['PATH']] : [],
          ].join(';'),
        } : {},
        ...(shell === '/bin/bash') ? {
          PAGER: 'cat',
        } : {},
      },
      cwd: process.cwd(),
      maxBuffer: 8 * 1024 * 1024, // 8 MB.
    });

    const output = {
      textOut: stdout.trim(),
      textError: stderr.trim(),
      code: 0,
    };

    Logger.customize({ name: 'executeShell::command' }).debug(fullCommand);
    Logger.customize({ name: 'executeShell::output' }).debug(output);

    return output;
  } catch (error) {
    const output = {
      textOut: '',
      textError: '',
      code: 1,
    };

    if (isExecuteShellError(error)) {
      if (error.stdout !== undefined) {
        output.textOut = `${error.stdout}`;
      }

      if (error.stderr !== undefined) {
        output.textError = `${error.stderr}`;
      }

      if (error.code !== undefined) {
        output.code = error.code;
      }
    }

    Logger.customize({ name: 'executeShell::command' }).debug(fullCommand);
    Logger.customize({ name: 'executeShell::output' }).debug(output);

    return output;
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
  const isWin = os.platform() === 'win32';
  const bin = (isWin) ? 'where' : 'sh';
  const args = (isWin) ? ['/Q', command] : ['-c', `command -v "${command}" >/dev/null 2>&1`];

  return new Promise((resolve) => {
    const childProcess = spawn(bin, args, {
      stdio: 'ignore',
    });

    // If the command is missing from PATH, Node emits an "error" (ENOENT).
    childProcess.once('error', () => {
      return resolve(false);
    });

    // If the command exists.
    childProcess.once('exit', (code) => {
      return resolve(code === 0);
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
  const lines = query.textOut.split(LINEBREAK_CRLF_OR_LF);
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
    const lines = query.textOut.split(LINEBREAK_CRLF_OR_LF);
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
    await fs.access(path);

    return true;
  } catch {
    return false;
  }
}
