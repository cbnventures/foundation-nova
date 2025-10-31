import type {
  CLIRecipeSyncVersionsRunOptions,
  CLIRecipeSyncVersionsRunReturns,
} from '@/types/cli/recipe.d.ts';

/**
 * CLI Recipe - Sync Versions.
 *
 * @since 1.0.0
 */
export class CLIRecipeSyncVersions {
  /**
   * CLI Recipe - Sync Versions - Run.
   *
   * @param {CLIRecipeSyncVersionsRunOptions} options - Options.
   *
   * @returns {CLIRecipeSyncVersionsRunReturns}
   *
   * @since 1.0.0
   */
  public static async run(options: CLIRecipeSyncVersionsRunOptions): CLIRecipeSyncVersionsRunReturns {
    process.stdout.write(`cli recipe sync versions - ${JSON.stringify(options, null, 2)}\n`);
  }
}
