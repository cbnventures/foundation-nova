import type { Command, CommandUnknownOpts } from '@commander-js/extra-typings';
import type { ChalkInstance } from 'chalk';

/**
 * CLI - Execute feature command.
 *
 * @since 1.0.0
 */
export type CLIExecuteFeatureCommandSubcommand<Subcommand> = Subcommand;

export type CLIExecuteFeatureCommandOptions<Options> = {
  [OptionKey in keyof Options]?: true;
};

export type CLIExecuteFeatureCommandTarget = (subcommand: CLIExecuteFeatureCommandSubcommand, options: CLIExecuteFeatureCommandOptions) => void | Promise<void>;

export type CLIExecuteFeatureCommandReturns = Promise<void>;

/**
 * CLI - Execute utility command.
 *
 * @since 1.0.0
 */
export type CLIExecuteUtilityCommandOptions<Options> = {
  [OptionKey in keyof Options]?: true;
};

export type CLIExecuteUtilityCommandTarget = (options: CLIExecuteUtilityCommandOptions) => void | Promise<void>;

export type CLIExecuteUtilityCommandReturns = Promise<void>;

/**
 * CLI - Get header.
 *
 * @since 1.0.0
 */
export type CLIGetHeaderReturns = string;

/**
 * CLI - Get command usage.
 *
 * @since 1.0.0
 */
export type CLIGetCommandUsageCommand = CommandUnknownOpts;

export type CLIGetCommandUsageReturns = string;

/**
 * CLI - Get root command.
 *
 * @since 1.0.0
 */
export type CLIGetRootCommandCommand = CommandUnknownOpts;

export type CLIGetRootCommandReturns = CommandUnknownOpts;

/**
 * CLI - Get subcommand term.
 *
 * @since 1.0.0
 */
export type CLIGetSubcommandTermCommand = CommandUnknownOpts;

export type CLIGetSubcommandTermReturns = string;

/**
 * CLI - Program.
 *
 * @since 1.0.0
 */
export type CLIProgram = Command;

/**
 * CLI - Register commands.
 *
 * @since 1.0.0
 */
export type CLIRegisterCommandsReturns = void;

/**
 * CLI Generate - Run.
 *
 * @since 1.0.0
 */
export type CLIGenerateRunSubcommand = string;

export type CLIGenerateRunOptions = {
  dryRun?: true;
  execute?: true;
};

export type CLIGenerateRunReturns = Promise<void>;

/**
 * CLI Initialize - Run.
 *
 * @since 1.0.0
 */
export type CLIInitializeRunOptions = {
  dryRun?: true;
  execute?: true;
};

export type CLIInitializeRunReturns = Promise<void>;

/**
 * CLI Inspect - Run.
 *
 * @since 1.0.0
 */
export type CLIInspectRunOptions = {
  eslint?: true;
  nova?: true;
  tsconfig?: true;
};

export type CLIInspectRunReturns = Promise<void>;

/**
 * CLI Recipe - Run.
 *
 * @since 1.0.0
 */
export type CLIRecipeRunSubcommand = string;

export type CLIRecipeRunOptions = {
  dryRun?: true;
  execute?: true;
};

export type CLIRecipeRunReturns = Promise<void>;

/**
 * CLI Scaffold - Run.
 *
 * @since 1.0.0
 */
export type CLIScaffoldRunSubcommand = string;

export type CLIScaffoldRunOptions = {
  dryRun?: true;
  execute?: true;
};

export type CLIScaffoldRunReturns = Promise<void>;

/**
 * CLI Version - Get browser version.
 *
 * @since 1.0.0
 */
export type CLIVersionGetBrowserVersionReturns = Promise<CLIVersionGetBrowserVersionBrowsers>;

export type CLIVersionGetBrowserVersionBrowsers = Record<string, string>;

/**
 * CLI Version - Get environment manager version.
 *
 * @since 1.0.0
 */
export type CLIVersionGetEnvironmentManagerVersionReturns = Promise<CLIVersionGetEnvironmentManagerVersionManagers>;

export type CLIVersionGetEnvironmentManagerVersionManagers = Record<string, string>;

/**
 * CLI Version - Get interpreter version.
 *
 * @since 1.0.0
 */
export type CLIVersionGetInterpreterVersionReturns = Promise<CLIVersionGetInterpreterVersionInterpreters>;

export type CLIVersionGetInterpreterVersionInterpreters = Record<string, string>;

/**
 * CLI Version - Get node version.
 *
 * @since 1.0.0
 */
export type CLIVersionGetNodeVersionReturns = Promise<CLIVersionGetNodeVersionTools>;

export type CLIVersionGetNodeVersionTools = Record<string, string>;

/**
 * CLI Version - Get os version.
 *
 * @since 1.0.0
 */
export type CLIVersionGetOsVersionReturnsName = CLIVersionGetOsVersionName;

export type CLIVersionGetOsVersionReturnsVersion = CLIVersionGetOsVersionVersion;

export type CLIVersionGetOsVersionReturnsArchitecture = CLIVersionGetOsVersionArchitecture;

export type CLIVersionGetOsVersionReturnsBuild = CLIVersionGetOsVersionBuild;

export type CLIVersionGetOsVersionReturnsKernel = CLIVersionGetOsVersionKernel;

export type CLIVersionGetOsVersionReturns = Promise<{
  name: CLIVersionGetOsVersionReturnsName;
  version: CLIVersionGetOsVersionReturnsVersion;
  architecture: CLIVersionGetOsVersionReturnsArchitecture;
  build: CLIVersionGetOsVersionReturnsBuild;
  kernel: CLIVersionGetOsVersionReturnsKernel;
}>;

export type CLIVersionGetOsVersionName = NodeJS.Platform | string;

export type CLIVersionGetOsVersionVersion = string;

export type CLIVersionGetOsVersionArchitecture = NodeJS.Architecture;

export type CLIVersionGetOsVersionBuild = string;

export type CLIVersionGetOsVersionKernel = string;

/**
 * CLI - Handle cli error.
 *
 * @since 1.0.0
 */
export type CLIHandleCLIErrorText = string;

export type CLIHandleCLIErrorReturns = void;

/**
 * CLI Version - Print.
 *
 * @since 1.0.0
 */
export type CLIVersionPrintList = Record<string, Record<string, string>>;

export type CLIVersionPrintReturns = void;

/**
 * CLI Version - Run.
 *
 * @since 1.0.0
 */
export type CLIVersionRunOptions = {
  all?: true;
  browser?: true;
  env?: true;
  interpreter?: true;
  node?: true;
  os?: true;
};

export type CLIVersionRunReturns = Promise<void>;

export type CLIVersionRunTasks = Promise<[keyof CLIVersionRunList, Record<string, string>]>[];

export type CLIVersionRunList = Record<string, Record<string, string>>;

/**
 * CLI - Style text.
 *
 * @since 1.0.0
 */
export type CLIStyleTextType = 'descriptionText' | 'separatorCommands' | 'separatorUsage' | 'title' | 'usageCommands' | 'usageUsage';

export type CLIStyleTextText = string;

export type CLIStyleTextReturns = string;

export type CLIStyleTextCategoryStyles = Record<CLIStyleTextType, ChalkInstance[]>;

export type CLIStyleTextTitleStyles = Record<string, ChalkInstance[]>;
