import * as fs from 'node:fs';
import * as fsp from 'node:fs/promises';
import * as path from 'node:path';

import type {
  BuildCopierCopyDirectoryDestinationPath,
  BuildCopierCopyDirectoryReturns,
  BuildCopierCopyDirectorySourcePath,
  BuildCopierGetWorkspacesReturns,
  BuildCopierListSubdirectoriesReturns,
  BuildCopierListSubdirectoriesRootDirectory,
} from './types/copy-build-files.d.ts';

/**
 * Build Copier.
 *
 * @since 1.0.0
 */
class BuildCopier {
  /**
   * Build Copier - Constructor.
   *
   * @since 1.0.0
   */
  constructor() {
    (async () => {
      const copyTasks: Array<Promise<void>> = [];
      const workspaces = await this.getWorkspaces();

      for (const workspace of workspaces) {
        const applications = this.listSubdirectories(workspace);

        for (const application of applications) {
          const sourceDirectory = path.join(workspace, application, 'build');

          if (!fs.existsSync(sourceDirectory) || !fs.statSync(sourceDirectory).isDirectory()) {
            continue;
          }

          const workspaceName = path.basename(workspace);
          const destinationDirectory = path.join('build', `${workspaceName}-${application}`);

          copyTasks.push(
            this
              .copyDirectory(sourceDirectory, destinationDirectory)
              .then(() => {
                console.log(`Copied "${sourceDirectory}" -> "${destinationDirectory}"`);
              }),
          );
        }
      }

      try {
        await Promise.all(copyTasks);
      } catch (error) {
        console.error(error);

        process.exit(1);
      }
    })();
  }

  /**
   * Build Copier - List subdirectories.
   *
   * @param {BuildCopierListSubdirectoriesRootDirectory} rootDirectory - Root directory.
   *
   * @returns {BuildCopierListSubdirectoriesReturns}
   *
   * @since 1.0.0
   */
  private listSubdirectories(rootDirectory: BuildCopierListSubdirectoriesRootDirectory): BuildCopierListSubdirectoriesReturns {
    try {
      return fs
        .readdirSync(rootDirectory, {
          withFileTypes: true,
        })
        .filter((dirent: fs.Dirent) => dirent.isDirectory())
        .map((dirent: fs.Dirent) => dirent.name);
    } catch {
      return [];
    }
  }

  /**
   * Build Copier - Get workspaces.
   *
   * @returns {BuildCopierGetWorkspacesReturns}
   *
   * @since 1.0.0
   */
  private async getWorkspaces(): BuildCopierGetWorkspacesReturns {
    const packageJsonFilePath = path.resolve(process.cwd(), 'package.json');
    const packageJsonContents = await fsp.readFile(packageJsonFilePath, 'utf8');
    const packageJson = JSON.parse(packageJsonContents);

    let workspaces: string[] = [];

    if (Array.isArray(packageJson.workspaces)) {
      workspaces = packageJson.workspaces;
    } else if (Array.isArray(packageJson.workspaces?.packages)) {
      workspaces = packageJson.workspaces.packages;
    }

    return workspaces.map((pattern: string) => {
      return pattern
        .replace(/^[.][\\/]/, '')
        .replace(/\/\*$/, '');
    });
  }

  /**
   * Build Copier - Copy directory.
   *
   * @param {BuildCopierCopyDirectorySourcePath}      sourcePath      - Source path.
   * @param {BuildCopierCopyDirectoryDestinationPath} destinationPath - Destination path.
   *
   * @returns {BuildCopierCopyDirectoryReturns}
   *
   * @since 1.0.0
   */
  private async copyDirectory(sourcePath: BuildCopierCopyDirectorySourcePath, destinationPath: BuildCopierCopyDirectoryDestinationPath): BuildCopierCopyDirectoryReturns {
    await fsp.cp(sourcePath, destinationPath, {
      recursive: true,
    });
  }
}

// Initiate script.
new BuildCopier();
