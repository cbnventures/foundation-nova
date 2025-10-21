#!/usr/bin/env node
import chalk from 'chalk';
import { Command } from 'commander';

import packageJson from '../../package.json' with { type: 'json' };
import { CLIInitialize } from '@/cli/utility/initialize.js';
import { CLIInspect } from '@/cli/utility/inspect.js';
import { CLIVersion } from '@/cli/utility/version.js';
import { PATTERN_ANSI, PATTERN_ERROR_PREFIX, WHITESPACE_PATTERN } from '@/lib/regex.js';
import CLIHeader from '@/toolkit/cli-header.js';
import { Logger } from '@/toolkit/index.js';
import type {
  CLIExecuteCommandOptions,
  CLIExecuteCommandReturns,
  CLIExecuteCommandTarget,
  CLIGetCommandUsageCommand,
  CLIGetCommandUsageReturns,
  CLIGetHeaderReturns,
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
        .usage('<command> <subcommand> [options]')
        .description('CLI for the Common Developer')
        .commandsGroup('Commands:')
        .configureOutput({
          writeErr: (string) => process.stdout.write(string),
          outputError: (string) => this.handleCliError(string),
        })
        .configureHelp({
          commandDescription: () => '',
          commandUsage: (command) => this.getCommandUsage(command),
          styleDescriptionText: (string) => this.styleText('description', string),
          styleTitle: (string) => this.styleText('title', string),
          subcommandTerm: (command) => this.getSubcommandTerm(command),
        })
        .addHelpText('beforeAll', this.getHeader())
        .helpCommand(false)
        .helpOption('-h, --help', 'Display the help menu')
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
    /**
     * Generate.
     *
     * @since 1.0.0
     */
    const generate = this.#program
      .command('generate')
      .alias('gen')
      .usage('<subcommand> [options]')
      .description('Generate vendor or must-have files for projects')
      .commandsGroup('Subcommands:')
      .helpCommand(false);

    generate
      .command('aws-amplify')
      .description('Create a amplify.yml file for AWS Amplify deployments');

    generate
      .command('cloudflare-workers')
      .description('Create a wrangler.toml file for Cloudflare Workers deployments');

    generate
      .command('docker-compose')
      .description('Create a docker-compose.yml file for Docker builds');

    generate
      .command('docker-file')
      .description('Create a Dockerfile for Docker builds');

    generate
      .command('docusaurus-config')
      .description('Create a docusaurus.config.ts file for Docusaurus configuration');

    generate
      .command('github-funding')
      .description('Create a ./github/FUNDING.yml file for GitHub to enable sponsor links');

    generate
      .command('github-issue-template')
      .description('Create a ./github/ISSUE_TEMPLATE directory for GitHub to create issue templates');

    generate
      .command('github-workflows')
      .description('Create a ./github/workflows directory for GitHub to enable CI/CD automation');

    generate
      .command('must-haves-dotenv')
      .description('Create a .env file for managing local environment secrets across your project');

    generate
      .command('must-haves-editorconfig')
      .description('Create a .editorconfig file for managing consistent coding styles');

    generate
      .command('must-haves-gitignore')
      .description('Create a .gitignore file for managing files that should be excluded from Git commits');

    generate
      .command('must-haves-license')
      .description('Create a LICENSE file for managing project license agreements');

    generate
      .command('must-haves-post-install')
      .description('Create a post-install.ts file for expanding on post-install controls');

    generate
      .command('must-haves-read-me')
      .description('Create a baseline README.md file for for your project');

    generate
      .command('nextjs-config')
      .description('Create a next.config.mjs file for Next.js configuration');

    generate
      .command('vite-config')
      .description('Create a vite.config.mjs file for Vite configuration');

    /**
     * Recipe.
     *
     * @since 1.0.0
     */
    const recipe = this.#program
      .command('recipe')
      .alias('rcp')
      .usage('<subcommand> [options]')
      .description('Automate routine maintenance with configured defaults')
      .commandsGroup('Subcommands:')
      .helpCommand(false);

    recipe
      .command('freeze-deps')
      .description('Freezes package.json dependencies to prevent unwanted version changes');

    recipe
      .command('sync-pkg-manager')
      .description('Syncs the preferred package manager to be used across the entire repository');

    /**
     * Scaffold.
     *
     * @since 1.0.0
     */
    const scaffold = this.#program
      .command('scaffold')
      .alias('scaf')
      .usage('<subcommand> [options]')
      .description('Bootstrap templated monorepo-style projects')
      .commandsGroup('Subcommands:')
      .helpCommand(false);

    scaffold
      .command('nextjs')
      .description('Next.js');

    /**
     * Utility.
     *
     * @since 1.0.0
     */
    const utility = this.#program
      .command('utility')
      .alias('util')
      .usage('<subcommand> [options]')
      .description('Tools for diagnostics, quick checks, and dev helpers')
      .commandsGroup('Subcommands:')
      .helpCommand(false);

    utility
      .command('initialize')
      .alias('init')
      .usage('[options]')
      .description('Generate a new Nova config for this project')
      .option('-d, --dry-run', 'Preview changes without writing files')
      .action(async (options) => {
        await this.executeCommand<typeof options>(options, CLIInitialize.run);
      });

    utility
      .command('inspect')
      .alias('ins')
      .usage('[options]')
      .description('Prints the Nova, ESLint, or TypeScript configuration')
      .option('-e, --eslint', 'ESLint configuration')
      .option('-n, --nova', 'Foundation Nova configuration')
      .option('-t, --tsconfig', 'TypeScript configuration')
      .action(async (options) => {
        await this.executeCommand<typeof options>(options, CLIInspect.run);
      });

    utility
      .command('version')
      .alias('ver')
      .usage('[options]')
      .description('Snapshot of your development stack versions')
      .option('-a, --all', 'Show all available versions')
      .option('-b, --browser', 'Show web browser versions')
      .option('-e, --env', 'Show environment manager versions')
      .option('-i, --interpreter', 'Show interpreter / runtime versions')
      .option('-n, --node', 'Show Node.js and related package manager versions')
      .option('-o, --os', 'Show operating system details')
      .action(async (options) => {
        await this.executeCommand<typeof options>(options, CLIVersion.run);
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
    const commandName = command.name();
    const commandAliases = command.aliases();
    const commandUsage = command.usage();

    // Store the command path here.
    const fullCommand = [
      this.styleText('usage', commandUsage),
      commandName,
    ];
    const aliasCommand = [
      this.styleText('usage', commandUsage),
      ...(commandAliases.length > 0) ? [
        commandAliases.join(this.styleText('usage', '|')),
      ] : [
        commandName,
      ],
    ];

    let parentCommand = command.parent;

    // Walk backwards.
    while (parentCommand !== null) {
      const parentCommandName = parentCommand.name();
      const parentCommandAliases = parentCommand.aliases();

      fullCommand.push(parentCommandName);

      if (parentCommandAliases.length > 0) {
        aliasCommand.push(parentCommandAliases.join(this.styleText('usage', '|')));
      } else {
        aliasCommand.push(parentCommandName);
      }

      parentCommand = parentCommand.parent;
    }

    return [
      fullCommand.reverse().join(' '),
      aliasCommand.reverse().join(' '),
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
    const category = (command.parent !== null && command.parent.parent === null) ? 'commands' : 'subcommands';
    const names = [command.name(), ...command.aliases()].join(this.styleText(category, '|'));
    const usage = command.usage();

    return (usage !== '') ? `${names} ${this.styleText(category, usage)}` : names;
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
      commands: [chalk.blue],
      description: [chalk.dim],
      subcommands: [chalk.magenta],
      title: [chalk.bold],
      usage: [chalk.green],
    };
    const titleStyles: CLIStyleTextTitleStyles = {
      'Commands:': [chalk.blue],
      'Options:': [chalk.cyan],
      'Subcommands:': [chalk.magenta],
      'Usage:': [chalk.green],
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
   * CLI - Execute command.
   *
   * @param {CLIExecuteCommandOptions} options - Options.
   * @param {CLIExecuteCommandTarget}  target  - Target.
   *
   * @private
   *
   * @returns {CLIExecuteCommandReturns}
   *
   * @since 1.0.0
   */
  private async executeCommand<Options>(options: CLIExecuteCommandOptions<Options>, target: CLIExecuteCommandTarget): CLIExecuteCommandReturns {
    // Write the header.
    process.stdout.write(`${this.getHeader()}\r\n`);

    // Write the running method.
    process.stdout.write(`${chalk.bold.bgBlue('CURRENTLY RUNNING:')} ${process.argv.slice(2).join(' ')}\r\n\r\n`);

    // Attempts to run the passed in function or method.
    await target(options);
  }
}

// Initiate script.
new CLI();
