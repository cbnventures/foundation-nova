import type { CLIInspectRunOptions, CLIInspectRunReturns } from '@/types/cli.d.ts';

/**
 * CLI Inspect.
 *
 * @since 1.0.0
 */
export class CLIInspect {
  /**
   * CLI Inspect - Run.
   *
   * @param {CLIInspectRunOptions} options - Options.
   *
   * @returns {CLIInspectRunReturns}
   *
   * @since 1.0.0
   */
  public static async run(options: CLIInspectRunOptions): CLIInspectRunReturns {
    console.info('hello from cli inspect', options); // todo
  }
}
