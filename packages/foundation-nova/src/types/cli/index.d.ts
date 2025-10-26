import type { Command, CommandUnknownOpts } from '@commander-js/extra-typings';
import type { ChalkInstance } from 'chalk';

/**
 * CLI - Execute command.
 *
 * @since 1.0.0
 */
export type CLIExecuteCommandOptions<Options> = {
  [OptionKey in keyof Options]?: true;
};

export type CLIExecuteCommandTarget = (options: CLIExecuteCommandOptions) => void | Promise<void>;

export type CLIExecuteCommandReturns = Promise<void>;

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
 * CLI - Get subcommand term.
 *
 * @since 1.0.0
 */
export type CLIGetSubcommandTermCommand = CommandUnknownOpts;

export type CLIGetSubcommandTermReturns = string;

/**
 * CLI - Handle cli error.
 *
 * @since 1.0.0
 */
export type CLIHandleCLIErrorText = string;

export type CLIHandleCLIErrorReturns = void;

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
 * CLI - Style text.
 *
 * @since 1.0.0
 */
export type CLIStyleTextType = 'commands' | 'description' | 'subcommands' | 'title' | 'usage';

export type CLIStyleTextText = string;

export type CLIStyleTextReturns = string;

export type CLIStyleTextCategoryStyles = Record<CLIStyleTextType, ChalkInstance[]>;

export type CLIStyleTextTitleStyles = Record<string, ChalkInstance[]>;
