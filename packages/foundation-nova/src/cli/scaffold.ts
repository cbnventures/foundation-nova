import type {
  CLIScaffoldRunOptions,
  CLIScaffoldRunReturns,
  CLIScaffoldRunSubcommand,
} from '@/types/cli.d.ts';

/**
 * CLI Scaffold.
 *
 * @since 1.0.0
 */
export class CLIScaffold {
  /**
   * CLI Scaffold - Run.
   *
   * @param {CLIScaffoldRunSubcommand} subcommand - Subcommand.
   * @param {CLIScaffoldRunOptions}    options - Options.
   *
   * @returns {CLIScaffoldRunReturns}
   *
   * @since 1.0.0
   */
  public static async run(subcommand: CLIScaffoldRunSubcommand, options: CLIScaffoldRunOptions): CLIScaffoldRunReturns {
    console.info('hello from cli scaffold', subcommand, options); // todo
  }
}
