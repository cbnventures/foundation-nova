import * as path from 'path';

import chalk from 'chalk';
import prompts from 'prompts';

import { itemAllowedPoliciesByRole } from '@/lib/item.js';
import { NovaConfig } from '@/lib/nova-config.js';
import { PATTERN_EMAIL_SIMPLE, PATTERN_SLUG_SCOPED, PATTERN_SLUG_SIMPLE } from '@/lib/regex.js';
import { discoverPathsWithFile } from '@/lib/utility.js';
import { Logger } from '@/toolkit/index.js';
import type {
  CLIUtilityInitializeCheckPathCurrentDirectory,
  CLIUtilityInitializeCheckPathReturns,
  CLIUtilityInitializeIsAllowedHttpUrlField,
  CLIUtilityInitializeIsAllowedHttpUrlReturns,
  CLIUtilityInitializeIsAllowedHttpUrlValue,
  CLIUtilityInitializePromptEntitiesChoices,
  CLIUtilityInitializePromptEntitiesConfig,
  CLIUtilityInitializePromptEntitiesDeleteFormConfirmOutputKey,
  CLIUtilityInitializePromptEntitiesDeleteFormConfirmOutputValue,
  CLIUtilityInitializePromptEntitiesDeleteFormLabel,
  CLIUtilityInitializePromptEntitiesDeleteFormReturns,
  CLIUtilityInitializePromptEntitiesDescriptionParts,
  CLIUtilityInitializePromptEntitiesEntities,
  CLIUtilityInitializePromptEntitiesFormEntity,
  CLIUtilityInitializePromptEntitiesFormExistingRoles,
  CLIUtilityInitializePromptEntitiesFormMode,
  CLIUtilityInitializePromptEntitiesFormQuestionsOutputKey,
  CLIUtilityInitializePromptEntitiesFormQuestionsOutputValue,
  CLIUtilityInitializePromptEntitiesFormResolvedEntity,
  CLIUtilityInitializePromptEntitiesFormReturns,
  CLIUtilityInitializePromptEntitiesFormValidRoles,
  CLIUtilityInitializePromptEntitiesMenuOutputKeys,
  CLIUtilityInitializePromptEntitiesMenuOutputResult,
  CLIUtilityInitializePromptEntitiesNormalizedRolesReduce,
  CLIUtilityInitializePromptEntitiesReturns,
  CLIUtilityInitializePromptEntitiesSyncReturns,
  CLIUtilityInitializePromptFlowCategory,
  CLIUtilityInitializePromptFlowChoices,
  CLIUtilityInitializePromptFlowConfig,
  CLIUtilityInitializePromptFlowReturns,
  CLIUtilityInitializePromptFlowSelectMenuOutputKeys,
  CLIUtilityInitializePromptFlowSelectMenuOutputResult,
  CLIUtilityInitializePromptProjectConfig,
  CLIUtilityInitializePromptProjectQuestionsOutputKeys,
  CLIUtilityInitializePromptProjectQuestionsOutputResult,
  CLIUtilityInitializePromptProjectReturns,
  CLIUtilityInitializePromptProjectRolesToSync,
  CLIUtilityInitializePromptUrlsConfig,
  CLIUtilityInitializePromptUrlsFundSourcesList,
  CLIUtilityInitializePromptUrlsQuestionsOutputKey,
  CLIUtilityInitializePromptUrlsQuestionsOutputValue,
  CLIUtilityInitializePromptUrlsReturns,
  CLIUtilityInitializePromptUrlsValidatedUrls,
  CLIUtilityInitializePromptUrlsValidateInput,
  CLIUtilityInitializePromptUrlsValidateKey,
  CLIUtilityInitializePromptUrlsValidateReturns,
  CLIUtilityInitializePromptWithCancelQuestions,
  CLIUtilityInitializePromptWithCancelReturns,
  CLIUtilityInitializePromptWorkspaces,
  CLIUtilityInitializePromptWorkspacesConfig,
  CLIUtilityInitializePromptWorkspacesFormAllowedRoles,
  CLIUtilityInitializePromptWorkspacesFormOptions,
  CLIUtilityInitializePromptWorkspacesFormPolicy,
  CLIUtilityInitializePromptWorkspacesFormPolicyPromptKey,
  CLIUtilityInitializePromptWorkspacesFormPolicyPromptValue,
  CLIUtilityInitializePromptWorkspacesFormResolveNameReturns,
  CLIUtilityInitializePromptWorkspacesFormResolveNameRole,
  CLIUtilityInitializePromptWorkspacesFormReturns,
  CLIUtilityInitializePromptWorkspacesFormRolePromptKey,
  CLIUtilityInitializePromptWorkspacesFormRolePromptValue,
  CLIUtilityInitializePromptWorkspacesMenuOutputKey,
  CLIUtilityInitializePromptWorkspacesMenuOutputValue,
  CLIUtilityInitializePromptWorkspacesReturns,
  CLIUtilityInitializePromptWorkspacesSummaryParts,
  CLIUtilityInitializeRunOptions,
  CLIUtilityInitializeRunReturns,
  CLIUtilityInitializeSanitizeHttpUrlField,
  CLIUtilityInitializeSanitizeHttpUrlReturns,
  CLIUtilityInitializeSanitizeHttpUrlValue,
  CLIUtilityInitializeValidateFundSourcesReturns,
  CLIUtilityInitializeValidateFundSourcesValue,
  CLIUtilityInitializeValidateHttpUrlField,
  CLIUtilityInitializeValidateHttpUrlReturns,
  CLIUtilityInitializeValidateHttpUrlValue,
} from '@/types/cli/utility.d.ts';

/**
 * CLI Utility - Initialize.
 *
 * @since 1.0.0
 */
export class CLIUtilityInitialize {
  /**
   * CLI Utility - Initialize - Run.
   *
   * @param {CLIUtilityInitializeRunOptions} options - Options.
   *
   * @returns {CLIUtilityInitializeRunReturns}
   *
   * @since 1.0.0
   */
  public static async run(options: CLIUtilityInitializeRunOptions): CLIUtilityInitializeRunReturns {
    const currentDirectory = process.cwd();
    const isProjectRoot = await CLIUtilityInitialize.checkPath(currentDirectory);

    if (!isProjectRoot) {
      process.exitCode = 1;

      return;
    }

    if (options.dryRun === true) {
      Logger.customize({
        name: 'CLIUtilityInitialize.run::options',
        padBottom: 1,
      }).warn('Dry run enabled. File changes will not be made in this session.');
    }

    const novaConfig = new NovaConfig();
    const workingFile = await novaConfig.load();
    const promptFlowResult = await CLIUtilityInitialize.promptFlow(workingFile);

    if (promptFlowResult === 'cancel') {
      Logger.customize({
        name: 'CLIUtilityInitialize.run::promptFlow',
        padTop: 1,
        padBottom: 1,
      }).debug('Prompt flow exited without saving.');

      return;
    }

    novaConfig.set(workingFile);

    if (options.dryRun === true) {
      Logger.customize({
        name: 'CLIUtilityInitialize.run::promptFlow',
        padTop: 1,
        padBottom: 1,
      }).debug('Dry run enabled. Skipping save operation.');

      return;
    }

    await novaConfig.save();
  }

  /**
   * CLI Utility - Initialize - Prompt flow.
   *
   * @param {CLIUtilityInitializePromptFlowConfig} config - Config.
   *
   * @private
   *
   * @returns {CLIUtilityInitializePromptFlowReturns}
   *
   * @since 1.0.0
   */
  private static async promptFlow(config: CLIUtilityInitializePromptFlowConfig): CLIUtilityInitializePromptFlowReturns {
    const category: CLIUtilityInitializePromptFlowCategory = {
      project: {
        label: 'Project',
        description: 'Configure project metadata (name, description, keywords).',
        handler: CLIUtilityInitialize.promptProject,
      },
      entities: {
        label: 'Entities',
        description: 'Manage entities, their roles, and contact information.',
        handler: CLIUtilityInitialize.promptEntities,
      },
      urls: {
        label: 'URLs',
        description: 'Set URLs for docs, repo, support, and funding sources.',
        handler: CLIUtilityInitialize.promptUrls,
      },
      workspaces: {
        label: 'Workspaces',
        description: 'Review workspace packages, assigning roles and policies.',
        handler: CLIUtilityInitialize.promptWorkspaces,
      },
    };

    while (true) {
      const categoryKeys = Object.keys(category) as (keyof typeof category)[];
      const choices: CLIUtilityInitializePromptFlowChoices = categoryKeys.map((categoryKey) => ({
        title: category[categoryKey].label,
        description: category[categoryKey].description,
        value: categoryKey,
      }));

      choices.push({
        title: 'Save & Exit',
        description: 'Persist the "nova.config.json" file and exit.',
        value: 'save',
      });

      choices.push({
        title: 'Cancel',
        description: 'Exit without persisting any changes.',
        value: 'cancel',
      });

      const menuOutput = await CLIUtilityInitialize.promptWithCancel<CLIUtilityInitializePromptFlowSelectMenuOutputKeys, CLIUtilityInitializePromptFlowSelectMenuOutputResult>({
        type: 'select',
        name: 'action',
        message: 'Select a Nova configuration category to edit.',
        choices,
      });

      if (menuOutput.cancelled) {
        return 'cancel';
      }

      const menuOutputResult = menuOutput.result;

      if (
        menuOutputResult.action === undefined
        || menuOutputResult.action === 'cancel'
      ) {
        return 'cancel';
      }

      if (menuOutputResult.action === 'save') {
        return 'save';
      }

      const categoryKey = menuOutputResult.action;
      const categoryHandler = category[categoryKey].handler;

      await categoryHandler(config);
    }
  }

  /**
   * CLI Utility - Initialize - Prompt project.
   *
   * @param {CLIUtilityInitializePromptProjectConfig} config - Config.
   *
   * @private
   *
   * @returns {CLIUtilityInitializePromptProjectReturns}
   *
   * @since 1.0.0
   */
  private static async promptProject(config: CLIUtilityInitializePromptProjectConfig): CLIUtilityInitializePromptProjectReturns {
    const existingProject = config.project;
    const existingProjectName = existingProject?.name;
    const existingProjectDescription = existingProject?.description;
    const existingProjectKeywords = existingProject?.keywords;

    const project = (existingProject !== undefined) ? { ...existingProject } : {};
    const projectName = (existingProjectName !== undefined) ? { ...existingProjectName } : {};
    const projectDescription = (existingProjectDescription !== undefined) ? { ...existingProjectDescription } : {};

    const questionsOutput = await CLIUtilityInitialize.promptWithCancel<CLIUtilityInitializePromptProjectQuestionsOutputKeys, CLIUtilityInitializePromptProjectQuestionsOutputResult>([
      {
        type: 'text',
        name: 'projectNameTitle',
        message: 'Project title (display name)',
        initial: projectName.title ?? '',
      },
      {
        type: 'text',
        name: 'projectNameSlug',
        message: 'Project slug (package name)',
        initial: projectName.slug ?? '',
        validate: (value) => {
          const trimmed = value.trim();

          if (trimmed === '' || new RegExp(PATTERN_SLUG_SIMPLE, 'i').test(trimmed)) {
            return true;
          }

          return 'Use letters, numbers, hyphens, and underscores only.';
        },
      },
      {
        type: 'text',
        name: 'projectDescriptionShort',
        message: 'Short description',
        initial: projectDescription.short ?? '',
      },
      {
        type: 'text',
        name: 'projectDescriptionLong',
        message: 'Long description',
        initial: projectDescription.long ?? '',
      },
      {
        type: 'text',
        name: 'projectKeywords',
        message: 'Keywords (comma separated)',
        initial: (Array.isArray(existingProjectKeywords)) ? existingProjectKeywords.join(', ') : '',
      },
    ]);

    if (questionsOutput.cancelled) {
      return 'back';
    }

    const questionsOutputResult = questionsOutput.result;

    const projectNameTitleInput = (questionsOutputResult.projectNameTitle ?? '').trim();
    const projectNameSlugInput = (questionsOutputResult.projectNameSlug ?? '').trim();
    const projectDescriptionShortInput = (questionsOutputResult.projectDescriptionShort ?? '').trim();
    const projectDescriptionLongInput = (questionsOutputResult.projectDescriptionLong ?? '').trim();
    const projectKeywordsInput = (questionsOutputResult.projectKeywords ?? '').trim();

    // Project name - Title.
    if (projectNameTitleInput === '') {
      Reflect.deleteProperty(projectName, 'title');
    } else {
      projectName.title = projectNameTitleInput;
    }

    // Project name - Slug.
    if (projectNameSlugInput === '') {
      Reflect.deleteProperty(projectName, 'slug');
    } else {
      projectName.slug = projectNameSlugInput;
    }

    // Project description - Short.
    if (projectDescriptionShortInput === '') {
      Reflect.deleteProperty(projectDescription, 'short');
    } else {
      projectDescription.short = projectDescriptionShortInput;
    }

    // Project description - Long.
    if (projectDescriptionLongInput === '') {
      Reflect.deleteProperty(projectDescription, 'long');
    } else {
      projectDescription.long = projectDescriptionLongInput;
    }

    // Project name.
    if (Object.keys(projectName).length > 0) {
      project.name = projectName;
    } else {
      Reflect.deleteProperty(project, 'name');
    }

    // Project description.
    if (Object.keys(projectDescription).length > 0) {
      project.description = projectDescription;
    } else {
      Reflect.deleteProperty(project, 'description');
    }

    // Project keywords.
    if (projectKeywordsInput === '') {
      Reflect.deleteProperty(project, 'keywords');
    } else {
      const projectKeywordsList = projectKeywordsInput
        .split(',')
        .map((projectKeywordInput) => projectKeywordInput.trim())
        .filter((projectKeywordInput) => projectKeywordInput !== '');

      if (projectKeywordsList.length > 0) {
        project.keywords = projectKeywordsList;
      } else {
        Reflect.deleteProperty(project, 'keywords');
      }
    }

    // Project.
    if (Object.keys(project).length > 0) {
      Object.assign(config, { project });
    } else {
      Reflect.deleteProperty(config, 'project');
    }

    const previousSlug = existingProjectName?.slug ?? '';
    const currentSlug = config.project?.name?.slug ?? '';
    const slugChanged = previousSlug !== currentSlug;

    // Automatically update workspace names for specific roles that use the project slug.
    if (slugChanged && config.workspaces !== undefined) {
      const rolesToSync: CLIUtilityInitializePromptProjectRolesToSync = ['project', 'docs', 'config', 'app', 'tool'];
      const slugPrefix = new RegExp(`^${previousSlug}-`);

      Logger.customize({
        name: 'CLIUtilityInitialize.promptProject::updated',
        padTop: 1,
      }).info(`Project slug updated from "${previousSlug || '(unset)'}" to "${currentSlug || '(unset)'}".`);

      for (const workspace of Object.values(config.workspaces)) {
        if (!rolesToSync.includes(workspace.role)) {
          continue;
        }

        const { name } = workspace;

        // If user added a slug, removed the slug, or changed the slug.
        if (previousSlug === '' && currentSlug !== '') {
          workspace.name = `${currentSlug}-${name}`;
        } else if (previousSlug !== '' && currentSlug === '') {
          workspace.name = name.replace(slugPrefix, '');
        } else {
          workspace.name = name.replace(slugPrefix, `${currentSlug}-`);
        }

        Logger.customize({ name: 'CLIUtilityInitialize.promptProject::updated' }).info(`Workspace name updated from "${name}" to "${workspace.name}".`);
      }
    }

    Logger.customize({
      name: 'CLIUtilityInitialize.promptProject::updated',
      padTop: (slugChanged && config.workspaces !== undefined) ? 0 : 1,
      padBottom: 1,
    }).info('Project details updated.');

    return 'back';
  }

  /**
   * CLI Utility - Initialize - Prompt entities.
   *
   * @param {CLIUtilityInitializePromptEntitiesConfig} config - Config.
   *
   * @private
   *
   * @returns {CLIUtilityInitializePromptEntitiesReturns}
   *
   * @since 1.0.0
   */
  private static async promptEntities(config: CLIUtilityInitializePromptEntitiesConfig): CLIUtilityInitializePromptEntitiesReturns {
    const entities: CLIUtilityInitializePromptEntitiesEntities = [];

    // Populate the entities from config.
    if (Array.isArray(config.entities)) {
      for (const configEntity of config.entities) {
        const clonedEntity = { ...configEntity };

        // Entities - Roles.
        if (Array.isArray(configEntity.roles)) {
          clonedEntity.roles = [...configEntity.roles];
        } else {
          Reflect.deleteProperty(clonedEntity, 'roles');
        }

        entities.push(clonedEntity);
      }
    }

    /**
     * CLI Utility - Initialize - Prompt entities - Sync.
     *
     * @returns {CLIUtilityInitializePromptEntitiesSyncReturns}
     *
     * @since 1.0.0
     */
    const sync = (): CLIUtilityInitializePromptEntitiesSyncReturns => {
      if (entities.length > 0) {
        // Entities.
        const normalizedEntities = entities.map((entity) => {
          const normalizedEntity = { ...entity };

          // Entities - Roles.
          if (Array.isArray(entity.roles) && entity.roles.length > 0) {
            normalizedEntity.roles = [...entity.roles];
          } else {
            Reflect.deleteProperty(normalizedEntity, 'roles');
          }

          return normalizedEntity;
        });

        Object.assign(config, { entities: normalizedEntities });
      } else {
        Reflect.deleteProperty(config, 'entities');
      }
    };

    while (true) {
      const choices: CLIUtilityInitializePromptEntitiesChoices = [];

      // Add the "EDIT" and "REMOVE" menu choices for each entity.
      entities.forEach((entity, index) => {
        const entityName = (entity.name !== undefined) ? entity.name.trim() : '';
        const entityEmail = (entity.email !== undefined) ? entity.email.trim() : '';
        const entityRoles = (Array.isArray(entity.roles)) ? entity.roles.filter((role) => role.trim() !== '') : [];

        const label = entityName || entityEmail || `Entity ${index + 1}`;
        const descriptionParts: CLIUtilityInitializePromptEntitiesDescriptionParts = [];

        // Add "email" to menu description for each entity.
        if (entityEmail !== '') {
          descriptionParts.push(entityEmail);
        }

        // Add "roles" to menu description for each entity.
        if (entityRoles.length > 0) {
          const normalizedRoles = entityRoles
            .map((entityRole) => entityRole.trim())
            .filter((entityRole) => entityRole.length > 0)
            .reduce<CLIUtilityInitializePromptEntitiesNormalizedRolesReduce>((unique, entityRole) => {
              if (!unique.includes(entityRole)) {
                unique.push(entityRole);
              }
              return unique;
            }, []);

          if (normalizedRoles.length > 0) {
            descriptionParts.push(normalizedRoles.join(', '));
          }
        }

        const description = descriptionParts.join(' · ');

        choices.push({
          title: `${chalk.yellow.bold('[EDIT]')} ${label}`,
          description: (description !== '') ? description : 'Update this entity.',
          value: {
            kind: 'edit',
            index,
          },
        });

        choices.push({
          title: `${chalk.red.bold('[REMOVE]')} ${label}`,
          description: 'Delete this entity.',
          value: {
            kind: 'remove',
            index,
          },
        });
      });

      choices.push({
        title: 'Add new entity',
        description: 'Create a new entity.',
        value: {
          kind: 'add',
        },
      });

      choices.push({
        title: 'Back',
        description: 'Return to the category selection.',
        value: {
          kind: 'back',
        },
      });

      const menuOutput = await CLIUtilityInitialize.promptWithCancel<CLIUtilityInitializePromptEntitiesMenuOutputKeys, CLIUtilityInitializePromptEntitiesMenuOutputResult>({
        type: 'select',
        name: 'action',
        message: (entities.length > 0) ? 'Select an entity to manage.' : 'No entities found. Choose an option.',
        choices,
      });

      if (menuOutput.cancelled) {
        return 'back';
      }

      const menuOutputResult = menuOutput.result;

      // If user wants to go back to the main menu.
      if (
        menuOutputResult.action === undefined
        || menuOutputResult.action.kind === 'back'
      ) {
        // Sync changes back to config.
        sync();

        return 'back';
      }

      // If user wants to add an entity.
      if (menuOutputResult.action.kind === 'add') {
        const result = await CLIUtilityInitialize.promptEntitiesForm(undefined, 'create');

        if (result.action === 'back') {
          continue;
        }

        // Add a new entity.
        entities.push(result.entity);

        // Sync changes back to config.
        sync();

        Logger.customize({
          name: 'CLIUtilityInitialize.promptEntities::add',
          padTop: 1,
          padBottom: 1,
        }).info('Added new entity.');

        continue;
      }

      // If user wants to edit an entity.
      if (menuOutputResult.action.kind === 'edit') {
        const entityIndex = menuOutputResult.action.index;

        // If entity index was out-of-bounds.
        if (entityIndex < 0 || entityIndex >= entities.length) {
          continue;
        }

        const entityToEdit = entities[entityIndex];
        const entityResult = await CLIUtilityInitialize.promptEntitiesForm(entityToEdit, 'update');

        if (entityResult.action === 'back') {
          continue;
        }

        // Update the entity.
        entities[entityIndex] = entityResult.entity;

        // Sync changes back to config.
        sync();

        Logger.customize({
          name: 'CLIUtilityInitialize.promptEntities::edit',
          padTop: 1,
          padBottom: 1,
        }).info('Updated entity.');

        continue;
      }

      // If user wants to remove an entity.
      if (menuOutputResult.action.kind === 'remove') {
        const entityIndex = menuOutputResult.action.index;

        // If entity index was out-of-bounds.
        if (entityIndex < 0 || entityIndex >= entities.length) {
          continue;
        }

        const entityToRemove = entities[entityIndex];

        // If entity to remove does not exist.
        if (entityToRemove === undefined) {
          continue;
        }

        const entityName = (typeof entityToRemove.name === 'string') ? entityToRemove.name.trim() : '';
        const entityEmail = (typeof entityToRemove.email === 'string') ? entityToRemove.email.trim() : '';
        const entityLabel = entityName || entityEmail || `Entity ${entityIndex + 1}`;

        const shouldRemove = await CLIUtilityInitialize.promptEntitiesDeleteForm(entityLabel);

        if (!shouldRemove) {
          continue;
        }

        // Delete the entity.
        entities.splice(entityIndex, 1);

        // Sync changes back to config.
        sync();

        Logger.customize({
          name: 'CLIUtilityInitialize.promptEntities::remove',
          padTop: 1,
          padBottom: 1,
        }).info('Removed entity.');
      }
    }
  }

  /**
   * CLI Utility - Initialize - Prompt entities form.
   *
   * @param {CLIUtilityInitializePromptEntitiesFormEntity} entity - Entity.
   * @param {CLIUtilityInitializePromptEntitiesFormMode}   mode   - Mode.
   *
   * @private
   *
   * @returns {CLIUtilityInitializePromptEntitiesFormReturns}
   *
   * @since 1.0.0
   */
  private static async promptEntitiesForm(entity: CLIUtilityInitializePromptEntitiesFormEntity, mode: CLIUtilityInitializePromptEntitiesFormMode): CLIUtilityInitializePromptEntitiesFormReturns {
    const validRoles = ['author', 'contributor', 'supporter'] as CLIUtilityInitializePromptEntitiesFormValidRoles;

    const existingName = (typeof entity?.name === 'string') ? entity.name : '';
    const existingEmail = (typeof entity?.email === 'string') ? entity.email : '';
    const existingUrl = (typeof entity?.url === 'string') ? entity.url : '';

    let existingRoles: CLIUtilityInitializePromptEntitiesFormExistingRoles = [];

    // If roles exist inside the entity, add it in.
    if (Array.isArray(entity?.roles)) {
      existingRoles = entity.roles.filter((role) => validRoles.includes(role));
    }

    const questionsOutput = await CLIUtilityInitialize.promptWithCancel<CLIUtilityInitializePromptEntitiesFormQuestionsOutputKey, CLIUtilityInitializePromptEntitiesFormQuestionsOutputValue<CLIUtilityInitializePromptEntitiesFormQuestionsOutputKey>>([
      {
        type: 'text',
        name: 'entityName',
        message: 'Entity name',
        initial: existingName,
      },
      {
        type: 'text',
        name: 'entityEmail',
        message: 'Entity email address',
        initial: existingEmail,
        validate: (value) => {
          const trimmed = value.trim();

          if (trimmed === '') {
            return true;
          }

          if (PATTERN_EMAIL_SIMPLE.test(trimmed)) {
            return true;
          }

          return 'Enter a valid email address or leave blank.';
        },
      },
      {
        type: 'text',
        name: 'entityUrl',
        message: 'Entity website',
        initial: existingUrl,
        validate: (value) => {
          const trimmed = value.trim();

          if (trimmed === '') {
            return true;
          }

          if (CLIUtilityInitialize.isAllowedHttpUrl(trimmed)) {
            return true;
          }

          return 'Enter a valid URL (http:// or https://) or leave blank.';
        },
      },
      {
        type: 'multiselect',
        name: 'entityRoles',
        message: 'Entity roles',
        choices: validRoles.map((validRole) => ({
          title: `${validRole.charAt(0).toUpperCase()}${validRole.slice(1)}`,
          value: validRole,
          selected: existingRoles.includes(validRole),
        })),
      },
    ]);

    if (questionsOutput.cancelled) {
      return {
        action: 'back',
      };
    }

    const questionsOutputResult = questionsOutput.result;

    const entityNameInput = (typeof questionsOutputResult.entityName === 'string') ? questionsOutputResult.entityName.trim() : '';
    const entityEmailInput = (typeof questionsOutputResult.entityEmail === 'string') ? questionsOutputResult.entityEmail.trim() : '';
    const entityUrlInput = (typeof questionsOutputResult.entityUrl === 'string') ? questionsOutputResult.entityUrl.trim() : '';
    const entityRolesInput = Array.isArray(questionsOutputResult.entityRoles) ? [...questionsOutputResult.entityRoles] : [];

    const resolvedEntity: CLIUtilityInitializePromptEntitiesFormResolvedEntity = {};

    // Entity name.
    if (entityNameInput !== '') {
      resolvedEntity.name = entityNameInput;
    }

    // Entity email.
    if (entityEmailInput !== '') {
      resolvedEntity.email = entityEmailInput;
    }

    // Entity url.
    if (entityUrlInput !== '') {
      resolvedEntity.url = entityUrlInput;
    }

    // Entity roles.
    if (entityRolesInput.length > 0) {
      resolvedEntity.roles = entityRolesInput;
    }

    // Prevents empty entities from being created.
    if (mode === 'create' && Object.keys(resolvedEntity).length < 1) {
      return {
        action: 'back',
      };
    }

    return {
      action: 'apply',
      entity: resolvedEntity,
    };
  }

  /**
   * CLI Utility - Initialize - Prompt entities delete form.
   *
   * @param {CLIUtilityInitializePromptEntitiesDeleteFormLabel} label - Label.
   *
   * @private
   *
   * @returns {CLIUtilityInitializePromptEntitiesDeleteFormReturns}
   *
   * @since 1.0.0
   */
  private static async promptEntitiesDeleteForm(label: CLIUtilityInitializePromptEntitiesDeleteFormLabel): CLIUtilityInitializePromptEntitiesDeleteFormReturns {
    const confirmOutput = await CLIUtilityInitialize.promptWithCancel<CLIUtilityInitializePromptEntitiesDeleteFormConfirmOutputKey, CLIUtilityInitializePromptEntitiesDeleteFormConfirmOutputValue>({
      type: 'confirm',
      name: 'confirm',
      message: `Remove entity "${label}"?`,
      initial: false,
    });

    if (confirmOutput.cancelled) {
      return false;
    }

    const confirmOutputResult = confirmOutput.result;

    return confirmOutputResult.confirm;
  }

  /**
   * CLI Utility - Initialize - Prompt urls.
   *
   * @param {CLIUtilityInitializePromptUrlsConfig} config - Config.
   *
   * @private
   *
   * @returns {CLIUtilityInitializePromptUrlsReturns}
   *
   * @since 1.0.0
   */
  private static async promptUrls(config: CLIUtilityInitializePromptUrlsConfig): CLIUtilityInitializePromptUrlsReturns {
    const existingUrls = config.urls;

    const urls = (existingUrls !== undefined) ? { ...existingUrls } : {};

    const validatedUrls: CLIUtilityInitializePromptUrlsValidatedUrls = {};

    /**
     * CLI Utility - Initialize - Prompt urls - Validate.
     *
     * @param {CLIUtilityInitializePromptUrlsValidateKey}   key   - Key.
     * @param {CLIUtilityInitializePromptUrlsValidateInput} input - Input.
     *
     * @returns {CLIUtilityInitializePromptUrlsValidateReturns}
     *
     * @since 1.0.0
     */
    const validate = (key: CLIUtilityInitializePromptUrlsValidateKey, input: CLIUtilityInitializePromptUrlsValidateInput): CLIUtilityInitializePromptUrlsValidateReturns => {
      const field = (key === 'repository') ? 'repository' : undefined;
      const sanitizedUrl = CLIUtilityInitialize.sanitizeHttpUrl(input, field);

      if (sanitizedUrl !== undefined) {
        validatedUrls[key] = sanitizedUrl;
      }
    };

    const questionsOutput = await CLIUtilityInitialize.promptWithCancel<CLIUtilityInitializePromptUrlsQuestionsOutputKey, CLIUtilityInitializePromptUrlsQuestionsOutputValue>([
      {
        type: 'text',
        name: 'urlsHomepage',
        message: 'Homepage URL',
        initial: urls.homepage ?? '',
        validate: (value) => CLIUtilityInitialize.validateHttpUrl(value),
      },
      {
        type: 'text',
        name: 'urlsRepository',
        message: 'Repository URL',
        initial: urls.repository ?? '',
        validate: (value) => CLIUtilityInitialize.validateHttpUrl(value, 'repository'),
      },
      {
        type: 'text',
        name: 'urlsBugs',
        message: 'Issue tracker URL',
        initial: urls.bugs ?? '',
        validate: (value) => CLIUtilityInitialize.validateHttpUrl(value),
      },
      {
        type: 'text',
        name: 'urlsLicense',
        message: 'License URL',
        initial: urls.license ?? '',
        validate: (value) => CLIUtilityInitialize.validateHttpUrl(value),
      },
      {
        type: 'text',
        name: 'urlsLogo',
        message: 'Logo URL',
        initial: urls.logo ?? '',
        validate: (value) => CLIUtilityInitialize.validateHttpUrl(value),
      },
      {
        type: 'text',
        name: 'urlsDocumentation',
        message: 'Documentation URL',
        initial: urls.documentation ?? '',
        validate: (value) => CLIUtilityInitialize.validateHttpUrl(value),
      },
      {
        type: 'text',
        name: 'urlsGithub',
        message: 'GitHub URL',
        initial: urls.github ?? '',
        validate: (value) => CLIUtilityInitialize.validateHttpUrl(value),
      },
      {
        type: 'text',
        name: 'urlsNpm',
        message: 'npm package URL',
        initial: urls.npm ?? '',
        validate: (value) => CLIUtilityInitialize.validateHttpUrl(value),
      },
      {
        type: 'text',
        name: 'urlsFundSources',
        message: 'Funding URLs (comma separated)',
        initial: (Array.isArray(urls.fundSources)) ? urls.fundSources.join(', ') : '',
        validate: CLIUtilityInitialize.validateFundSources,
      },
    ]);

    if (questionsOutput.cancelled) {
      return 'back';
    }

    const questionsOutputResult = questionsOutput.result;

    validate('homepage', questionsOutputResult.urlsHomepage);
    validate('repository', questionsOutputResult.urlsRepository);
    validate('bugs', questionsOutputResult.urlsBugs);
    validate('license', questionsOutputResult.urlsLicense);
    validate('logo', questionsOutputResult.urlsLogo);
    validate('documentation', questionsOutputResult.urlsDocumentation);
    validate('github', questionsOutputResult.urlsGithub);
    validate('npm', questionsOutputResult.urlsNpm);

    const fundSourcesParts = questionsOutputResult.urlsFundSources
      .split(',')
      .map((fundSourceInput) => fundSourceInput.trim())
      .filter((fundSourceInput) => fundSourceInput !== '');

    // URLs - Fund sources.
    if (fundSourcesParts.length > 0) {
      const fundSourcesList: CLIUtilityInitializePromptUrlsFundSourcesList = [];

      for (const fundSourcesPart of fundSourcesParts) {
        const sanitizedUrl = CLIUtilityInitialize.sanitizeHttpUrl(fundSourcesPart, 'generic');

        if (sanitizedUrl !== undefined) {
          fundSourcesList.push(sanitizedUrl);
        }
      }

      if (fundSourcesList.length > 0) {
        validatedUrls.fundSources = fundSourcesList;
      }
    }

    // URLs.
    if (Object.keys(validatedUrls).length > 0) {
      Object.assign(config, { urls: validatedUrls });
    } else {
      Reflect.deleteProperty(config, 'urls');
    }

    Logger.customize({
      name: 'CLIUtilityInitialize.promptUrls::updated',
      padTop: 1,
      padBottom: 1,
    }).info('URL references updated.');

    return 'back';
  }

  /**
   * CLI Utility - Initialize - Prompt workspaces.
   *
   * @param {CLIUtilityInitializePromptWorkspacesConfig} config - Config.
   *
   * @private
   *
   * @returns {CLIUtilityInitializePromptWorkspacesReturns}
   *
   * @since 1.0.0
   */
  private static async promptWorkspaces(config: CLIUtilityInitializePromptWorkspacesConfig): CLIUtilityInitializePromptWorkspacesReturns {
    const workspaces: CLIUtilityInitializePromptWorkspaces = (config.workspaces) ? { ...(config.workspaces) } : {};

    // The "run" command already guarantees we run in the project root (called "checkPath"), so we can traverse forward directly.
    const rawWorkspacePaths = await discoverPathsWithFile('package.json', 'forward');
    const workspacePaths = rawWorkspacePaths.map((rawWorkspacePath) => {
      const relativePath = path.relative(process.cwd(), rawWorkspacePath);

      if (relativePath === '') {
        return './';
      }

      return `./${relativePath.split(path.sep).join('/')}`;
    });

    Logger.customize({ name: 'CLIUtilityInitialize.promptWorkspaces::paths' }).debug(workspacePaths);

    while (true) {
      const choices = workspacePaths.map((workspacePath) => {
        const workspace = workspaces[workspacePath];
        const summaryParts: CLIUtilityInitializePromptWorkspacesSummaryParts = [];

        if (workspace.name) {
          summaryParts.push(workspace.name);
        }

        if (workspace.role) {
          summaryParts.push(workspace.role);
        }

        if (workspace.policy) {
          summaryParts.push(workspace.policy);
        }

        return {
          title: workspacePath,
          description: (summaryParts.length > 0) ? summaryParts.join(' · ') : 'Not configured yet.',
          value: workspacePath,
        };
      });

      choices.push({
        title: 'Back',
        description: 'Return to the category selection.',
        value: 'back',
      });

      const menuOutput = await CLIUtilityInitialize.promptWithCancel<CLIUtilityInitializePromptWorkspacesMenuOutputKey, CLIUtilityInitializePromptWorkspacesMenuOutputValue>({
        type: 'select',
        name: 'workspacePath',
        message: 'Select a workspace to configure.',
        choices,
      });

      if (menuOutput.cancelled) {
        return 'back';
      }

      const menuOutputResult = menuOutput.result;

      if (
        menuOutputResult.workspacePath === undefined
        || menuOutputResult.workspacePath === 'back'
      ) {
        return 'back';
      }

      const workspacePath = menuOutputResult.workspacePath;
      const formResult = await CLIUtilityInitialize.promptWorkspacesForm({
        workspacePath,
        existingWorkspace: workspaces[workspacePath],
        projectSlug: config.project?.name?.slug,
      });

      if (formResult.action === 'back') {
        continue;
      }

      workspaces[workspacePath] = formResult.workspace;

      Object.assign(config, { workspaces });

      Logger.customize({
        name: 'CLIUtilityInitialize.promptWorkspaces::updated',
        padTop: 1,
        padBottom: 1,
      }).info(`Updated workspace "${workspacePath}" → ${formResult.workspace.name} · ${formResult.workspace.role} · ${formResult.workspace.policy}`);
    }
  }

  /**
   * CLI Utility - Initialize - Prompt workspaces form.
   *
   * @param {CLIUtilityInitializePromptWorkspacesFormOptions} options - Options.
   *
   * @private
   *
   * @returns {CLIUtilityInitializePromptWorkspacesFormReturns}
   *
   * @since 1.0.0
   */
  private static async promptWorkspacesForm(options: CLIUtilityInitializePromptWorkspacesFormOptions): CLIUtilityInitializePromptWorkspacesFormReturns {
    const allowedRoles: CLIUtilityInitializePromptWorkspacesFormAllowedRoles = [
      {
        title: 'Project Root',
        description: 'Monorepo root workspace (e.g., root package.json)',
        value: 'project',
      },
      {
        title: 'Configuration',
        description: 'Shared static config (e.g., eslint, tsconfig, prettier)',
        value: 'config',
      },
      {
        title: 'Documentation',
        description: 'Documentation workspace (e.g., Docusaurus, Docsify)',
        value: 'docs',
      },
      {
        title: 'Application',
        description: 'Deployable runtimes (e.g., web, mobile, workers, API, bots)',
        value: 'app',
      },
      {
        title: 'Package',
        description: 'Reusable modules (e.g., libraries, plugins, components)',
        value: 'package',
      },
      {
        title: 'Tool',
        description: 'Internal CLI or build tools (e.g., codegen, bundler)',
        value: 'tool',
      },
    ];
    const policy: CLIUtilityInitializePromptWorkspacesFormPolicy = {
      freezable: {
        label: 'Freezable',
        description: 'Non-versioned (0.0.0) and never published (private: true)',
      },
      trackable: {
        label: 'Trackable',
        description: 'Versioned (>=0.0.1) and never published (private: true)',
      },
      distributable: {
        label: 'Distributable',
        description: 'Versioned (>=0.0.1) and published (private: false)',
      },
    };

    /**
     * CLI Utility - Initialize - Prompt workspaces form - Resolve name.
     *
     * @param {CLIUtilityInitializePromptWorkspacesFormResolveNameRole} role - Role.
     *
     * @returns {CLIUtilityInitializePromptWorkspacesFormResolveNameReturns}
     *
     * @since 1.0.0
     */
    const resolveName = async (role: CLIUtilityInitializePromptWorkspacesFormResolveNameRole): CLIUtilityInitializePromptWorkspacesFormResolveNameReturns => {
      // "project" (Project root) and "docs" always get a fixed name.
      if (role === 'project' || role === 'docs') {
        if (options.projectSlug === undefined) {
          return (role === 'project') ? 'project' : 'docs';
        }

        return `${options.projectSlug}-${role}`;
      }

      const base = (options.projectSlug !== undefined) ? `${options.projectSlug}-${role}` : role;

      // If current workspace is not "project" or "docs", the workspace name would have a fixed prefix or simple slug.
      const namePrompt = await CLIUtilityInitialize.promptWithCancel<'workspaceName', string>({
        type: 'text',
        name: 'workspaceName',
        message: 'Workspace package name',
        initial: options.existingWorkspace.name,
        validate: (value) => {
          const trimmed = value.trim();

          if (trimmed === '') {
            return 'Enter a package name.';
          }

          switch (role) {
            case 'config':
            case 'app':
            case 'tool':
              // Base for "config", "app", and "tool" is either `${projectSlug}-${role}` or just `${role}`.
              const expectedPrefix = `${base}-`;

              if (!trimmed.startsWith(expectedPrefix)) {
                return `Begin with "${expectedPrefix}" and add a descriptor slug.`;
              }

              const descriptor = trimmed.slice(expectedPrefix.length);

              if (descriptor.length === 0) {
                return 'Add a descriptor after the prefix.';
              }

              if (!PATTERN_SLUG_SIMPLE.test(descriptor)) {
                return 'Descriptor must match the slug pattern (lowercase letters, numbers, hyphens, underscores).';
              }

              return true;
            case 'package':
            default:
              if (PATTERN_SLUG_SIMPLE.test(trimmed) || PATTERN_SLUG_SCOPED.test(trimmed)) {
                return true;
              }

              return 'Enter an unscoped slug or a scoped package name (e.g. @scope/name).';
          }
        },
      });

      if (namePrompt.cancelled) {
        return undefined;
      }

      const name = namePrompt.result.workspaceName.trim();

      return (name === '') ? undefined : name;
    };

    // For each workspace, the user must select a role.
    const rolePrompt = await CLIUtilityInitialize.promptWithCancel<CLIUtilityInitializePromptWorkspacesFormRolePromptKey, CLIUtilityInitializePromptWorkspacesFormRolePromptValue>({
      type: 'select',
      name: 'workspaceRole',
      message: `Select a role for "${options.workspacePath}"`,
      choices: allowedRoles.map((role) => ({
        title: role.title,
        description: role.description,
        value: role.value,
      })),
      initial: Math.max(0, allowedRoles.findIndex((role) => role.value === options.existingWorkspace.role)),
    });

    if (rolePrompt.cancelled) {
      return {
        action: 'back',
      };
    }

    const selectedRole = rolePrompt.result.workspaceRole;
    const allowedPolicies = itemAllowedPoliciesByRole[selectedRole];

    // Based on the selected role, list out allowed policy choices.
    const policyPrompt = await CLIUtilityInitialize.promptWithCancel<CLIUtilityInitializePromptWorkspacesFormPolicyPromptKey, CLIUtilityInitializePromptWorkspacesFormPolicyPromptValue>({
      type: 'select',
      name: 'workspacePolicy',
      message: 'Select a policy',
      choices: allowedPolicies.map((allowedPolicy) => ({
        title: policy[allowedPolicy].label,
        description: policy[allowedPolicy].description,
        value: allowedPolicy,
      })),
      initial: Math.max(0, allowedPolicies.findIndex((policy) => policy === options.existingWorkspace.policy)),
    });

    if (policyPrompt.cancelled) {
      return {
        action: 'back',
      };
    }

    const selectedPolicy = policyPrompt.result.workspacePolicy;
    const resolvedName = await resolveName(selectedRole);

    if (resolvedName === undefined) {
      return {
        action: 'back',
      };
    }

    return {
      action: 'apply',
      workspace: {
        name: resolvedName,
        role: selectedRole,
        policy: selectedPolicy,
      },
    };
  }

  /**
   * CLI Utility - Initialize - Prompt with cancel.
   *
   * @param {CLIUtilityInitializePromptWithCancelQuestions} questions - Questions.
   *
   * @private
   *
   * @returns {CLIUtilityInitializePromptWithCancelReturns}
   *
   * @since 1.0.0
   */
  private static async promptWithCancel<Keys extends string, Result>(questions: CLIUtilityInitializePromptWithCancelQuestions<Keys>): CLIUtilityInitializePromptWithCancelReturns<Keys, Result> {
    let cancelled = false;

    const result = await prompts<Keys>(questions, {
      onCancel: () => {
        cancelled = true;

        return false;
      },
    });

    if (cancelled) {
      return {
        cancelled: true,
      };
    }

    return {
      cancelled: false,
      result,
    };
  }

  /**
   * CLI Utility - Initialize - Check path.
   *
   * @param {CLIUtilityInitializeCheckPathCurrentDirectory} currentDirectory - Current directory.
   *
   * @private
   *
   * @returns {CLIUtilityInitializeCheckPathReturns}
   *
   * @since 1.0.0
   */
  private static async checkPath(currentDirectory: CLIUtilityInitializeCheckPathCurrentDirectory): CLIUtilityInitializeCheckPathReturns {
    const locations = await discoverPathsWithFile('package.json', 'backward');

    Logger.customize({ name: 'CLIUtilityInitialize.checkPath::detectedLocations' }).debug(locations);

    // If command was ran outside of project root directory.
    if (locations.length < 1) {
      Logger.customize({
        name: 'CLIUtilityInitialize.checkPath::lessThanOne',
        padBottom: 1,
      }).error([
        'No "package.json" files were found. Re-run this command inside the project root directory.',
        `Current directory is "${currentDirectory}"`,
      ].join('\n'));

      return false;
    }

    // If command was ran inside a monorepo package.
    if (locations.length > 1) {
      Logger.customize({
        name: 'CLIUtilityInitialize.checkPath::greaterThanOne',
        padBottom: 1,
      }).error([
        'Multiple "package.json" files were found. Re-run this command inside the project root directory.',
        `Current directory is "${currentDirectory}"`,
      ].join('\n'));

      return false;
    }

    // If command was ran outside the project root directory.
    if (locations.length === 1 && locations[0] !== currentDirectory) {
      Logger.customize({
        name: 'CLIUtilityInitialize.checkPath::notProjectRootDir',
        padBottom: 1,
      }).error([
        'Must be run inside the project root directory.',
        `Current directory is "${currentDirectory}"`,
      ].join('\n'));

      return false;
    }

    return true;
  }

  /**
   * CLI Utility - Initialize - Validate http url.
   *
   * @param {CLIUtilityInitializeValidateHttpUrlValue} value   - Value.
   * @param {CLIUtilityInitializeValidateHttpUrlField} [field] - Field.
   *
   * @private
   *
   * @returns {CLIUtilityInitializeValidateHttpUrlReturns}
   *
   * @since 1.0.0
   */
  private static validateHttpUrl(value: CLIUtilityInitializeValidateHttpUrlValue, field?: CLIUtilityInitializeValidateHttpUrlField): CLIUtilityInitializeValidateHttpUrlReturns {
    const trimmed = value.trim();

    if (trimmed === '') {
      return true;
    }

    if (CLIUtilityInitialize.isAllowedHttpUrl(trimmed, field)) {
      return true;
    }

    return 'Enter a valid URL (http:// or https://) or leave blank.';
  }

  /**
   * CLI Utility - Initialize - Validate fund sources.
   *
   * @param {CLIUtilityInitializeValidateFundSourcesValue} value - Value.
   *
   * @private
   *
   * @returns {CLIUtilityInitializeValidateFundSourcesReturns}
   *
   * @since 1.0.0
   */
  private static validateFundSources(value: CLIUtilityInitializeValidateFundSourcesValue): CLIUtilityInitializeValidateFundSourcesReturns {
    const trimmed = value.trim();

    if (trimmed === '') {
      return true;
    }

    const parts = trimmed
      .split(',')
      .map((part) => part.trim())
      .filter((part) => part !== '');

    for (const part of parts) {
      if (!CLIUtilityInitialize.isAllowedHttpUrl(part, 'generic')) {
        return 'Enter comma separated URLs (http:// or https://) or leave blank.';
      }
    }

    return true;
  }

  /**
   * CLI Utility - Initialize - Sanitize http url.
   *
   * @param {CLIUtilityInitializeSanitizeHttpUrlValue} value   - Value.
   * @param {CLIUtilityInitializeSanitizeHttpUrlField} [field] - Field.
   *
   * @private
   *
   * @returns {CLIUtilityInitializeSanitizeHttpUrlReturns}
   *
   * @since 1.0.0
   */
  private static sanitizeHttpUrl(value: CLIUtilityInitializeSanitizeHttpUrlValue, field?: CLIUtilityInitializeSanitizeHttpUrlField): CLIUtilityInitializeSanitizeHttpUrlReturns {
    if (typeof value !== 'string') {
      return undefined;
    }

    const trimmed = value.trim();

    if (trimmed === '') {
      return undefined;
    }

    try {
      const parsedUrl = new URL(trimmed);

      if (CLIUtilityInitialize.isAllowedHttpUrl(parsedUrl.toString(), field)) {
        return parsedUrl.toString();
      }
    } catch {
      /* empty */
    }

    return undefined;
  }

  /**
   * CLI Utility - Initialize - Is allowed http url.
   *
   * @param {CLIUtilityInitializeIsAllowedHttpUrlValue} value   - Value.
   * @param {CLIUtilityInitializeIsAllowedHttpUrlField} [field] - Field.
   *
   * @private
   *
   * @returns {CLIUtilityInitializeIsAllowedHttpUrlReturns}
   *
   * @since 1.0.0
   */
  private static isAllowedHttpUrl(value: CLIUtilityInitializeIsAllowedHttpUrlValue, field?: CLIUtilityInitializeIsAllowedHttpUrlField): CLIUtilityInitializeIsAllowedHttpUrlReturns {
    try {
      const url = new URL(value);

      const genericProtocols = ['http:', 'https:'];
      const repositoryProtocols = ['git:', 'git+https:', 'git+ssh:', 'git+http:', 'https:', 'http:'];
      const allowedProtocols = (field === 'repository') ? repositoryProtocols : genericProtocols;

      return allowedProtocols.includes(url.protocol);
    } catch {
      return false;
    }
  }
}
