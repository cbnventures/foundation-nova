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
 * CLI Version - Get node ver.
 *
 * @since 1.0.0
 */
export type CLIVersionGetNodeVerReturnsNodeJs = string | null;

export type CLIVersionGetNodeVerReturnsNpm = string | null;

export type CLIVersionGetNodeVerReturns = {
  nodeJs: CLIVersionGetNodeVerReturnsNodeJs;
  npm: CLIVersionGetNodeVerReturnsNpm;
};

/**
 * CLI Version - Get os ver.
 *
 * @since 1.0.0
 */
export type CLIVersionGetOsVerDisplayName = string[];

export type CLIVersionGetOsVerSystemDetail = string[];

export type CLIVersionGetOsVerName = NodeJS.Platform | string;

export type CLIVersionGetOsVerVersion = string | null;

export type CLIVersionGetOsVerBuild = string | null;

export type CLIVersionGetOsVerArchitecture = NodeJS.Architecture;

export type CLIVersionGetOsVerKernel = string;

export type CLIVersionGetOsVerReturnsOs = string;

export type CLIVersionGetOsVerReturns = {
  os: CLIVersionGetOsVerReturnsOs;
};

/**
 * CLI Version - Run.
 *
 * @since 1.0.0
 */
export type CLIVersionRunOptions = {
  all?: true;
  node?: true;
  os?: true;
};

export type CLIVersionRunReturns = void;
