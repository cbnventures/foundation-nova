import type {
  CLIGenerateRunOptions,
  CLIGenerateRunReturns,
  CLIGenerateRunSubcommand,
} from '@/types/cli.d.ts';

/**
 * CLI Generate.
 *
 * @since 1.0.0
 */
export class CLIGenerate {
  /**
   * CLI Generate - Run.
   *
   * @param {CLIGenerateRunSubcommand} subcommand - Subcommand.
   * @param {CLIGenerateRunOptions}    options - Options.
   *
   * @returns {CLIGenerateRunReturns}
   *
   * @since 1.0.0
   */
  public static async run(subcommand: CLIGenerateRunSubcommand, options: CLIGenerateRunOptions): CLIGenerateRunReturns {
    console.info('hello from cli generate', subcommand, options); // todo
  }
}
