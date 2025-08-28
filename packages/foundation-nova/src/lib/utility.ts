import { execSync } from 'child_process';
import os from 'os';

import { TEXT_REGISTRY_QUERY_LINE_PATTERN, TEXT_LINE_SPLIT, TEXT_QUOTED_STRING_PATTERN } from '@/lib/regex.js';
import type {
  ExecuteShellCommand,
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
 * @param {ExecuteShellCommand} command - Command.
 *
 * @returns {ExecuteShellReturns}
 *
 * @since 1.0.0
 */
export function executeShell(command: ExecuteShellCommand): ExecuteShellReturns {
  let fullCommand;

  // Build one launcher string per OS that mimics a real user session.
  if (os.platform() !== 'win32') {
    // Use the user's login shell so profiles load, like Terminal.
    const shell = process.env['SHELL'] || ((os.platform() === 'darwin') ? '/bin/zsh' : '/bin/bash');
    const payload = `${command} 2>&1`.replace(/'/g, '\'\\\'\'');

    fullCommand = `${shell} -l -i -c '${payload}'`;
  } else {
    // Use Command Prompt with startup behavior (AutoRun) via an inner cmd.
    const payloadWin = `${command} 2>&1`.replace(/"/g, '""');

    fullCommand = `cmd /s /c "${payloadWin}"`;
  }

  try {
    console.log(fullCommand); // todo

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
        ...(os.platform() === 'win32') ? {
          // Workaround to make Volta's commands available to Node.js.
          PATH: `C:\\Program Files\\Volta\\;${process.env['PATH']}`,
        } : {},
        COREPACK_ENABLE_STRICT: '0',
      },
      cwd: process.cwd(),
      maxBuffer: 8 * 1024 * 1024, // 8 MB.
    });

    return {
      text: String(out).trimEnd(),
      error: 0,
    };
  } catch {
    let text = '';
    let code = 1;

    return {
      text: text.trimEnd(),
      error: code,
    };
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
  const query = executeShell('cat /etc/os-release');
  const lines = query.text.split(TEXT_LINE_SPLIT);

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
    const query = executeShell(`reg query "${path}"`);
    const lines = query.text.split(TEXT_LINE_SPLIT);

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
