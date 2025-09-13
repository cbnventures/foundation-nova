#!/usr/bin/env node
import chalk from 'chalk';
import { Command } from 'commander';

import packageJson from '../../package.json' with { type: 'json' };
import { CLIVersion } from '@/cli/version.js';
import CLIHeader from '@/toolkit/cli-header.js';
import type {
  CLIExecuteSubcommandCommand,
  CLIExecuteSubcommandOptions,
  CLIExecuteSubcommandReturns,
  CLIExecuteSubcommandTarget,
  CLIProgram,
  CLIRegisterCommandsReturns,
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
        .addHelpText('beforeAll', CLIHeader.render(
          [
            chalk.bold.hex('#f0b030')(`Foundation Nova v${packageJson.version}`),
            chalk.italic.hex('#e05050')('CLI for the Common Developer'),
          ],
          {
            align: 'center',
            marginBottom: 0,
            marginTop: 0,
            paddingX: 1,
            paddingY: 0,
            style: 'round',
            width: 50,
          },
        ))
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
    // [env] - Show installed version information.
    this.#program
      .command('version')
      .alias('ver')
      .description('Show installed version information')
      .option('-a, --all', 'Show all available versions')
      .option('-b, --browser', 'Show web browser versions')
      .option('-e, --env', 'Show environment manager versions')
      .option('-i, --interpreter', 'Show interpreter / runtime versions')
      .option('-n, --node', 'Show Node.js and related package manager versions')
      .option('-o, --os', 'Show operating system details')
      .action(async (options, command) => {
        await this.executeSubcommand<typeof options>(options, command, CLIVersion.run);
      });
  }

  /**
   * CLI - Execute subcommand.
   *
   * @param {CLIExecuteSubcommandOptions} options - Options.
   * @param {CLIExecuteSubcommandCommand} command - Command.
   * @param {CLIExecuteSubcommandTarget}  target  - Target.
   *
   * @private
   *
   * @returns {CLIExecuteSubcommandReturns}
   *
   * @since 1.0.0
   */
  private async executeSubcommand<Options>(options: CLIExecuteSubcommandOptions<Options>, command: CLIExecuteSubcommandCommand<Options>, target: CLIExecuteSubcommandTarget): CLIExecuteSubcommandReturns {
    // Show help and exit gracefully if no options are provided.
    if (command.args.length === 0 && Object.keys(options).length === 0) {
      command.outputHelp();

      process.exitCode = 1;

      return;
    }

    // Attempts to run the passed in function or method.
    await target(options);
  }
}

// Initiate script.
new CLI();
