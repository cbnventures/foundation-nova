/**
 * Execute shell.
 *
 * @since 1.0.0
 */
export type ExecuteShellCommand = string;

export type ExecuteShellReturnsText = string;

export type ExecuteShellReturnsErrorCode = number;

export type ExecuteShellReturns = {
  text: ExecuteShellReturnsText;
  errorCode: ExecuteShellReturnsErrorCode;
};

/**
 * Is exec sync error.
 *
 * @since 1.0.0
 */
export type IsExecSyncErrorError = unknown;

export type IsExecSyncErrorTypeGuardStatus = number | null;

export type IsExecSyncErrorTypeGuardSignal = NodeJS.Signals | null;

export type IsExecSyncErrorTypeGuardStdout = string;

export type IsExecSyncErrorTypeGuardStderr = string;

export type IsExecSyncErrorTypeGuardPid = number;

export type IsExecSyncErrorTypeGuardOutput = Array<string | null>;

export type IsExecSyncErrorTypeGuard = Error & {
  status?: IsExecSyncErrorTypeGuardStatus;
  signal?: IsExecSyncErrorTypeGuardSignal;
  stdout?: IsExecSyncErrorTypeGuardStdout;
  stderr?: IsExecSyncErrorTypeGuardStderr;
  pid?: IsExecSyncErrorTypeGuardPid;
  output?: IsExecSyncErrorTypeGuardOutput;
};

export type IsExecSyncErrorObject = Record<string, unknown>;

/**
 * Parse linux os release file.
 *
 * @since 1.0.0
 */
export type ParseLinuxOsReleaseFileOsReleaseEntry = string;

export type ParseLinuxOsReleaseFileOsReleaseEntries = {
  [key: string]: ParseLinuxOsReleaseFileOsReleaseEntry;
};

export type ParseLinuxOsReleaseFileReturns = ParseLinuxOsReleaseFileOsReleaseEntries;

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

export type ParseWindowsRegistryQueryReturns = ParseWindowsRegistryQueryRegistryKeys;
