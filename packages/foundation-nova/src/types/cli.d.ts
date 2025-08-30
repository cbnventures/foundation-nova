import type { Command } from '@commander-js/extra-typings';

/**
 * CLI - Execute subcommand.
 *
 * @since 1.0.0
 */
export type CLIExecuteSubcommandOptions<Options> = {
  [OptionKey in keyof Options]?: true;
};

export type CLIExecuteSubcommandCommand<Options> = Command<[], Options>;

export type CLIExecuteSubcommandTarget = (options: CLIExecuteSubcommandOptions) => void | Promise<void>;

export type CLIExecuteSubcommandReturns = Promise<void>;

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
 * CLI Version - Get browser version.
 *
 * @since 1.0.0
 */
export type CLIVersionGetBrowserVersionReturns = CLIVersionGetBrowserVersionBrowsers;

export type CLIVersionGetBrowserVersionBrowsers = Record<string, string>;

/**
 * CLI Version - Get environment manager version.
 *
 * @since 1.0.0
 */
export type CLIVersionGetEnvironmentManagerVersionReturns = CLIVersionGetEnvironmentManagerVersionManagers;

export type CLIVersionGetEnvironmentManagerVersionManagers = Record<string, string>;

/**
 * CLI Version - Get interpreter version.
 *
 * @since 1.0.0
 */
export type CLIVersionGetInterpreterVersionReturns = CLIVersionGetInterpreterVersionInterpreters;

export type CLIVersionGetInterpreterVersionInterpreters = Record<string, string>;

/**
 * CLI Version - Get node version.
 *
 * @since 1.0.0
 */
export type CLIVersionGetNodeVersionReturns = CLIVersionGetNodeVersionTools;

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

export type CLIVersionGetOsVersionReturns = {
  name: CLIVersionGetOsVersionReturnsName;
  version: CLIVersionGetOsVersionReturnsVersion;
  architecture: CLIVersionGetOsVersionReturnsArchitecture;
  build: CLIVersionGetOsVersionReturnsBuild;
  kernel: CLIVersionGetOsVersionReturnsKernel;
};

export type CLIVersionGetOsVersionName = NodeJS.Platform | string;

export type CLIVersionGetOsVersionVersion = string;

export type CLIVersionGetOsVersionArchitecture = NodeJS.Architecture;

export type CLIVersionGetOsVersionBuild = string;

export type CLIVersionGetOsVersionKernel = string;

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

export type CLIVersionRunReturns = void;

export type CLIVersionRunList = Record<string, Record<string, string>>;
