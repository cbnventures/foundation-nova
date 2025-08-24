/**
 * Build Copier - Copy directory.
 *
 * @since 1.0.0
 */
export type BuildCopierCopyDirectorySourcePath = string;

export type BuildCopierCopyDirectoryDestinationPath = string;

export type BuildCopierCopyDirectoryReturns = Promise<void>;

/**
 * Build Copier - Get workspaces.
 *
 * @since 1.0.0
 */
export type BuildCopierGetWorkspacesReturns = Promise<string[]>;

/**
 * Build Copier - List subdirectories.
 *
 * @since 1.0.0
 */
export type BuildCopierListSubdirectoriesRootDirectory = string;

export type BuildCopierListSubdirectoriesReturns = string[];
