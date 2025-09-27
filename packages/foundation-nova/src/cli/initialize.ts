import type { CLIInitializeRunOptions, CLIInitializeRunReturns } from '@/types/cli.d.ts';

/**
 * CLI Initialize.
 *
 * @since 1.0.0
 */
export class CLIInitialize {
  /**
   * CLI Initialize - Run.
   *
   * @param {CLIInitializeRunOptions} options - Options.
   *
   * @returns {CLIInitializeRunReturns}
   *
   * @since 1.0.0
   */
  public static async run(options: CLIInitializeRunOptions): CLIInitializeRunReturns {
    console.info('hello from cli initialize', options); // todo
  }
}
