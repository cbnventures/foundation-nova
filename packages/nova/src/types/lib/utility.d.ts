import type { ExecException } from 'child_process';

/**
 * Current timestamp.
 *
 * @since 1.0.0
 */
export type CurrentTimestampReturns = string;

/**
 * Current timestamp. - Pad left.
 *
 * @since 1.0.0
 */
export type CurrentTimestampPadLeftNumber = number;

export type CurrentTimestampPadLeftWidth = number;

export type CurrentTimestampPadLeftReturns = string;

/**
 * Detect shell.
 *
 * @since 1.0.0
 */
export type DetectShellReturns =
  'cmd.exe'
  | '/bin/bash'
  | '/bin/ksh'
  | '/bin/sh'
  | '/bin/zsh';

/**
 * Discover paths with file.
 *
 * @since 1.0.0
 */
export type DiscoverPathsWithFileFileName = string;

export type DiscoverPathsWithFileDirection = 'backward' | 'forward';

export type DiscoverPathsWithFileReturns = Promise<string[]>;

export type DiscoverPathsWithFileResults = string[];

export type DiscoverPathsWithFileVisited = string;

/**
 * Execute shell.
 *
 * @since 1.0.0
 */
export type ExecuteShellCommand = string;

export type ExecuteShellReturnsOut = string;

export type ExecuteShellReturnsError = string;

export type ExecuteShellReturnsCode = number;

export type ExecuteShellReturns = Promise<{
  textOut: ExecuteShellReturnsOut;
  textError: ExecuteShellReturnsError;
  code: ExecuteShellReturnsCode;
}>;

export type ExecuteShellQuotePosixString = string;

export type ExecuteShellQuoteWindowsString = string;

/**
 * Is command exists.
 *
 * @since 1.0.0
 */
export type IsCommandExistsCommand = string;

export type IsCommandExistsReturns = Promise<boolean>;

/**
 * Is execute shell error.
 *
 * @since 1.0.0
 */
export type IsExecuteShellErrorError = unknown;

export type IsExecuteShellErrorTypeGuard = IsExecuteShellErrorObject;

export type IsExecuteShellErrorObject = ExecException;

/**
 * Parse linux os release file.
 *
 * @since 1.0.0
 */
export type ParseLinuxOsReleaseFileOsReleaseEntry = string;

export type ParseLinuxOsReleaseFileOsReleaseEntries = {
  [key: string]: ParseLinuxOsReleaseFileOsReleaseEntry;
};

export type ParseLinuxOsReleaseFileReturns = Promise<ParseLinuxOsReleaseFileOsReleaseEntries>;

/**
 * Parse windows registry query.
 *
 * @since 1.0.0
 */
export type ParseWindowsRegistryQueryRegistryPaths = string | string[];

export type ParseWindowsRegistryQueryRegistryKeyType =
  'REG_NONE'
  | 'REG_SZ'
  | 'REG_EXPAND_SZ'
  | 'REG_BINARY'
  | 'REG_DWORD'
  | 'REG_DWORD_LITTLE_ENDIAN'
  | 'REG_DWORD_BIG_ENDIAN'
  | 'REG_MULTI_SZ'
  | 'REG_LINK'
  | 'REG_FULL_RESOURCE_DESCRIPTOR'
  | 'REG_RESOURCE_LIST'
  | 'REG_RESOURCE_REQUIREMENTS_LIST'
  | 'REG_QWORD'
  | 'REG_QWORD_LITTLE_ENDIAN';

export type ParseWindowsRegistryQueryRegistryKeyData = string;

export type ParseWindowsRegistryQueryRegistryKey = {
  type: ParseWindowsRegistryQueryRegistryKeyType;
  data: ParseWindowsRegistryQueryRegistryKeyData;
};

export type ParseWindowsRegistryQueryRegistryKeys = {
  [key: string]: ParseWindowsRegistryQueryRegistryKey;
};

export type ParseWindowsRegistryQueryReturns = Promise<ParseWindowsRegistryQueryRegistryKeys>;

/**
 * Path exists.
 *
 * @since 1.0.0
 */
export type PathExistsPath = string;

export type PathExistsReturns = Promise<boolean>;
