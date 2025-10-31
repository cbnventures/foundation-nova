import type {
  CLIRecipeSyncMetadataRunOptions,
  CLIRecipeSyncMetadataRunReturns,
} from '@/types/cli/recipe.d.ts';

/**
 * CLI Recipe - Sync Metadata.
 *
 * @since 1.0.0
 */
export class CLIRecipeSyncMetadata {
  /**
   * CLI Recipe - Sync Metadata - Run.
   *
   * @param {CLIRecipeSyncMetadataRunOptions} options - Options.
   *
   * @returns {CLIRecipeSyncMetadataRunReturns}
   *
   * @since 1.0.0
   */
  public static async run(options: CLIRecipeSyncMetadataRunOptions): CLIRecipeSyncMetadataRunReturns {
    process.stdout.write(`cli recipe sync metadata - ${JSON.stringify(options, null, 2)}\n`);
  }
}
