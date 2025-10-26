import type {
  CLIRecipeFreezeDepsRunOptions,
  CLIRecipeFreezeDepsRunReturns,
} from '@/types/cli/cli-recipe.d.ts';

/**
 * CLI Recipe - Freeze Deps.
 *
 * @since 1.0.0
 */
export class CLIRecipeFreezeDeps {
  /**
   * CLI Recipe - Freeze Deps - Run.
   *
   * @param {CLIRecipeFreezeDepsRunOptions} options - Options.
   *
   * @returns {CLIRecipeFreezeDepsRunReturns}
   *
   * @since 1.0.0
   */
  public static async run(options: CLIRecipeFreezeDepsRunOptions): CLIRecipeFreezeDepsRunReturns {
    process.stdout.write(`cli recipe freeze deps - ${JSON.stringify(options, null, 2)}\n`);
  }
}
