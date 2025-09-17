#!/usr/bin/env node
import chalk from 'chalk';
import { Command } from 'commander';

import packageJson from '../../package.json' with { type: 'json' };
import { CLIGenerate } from '@/cli/generate.js';
import { CLIRecipe } from '@/cli/recipe.js';
import { CLIScaffold } from '@/cli/scaffold.js';
import { CLIVersion } from '@/cli/version.js';
import { PATTERN_ANSI, PATTERN_ERROR_PREFIX, WHITESPACE_PATTERN } from '@/lib/regex.js';
import CLIHeader from '@/toolkit/cli-header.js';
import { Logger } from '@/toolkit/index.js';
import type {
  CLIExecuteFeatureCommandCommand,
  CLIExecuteFeatureCommandOptions,
  CLIExecuteFeatureCommandReturns,
  CLIExecuteFeatureCommandSubcommand,
  CLIExecuteFeatureCommandTarget,
  CLIExecuteUtilityCommandCommand,
  CLIExecuteUtilityCommandOptions,
  CLIExecuteUtilityCommandReturns,
  CLIExecuteUtilityCommandTarget,
  CLIGetCommandUsageCommand,
  CLIGetCommandUsageReturns,
  CLIGetHeaderReturns,
  CLIGetRootCommandCommand,
  CLIGetRootCommandReturns,
  CLIGetSubcommandTermCommand,
  CLIGetSubcommandTermReturns,
  CLIHandleCLIErrorReturns,
  CLIHandleCLIErrorText,
  CLIProgram,
  CLIRegisterCommandsReturns,
  CLIStyleTextCategoryStyles,
  CLIStyleTextReturns,
  CLIStyleTextText,
  CLIStyleTextTitleStyles,
  CLIStyleTextType,
} from '@/types/cli.d.ts';

/**
 * CLI.
 *
 * @since 1.0.0
 */
class CLI {
  /**
   * CLI - Program.
   *
   * @private
   *
   * @since 1.0.0
   */
  #program: CLIProgram = new Command() as CLIProgram;

  /**
   * CLI - Constructor.
   *
   * @since 1.0.0
   */
  public constructor() {
    (async () => {
      this.#program
        .name('foundation-nova')
        .alias('nova')
        .usage('<command>')
        .description('CLI for the Common Developer')
        .configureOutput({
          writeErr: (string) => process.stdout.write(string),
          outputError: (string) => this.handleCliError(string),
        })
        .configureHelp({
          commandDescription: () => '',
          commandUsage: (command) => this.getCommandUsage(command),
          styleDescriptionText: (string) => this.styleText('descriptionText', string),
          styleTitle: (string) => this.styleText('title', string),
          subcommandTerm: (command) => this.getSubcommandTerm(command),
        })
        .addHelpText('beforeAll', this.getHeader())
        .helpCommand(false)
        .helpOption(false)
        .allowExcessArguments(false)
        .showHelpAfterError();

      // Register commands into Commander.
      this.registerCommands();

      // Parse command-line arguments and dispatch to handlers.
      await this.#program.parseAsync(process.argv);
    })();
  }

  /**
   * CLI - Register commands.
   *
   * @private
   *
   * @returns {CLIRegisterCommandsReturns}
   *
   * @since 1.0.0
   */
  private registerCommands(): CLIRegisterCommandsReturns {
    // [generate] - Generate vendor-specific files for projects.
    this.#program
      .command('generate')
      .alias('gen')
      .usage('<subcommand> <options>')
      .description('Generate vendor-specific files for projects')
      .argument('<subcommand>', 'View https://cbnventures.github.io/foundation-nova/docs/cli/#generators')
      .option('-e, --execute', 'Generate and write vendor files to disk')
      .option('-d, --dry-run', 'Preview changes without writing files')
      .action(async (subcommand, options, command) => {
        await this.executeFeatureCommand<typeof subcommand, typeof options>(subcommand, options, command, CLIGenerate.run);
      });

    // [recipe] - Automate routine maintenance.
    this.#program
      .command('recipe')
      .alias('rcp')
      .usage('<subcommand> <options>')
      .description('Automate routine maintenance')
      .argument('<subcommand>', 'View https://cbnventures.github.io/foundation-nova/docs/cli/#recipes')
      .option('-e, --execute', 'Generate and write vendor files to disk')
      .option('-d, --dry-run', 'Preview changes without writing files')
      .action(async (subcommand, options, command) => {
        await this.executeFeatureCommand<typeof subcommand, typeof options>(subcommand, options, command, CLIRecipe.run);
      });

    // [scaffold] - Bootstrap full project starters.
    this.#program
      .command('scaffold')
      .alias('scaf')
      .usage('<subcommand> <options>')
      .description('Bootstrap full project starters')
      .argument('<subcommand>', 'View https://cbnventures.github.io/foundation-nova/docs/cli/#scaffolding')
      .option('-e, --execute', 'Generate and write vendor files to disk')
      .option('-d, --dry-run', 'Preview changes without writing files')
      .action(async (subcommand, options, command) => {
        await this.executeFeatureCommand<typeof subcommand, typeof options>(subcommand, options, command, CLIScaffold.run);
      });

    // [version] - Show installed version information.
    this.#program
      .command('version')
      .alias('ver')
      .usage('<options>')
      .description('Show installed version information')
      .option('-a, --all', 'Show all available versions')
      .option('-b, --browser', 'Show web browser versions')
      .option('-e, --env', 'Show environment manager versions')
      .option('-i, --interpreter', 'Show interpreter / runtime versions')
      .option('-n, --node', 'Show Node.js and related package manager versions')
      .option('-o, --os', 'Show operating system details')
      .action(async (options, command) => {
        await this.executeUtilityCommand<typeof options>(options, command, CLIVersion.run);
      });
  }

  /**
   * CLI - Get header.
   *
   * @private
   *
   * @returns {CLIGetHeaderReturns}
   *
   * @since 1.0.0
   */
  private getHeader(): CLIGetHeaderReturns {
    return CLIHeader.render(
      [
        chalk.yellowBright.bold(`Foundation Nova v${packageJson.version}`),
        chalk.redBright.italic('CLI for the Common Developer'),
      ],
      {
        align: 'center',
        marginBottom: 1,
        marginTop: 0,
        paddingX: 1,
        paddingY: 0,
        style: 'round',
        width: 50,
      },
    );
  }

  /**
   * CLI - Get root command.
   *
   * @param {CLIGetRootCommandCommand} command - Command.
   *
   * @private
   *
   * @returns {CLIGetRootCommandReturns}
   *
   * @since 1.0.0
   */
  private getRootCommand(command: CLIGetRootCommandCommand): CLIGetRootCommandReturns {
    let root = command;

    // Walk back until we hit the root of the command.
    while (root.parent) {
      root = root.parent;
    }

    return root;
  }

  /**
   * CLI - Get command usage.
   *
   * @param {CLIGetCommandUsageCommand} command - Command.
   *
   * @private
   *
   * @returns {CLIGetCommandUsageReturns}
   *
   * @since 1.0.0
   */
  private getCommandUsage(command: CLIGetCommandUsageCommand): CLIGetCommandUsageReturns {
    const rootCommandName = this.getRootCommand(command).name();
    const rootCommandAliases = this.getRootCommand(command).aliases();
    const commandName = command.name();
    const commandAliases = command.aliases();
    const commandUsage = command.usage();

    let fullCommand = '';
    let aliasCommand = '';

    // Set the base command name first.
    if (rootCommandName === commandName) {
      fullCommand += [
        commandName,
        this.styleText('usageUsage', commandUsage),
      ].join(' ');

      aliasCommand += [
        commandAliases.join(this.styleText('separatorUsage', '|')),
        this.styleText('usageUsage', commandUsage),
      ].join(' ');
    } else {
      fullCommand += [
        rootCommandName,
        commandName,
        this.styleText('usageUsage', commandUsage),
      ].join(' ');

      aliasCommand += [
        rootCommandAliases.join(this.styleText('separatorUsage', '|')),
        commandAliases.join(this.styleText('separatorUsage', '|')),
        this.styleText('usageUsage', commandUsage),
      ].join(' ');
    }

    return [
      fullCommand,
      aliasCommand,
    ].join('\n       ');
  }

  /**
   * CLI - Get subcommand term.
   *
   * @param {CLIGetSubcommandTermCommand} command - Command.
   *
   * @private
   *
   * @returns {CLIGetSubcommandTermReturns}
   *
   * @since 1.0.0
   */
  private getSubcommandTerm(command: CLIGetSubcommandTermCommand): CLIGetSubcommandTermReturns {
    const names = [command.name(), ...command.aliases()].join(this.styleText('separatorCommands', '|'));
    const usage = command.usage();

    return (usage !== '') ? `${names} ${this.styleText('usageCommands', usage)}` : names;
  }

  /**
   * CLI - Style text.
   *
   * @param {CLIStyleTextType} type - Type.
   * @param {CLIStyleTextText} text - Text.
   *
   * @private
   *
   * @returns {CLIStyleTextReturns}
   *
   * @since 1.0.0
   */
  private styleText(type: CLIStyleTextType, text: CLIStyleTextText): CLIStyleTextReturns {
    const categoryStyles: CLIStyleTextCategoryStyles = {
      descriptionText: [chalk.dim],
      separatorCommands: [chalk.blue],
      separatorUsage: [chalk.green],
      title: [chalk.bold],
      usageCommands: [chalk.blue],
      usageUsage: [chalk.green],
    };
    const titleStyles: CLIStyleTextTitleStyles = {
      'Usage:': [chalk.green],
      'Commands:': [chalk.blue],
      'Arguments:': [chalk.magenta],
      'Options:': [chalk.cyan],
    };
    const categoryFunctions = categoryStyles[type] ?? [];
    const titleFunctions = titleStyles[text] ?? [];

    let coloredText = text;

    // Apply category type coloring.
    categoryFunctions.forEach((categoryFunction) => {
      coloredText = categoryFunction(coloredText);
    });

    // Apply per-title overrides.
    if (type === 'title') {
      titleFunctions.forEach((titleFunction) => {
        coloredText = titleFunction(coloredText);
      });
    }

    return coloredText;
  }

  /**
   * CLI - Handle cli error.
   *
   * @param {CLIHandleCLIErrorText} text - Text.
   *
   * @private
   *
   * @returns {CLIHandleCLIErrorReturns}
   *
   * @since 1.0.0
   */
  private handleCliError(text: CLIHandleCLIErrorText): CLIHandleCLIErrorReturns {
    let processedText = text.replace(new RegExp(PATTERN_ERROR_PREFIX, 'i'), '');

    // Strip ANSI coloring.
    processedText = processedText.replace(PATTERN_ANSI, '');

    // Trim and normalize whitespace.
    processedText = processedText.replace(new RegExp(WHITESPACE_PATTERN, 'g'), ' ').trim();

    // Capitalize first letter.
    processedText = `${processedText.charAt(0).toUpperCase()}${processedText.slice(1)}`;

    Logger.error(processedText);
  }

  /**
   * CLI - Execute feature command.
   *
   * @param {CLIExecuteFeatureCommandSubcommand} subcommand - Subcommand.
   * @param {CLIExecuteFeatureCommandOptions}    options    - Options.
   * @param {CLIExecuteFeatureCommandCommand}    command    - Command.
   * @param {CLIExecuteFeatureCommandTarget}     target     - Target.
   *
   * @private
   *
   * @returns {CLIExecuteFeatureCommandReturns}
   *
   * @since 1.0.0
   */
  private async executeFeatureCommand<Subcommand, Options>(subcommand: CLIExecuteFeatureCommandSubcommand<Subcommand>, options: CLIExecuteFeatureCommandOptions<Options>, command: CLIExecuteFeatureCommandCommand<Subcommand, Options>, target: CLIExecuteFeatureCommandTarget): CLIExecuteFeatureCommandReturns {
    // Show help and exit gracefully if no subcommand or options are provided.
    if (
      String(subcommand).length === 0
      || Object.keys(options).length === 0
    ) {
      command.error('error: missing required argument \'subcommand\' and option');
    }

    // Write the header.
    process.stdout.write(`${this.getHeader()}\r\n`);

    // Attempts to run the passed in function or method.
    await target(subcommand, options);
  }

  /**
   * CLI - Execute utility command.
   *
   * @param {CLIExecuteUtilityCommandOptions} options - Options.
   * @param {CLIExecuteUtilityCommandCommand} command - Command.
   * @param {CLIExecuteUtilityCommandTarget}  target  - Target.
   *
   * @private
   *
   * @returns {CLIExecuteUtilityCommandReturns}
   *
   * @since 1.0.0
   */
  private async executeUtilityCommand<Options>(options: CLIExecuteUtilityCommandOptions<Options>, command: CLIExecuteUtilityCommandCommand<Options>, target: CLIExecuteUtilityCommandTarget): CLIExecuteUtilityCommandReturns {
    // Show help and exit gracefully if no options are provided.
    if (Object.keys(options).length === 0) {
      command.error('error: missing required option');
    }

    // Write the header.
    process.stdout.write(`${this.getHeader()}\r\n`);

    // Attempts to run the passed in function or method.
    await target(options);
  }
}

// Initiate script.
new CLI();
