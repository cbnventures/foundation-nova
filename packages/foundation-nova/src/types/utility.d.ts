/**
 * Execute shell.
 *
 * @since 1.0.0
 */
export type ExecuteShellCommand = string;

export type ExecuteShellReturns = string | null;

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
export type ParseWindowsRegistryQueryRegistryPath = string;

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
