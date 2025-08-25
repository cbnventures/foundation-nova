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
 * CLI Version - Get browser ver.
 *
 * @since 1.0.0
 */
export type CLIVersionGetBrowserVerReturns = CLIVersionGetBrowserVerBrowsers;

export type CLIVersionGetBrowserVerBrowsers = Record<string, string | null>;

/**
 * CLI Version - Get node ver.
 *
 * @since 1.0.0
 */
export type CLIVersionGetNodeVerReturns = CLIVersionGetNodeVerTools;

export type CLIVersionGetNodeVerTools = Record<string, string>;

/**
 * CLI Version - Get os ver.
 *
 * @since 1.0.0
 */
export type CLIVersionGetOsVerReturnsName = CLIVersionGetOsVerName;

export type CLIVersionGetOsVerReturnsVersion = CLIVersionGetOsVerVersion;

export type CLIVersionGetOsVerReturnsArchitecture = CLIVersionGetOsVerArchitecture;

export type CLIVersionGetOsVerReturnsBuild = CLIVersionGetOsVerBuild;

export type CLIVersionGetOsVerReturnsKernel = CLIVersionGetOsVerKernel;

export type CLIVersionGetOsVerReturns = {
  name: CLIVersionGetOsVerReturnsName;
  version: CLIVersionGetOsVerReturnsVersion;
  architecture: CLIVersionGetOsVerReturnsArchitecture;
  build: CLIVersionGetOsVerReturnsBuild;
  kernel: CLIVersionGetOsVerReturnsKernel;
};

export type CLIVersionGetOsVerName = NodeJS.Platform | string;

export type CLIVersionGetOsVerVersion = string | null;

export type CLIVersionGetOsVerArchitecture = NodeJS.Architecture;

export type CLIVersionGetOsVerBuild = string | null;

export type CLIVersionGetOsVerKernel = string;

/**
 * CLI Version - Print.
 *
 * @since 1.0.0
 */
export type CLIVersionPrintList = Record<string, Record<string, string | null>>;

export type CLIVersionPrintReturns = void;

/**
 * CLI Version - Run.
 *
 * @since 1.0.0
 */
export type CLIVersionRunOptions = {
  all?: true;
  browser?: true;
  node?: true;
  os?: true;
};

export type CLIVersionRunReturns = void;

export type CLIVersionRunList = Record<string, Record<string, string | null>>;
