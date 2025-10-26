import type {
  CLIRecipeSyncPkgMgrRunOptions,
  CLIRecipeSyncPkgMgrRunReturns,
} from '@/types/cli/cli-recipe.d.ts';

/**
 * CLI Recipe - Sync pkg mgr.
 *
 * @since 1.0.0
 */
export class CLIRecipeSyncPkgMgr {
  /**
   * CLI Recipe - Sync pkg mgr - Run.
   *
   * @param {CLIRecipeSyncPkgMgrRunOptions} options - Options.
   *
   * @returns {CLIRecipeSyncPkgMgrRunReturns}
   *
   * @since 1.0.0
   */
  public static async run(options: CLIRecipeSyncPkgMgrRunOptions): CLIRecipeSyncPkgMgrRunReturns {
    process.stdout.write(`cli recipe sync pkg mgr - ${JSON.stringify(options, null, 2)}\n`);
  }
}
