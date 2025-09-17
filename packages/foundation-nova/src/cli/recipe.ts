import type {
  CLIRecipeRunOptions,
  CLIRecipeRunReturns,
  CLIRecipeRunSubcommand,
} from '@/types/cli.d.ts';

/**
 * CLI Recipe.
 *
 * @since 1.0.0
 */
export class CLIRecipe {
  /**
   * CLI Recipe - Run.
   *
   * @param {CLIRecipeRunSubcommand} subcommand - Subcommand.
   * @param {CLIRecipeRunOptions}    options - Options.
   *
   * @returns {CLIRecipeRunReturns}
   *
   * @since 1.0.0
   */
  public static async run(subcommand: CLIRecipeRunSubcommand, options: CLIRecipeRunOptions): CLIRecipeRunReturns {
    console.info('hello from cli recipe', subcommand, options); // todo
  }
}
