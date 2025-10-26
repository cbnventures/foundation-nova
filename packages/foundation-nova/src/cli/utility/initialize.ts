import chalk from 'chalk';
import prompts from 'prompts';

import { NovaConfig } from '@/lib/nova-config.js';
import { PATTERN_EMAIL_SIMPLE, PATTERN_SLUG_SIMPLE } from '@/lib/regex.js';
import { discoverPackageJsons } from '@/lib/utility.js';
import { Logger } from '@/toolkit/index.js';
import type {
  CLIUtilityInitializeCheckPathCurrentDirectory,
  CLIUtilityInitializeCheckPathReturns,
  CLIUtilityInitializeIsAllowedHttpUrlField,
  CLIUtilityInitializeIsAllowedHttpUrlReturns,
  CLIUtilityInitializeIsAllowedHttpUrlValue,
  CLIUtilityInitializePromptEntitiesConfig,
  CLIUtilityInitializePromptEntitiesDeleteFormLabel,
  CLIUtilityInitializePromptEntitiesDeleteFormPrompt,
  CLIUtilityInitializePromptEntitiesDeleteFormReturns,
  CLIUtilityInitializePromptEntitiesDescriptionParts,
  CLIUtilityInitializePromptEntitiesFormAnswers,
  CLIUtilityInitializePromptEntitiesFormEntity,
  CLIUtilityInitializePromptEntitiesFormEntityRolesAnswer,
  CLIUtilityInitializePromptEntitiesFormExistingRoles,
  CLIUtilityInitializePromptEntitiesFormMode,
  CLIUtilityInitializePromptEntitiesFormQuestions,
  CLIUtilityInitializePromptEntitiesFormQuestionsForPrompts,
  CLIUtilityInitializePromptEntitiesFormResolvedEntity,
  CLIUtilityInitializePromptEntitiesFormReturns,
  CLIUtilityInitializePromptEntitiesFormRoleQuestion,
  CLIUtilityInitializePromptEntitiesFormRoleValues,
  CLIUtilityInitializePromptEntitiesMenuChoices,
  CLIUtilityInitializePromptEntitiesMenuPrompt,
  CLIUtilityInitializePromptEntitiesMenuResult,
  CLIUtilityInitializePromptEntitiesNormalizedRoles,
  CLIUtilityInitializePromptEntitiesReturns,
  CLIUtilityInitializePromptEntitiesSyncReturns,
  CLIUtilityInitializePromptFlowCategoryKeys,
  CLIUtilityInitializePromptFlowConfig,
  CLIUtilityInitializePromptFlowReturns,
  CLIUtilityInitializePromptFlowSelectChoices,
  CLIUtilityInitializePromptFlowSelectPrompt,
  CLIUtilityInitializePromptFlowSelectPromptResult,
  CLIUtilityInitializePromptProjectAnswers,
  CLIUtilityInitializePromptProjectConfig,
  CLIUtilityInitializePromptProjectQuestions,
  CLIUtilityInitializePromptProjectReturns,
  CLIUtilityInitializePromptUrlsAnswers,
  CLIUtilityInitializePromptUrlsAssignInput,
  CLIUtilityInitializePromptUrlsAssignKey,
  CLIUtilityInitializePromptUrlsAssignReturns,
  CLIUtilityInitializePromptUrlsConfig,
  CLIUtilityInitializePromptUrlsFundSourcesList,
  CLIUtilityInitializePromptUrlsNextUrls,
  CLIUtilityInitializePromptUrlsQuestions,
  CLIUtilityInitializePromptUrlsReturns,
  CLIUtilityInitializePromptUrlsUrls,
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
} from '@/types/cli/cli-utility.d.ts';

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
    const categoryHandlers = {
      project: CLIUtilityInitialize.promptProject,
      entities: CLIUtilityInitialize.promptEntities,
      urls: CLIUtilityInitialize.promptUrls,
    };
    const categoryKeys: CLIUtilityInitializePromptFlowCategoryKeys = [
      'project',
      'entities',
      'urls',
    ];
    const categoryLabels = {
      project: 'Project',
      entities: 'Entities',
      urls: 'URLs',
    };
    const categoryDescriptions = {
      project: 'Configure project metadata (name, description, keywords).',
      entities: 'Manage entities, their roles, and contact information.',
      urls: 'Set URLs for docs, repo, support, and funding sources.',
    };

    while (true) {
      const selectChoices: CLIUtilityInitializePromptFlowSelectChoices = categoryKeys.map((categoryKey) => ({
        title: categoryLabels[categoryKey],
        description: categoryDescriptions[categoryKey],
        value: categoryKey,
      }));

      selectChoices.push({
        title: 'Save & Exit',
        description: 'Persist the "nova.config.json" file and exit.',
        value: 'save',
      });

      selectChoices.push({
        title: 'Cancel',
        description: 'Exit without persisting any changes.',
        value: 'cancel',
      });

      const selectPrompt: CLIUtilityInitializePromptFlowSelectPrompt = {
        type: 'select',
        name: 'action',
        message: 'Select a Nova configuration category to edit.',
        choices: selectChoices,
      };

      let wasCancelled = false;

      const selectPromptResult: CLIUtilityInitializePromptFlowSelectPromptResult = await prompts(selectPrompt, {
        onCancel: () => {
          wasCancelled = true;

          return false;
        },
      });

      if (
        wasCancelled
        || selectPromptResult.action === undefined
        || selectPromptResult.action === 'cancel'
      ) {
        return 'cancel';
      }

      if (selectPromptResult.action === 'save') {
        return 'save';
      }

      const categoryKey = selectPromptResult.action;
      const categoryHandler = categoryHandlers[categoryKey];
      const categoryAction = await categoryHandler(config);

      if (categoryAction === 'cancel') {
        return 'cancel';
      }

      if (categoryAction === 'save') {
        return 'save';
      }
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
    const projectQuestions: CLIUtilityInitializePromptProjectQuestions = [
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
    ];

    let wasCancelled = false;

    const answersRaw = await prompts(projectQuestions, {
      onCancel: () => {
        wasCancelled = true;

        return false;
      },
    });

    if (wasCancelled) {
      return 'back';
    }

    const answers = answersRaw as CLIUtilityInitializePromptProjectAnswers ?? {};

    const projectNameTitleInput = (answers.projectNameTitle ?? '').trim();
    const projectNameSlugInput = (answers.projectNameSlug ?? '').trim();
    const projectDescriptionShortInput = (answers.projectDescriptionShort ?? '').trim();
    const projectDescriptionLongInput = (answers.projectDescriptionLong ?? '').trim();
    const projectKeywordsInput = (answers.projectKeywords ?? '').trim();

    if (projectNameTitleInput === '') {
      Reflect.deleteProperty(projectName, 'title');
    } else {
      projectName.title = projectNameTitleInput;
    }

    if (projectNameSlugInput === '') {
      Reflect.deleteProperty(projectName, 'slug');
    } else {
      projectName.slug = projectNameSlugInput;
    }

    if (projectDescriptionShortInput === '') {
      Reflect.deleteProperty(projectDescription, 'short');
    } else {
      projectDescription.short = projectDescriptionShortInput;
    }

    if (projectDescriptionLongInput === '') {
      Reflect.deleteProperty(projectDescription, 'long');
    } else {
      projectDescription.long = projectDescriptionLongInput;
    }

    if (Object.keys(projectName).length > 0) {
      project.name = projectName;
    } else {
      Reflect.deleteProperty(project, 'name');
    }

    if (Object.keys(projectDescription).length > 0) {
      project.description = projectDescription;
    } else {
      Reflect.deleteProperty(project, 'description');
    }

    if (projectKeywordsInput === '') {
      Reflect.deleteProperty(project, 'keywords');
    } else {
      const projectKeywordsList = projectKeywordsInput.split(',')
        .map((projectKeywordInput) => projectKeywordInput.trim())
        .filter((projectKeywordInput) => projectKeywordInput !== '');

      if (projectKeywordsList.length > 0) {
        project.keywords = projectKeywordsList;
      } else {
        Reflect.deleteProperty(project, 'keywords');
      }
    }

    if (Object.keys(project).length > 0) {
      Object.assign(config, { project });
    } else {
      Reflect.deleteProperty(config, 'project');
    }

    Logger.customize({
      name: 'CLIUtilityInitialize.promptProject::updated',
      padTop: 1,
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
    const entities = (Array.isArray(config.entities)) ? config.entities.map((entity) => {
      const clonedEntity = { ...entity };

      if (Array.isArray(entity.roles) === true) {
        clonedEntity.roles = [...entity.roles];
      }

      return clonedEntity;
    }) : [];

    /**
     * CLI Utility - Initialize - Prompt entities - Sync.
     *
     * @returns {CLIUtilityInitializePromptEntitiesSyncReturns}
     *
     * @since 1.0.0
     */
    const sync = (): CLIUtilityInitializePromptEntitiesSyncReturns => {
      if (entities.length > 0) {
        const normalizedEntities = entities.map((entity) => {
          const normalizedEntity = { ...entity };

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
      const menuChoices: CLIUtilityInitializePromptEntitiesMenuChoices = [];

      entities.forEach((entity, index) => {
        const entityName = (typeof entity.name === 'string') ? entity.name.trim() : '';
        const entityEmail = (typeof entity.email === 'string') ? entity.email.trim() : '';
        const entityRoles = (Array.isArray(entity.roles)) ? entity.roles.filter((role) => role.trim() !== '') : [];

        const label = entityName || entityEmail || `Entity ${index + 1}`;
        const descriptionParts: CLIUtilityInitializePromptEntitiesDescriptionParts = [];

        if (entityEmail !== '') {
          descriptionParts.push(entityEmail);
        }

        if (entityRoles.length > 0) {
          const normalizedRoles = entityRoles
            .map((entityRole) => entityRole.trim())
            .filter((entityRole) => entityRole.length > 0)
            .reduce<CLIUtilityInitializePromptEntitiesNormalizedRoles>((unique, entityRole) => {
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

        menuChoices.push({
          title: `${chalk.yellow('[EDIT]')} ${label}`,
          description: (description !== '') ? description : 'Update this entity.',
          value: {
            kind: 'edit',
            index,
          },
        });

        menuChoices.push({
          title: `${chalk.red('[REMOVE]')} ${label}`,
          description: 'Delete this entity.',
          value: {
            kind: 'remove',
            index,
          },
        });
      });

      menuChoices.push({
        title: 'Add new entity',
        description: 'Create a new entity.',
        value: {
          kind: 'add',
        },
      });

      menuChoices.push({
        title: 'Back',
        description: 'Return to the category selection.',
        value: {
          kind: 'back',
        },
      });

      const menuPrompt: CLIUtilityInitializePromptEntitiesMenuPrompt = {
        type: 'select',
        name: 'action',
        message: (entities.length > 0) ? 'Select an entity to manage.' : 'No entities found. Choose an option.',
        choices: menuChoices,
      };

      let wasCancelled = false;

      const menuResult: CLIUtilityInitializePromptEntitiesMenuResult = await prompts(menuPrompt, {
        onCancel: () => {
          wasCancelled = true;

          return false;
        },
      });

      if (wasCancelled || menuResult.action === undefined) {
        return 'back';
      }

      if (menuResult.action.kind === 'back') {
        sync();

        return 'back';
      }

      if (menuResult.action.kind === 'add') {
        const result = await CLIUtilityInitialize.promptEntitiesForm(undefined, 'create');

        if (result.action === 'back') {
          continue;
        }

        const nextEntity = {
          ...result.entity,
        };

        if (Array.isArray(result.entity.roles)) {
          nextEntity.roles = [...result.entity.roles];
        } else {
          Reflect.deleteProperty(nextEntity, 'roles');
        }

        entities.push(nextEntity);

        sync();

        Logger.customize({
          name: 'CLIUtilityInitialize.promptEntities::add',
          padTop: 1,
          padBottom: 1,
        }).info('Added new entity.');

        continue;
      }

      if (menuResult.action.kind === 'edit') {
        const entityIndex = menuResult.action.index;

        if (entityIndex < 0 || entityIndex >= entities.length) {
          continue;
        }

        const entityToEdit = entities[entityIndex];
        const entityResult = await CLIUtilityInitialize.promptEntitiesForm(entityToEdit, 'update');

        if (entityResult.action === 'back') {
          continue;
        }

        const nextEntity = {
          ...entityResult.entity,
        };

        if (Array.isArray(entityResult.entity.roles)) {
          nextEntity.roles = [...entityResult.entity.roles];
        } else {
          Reflect.deleteProperty(nextEntity, 'roles');
        }

        entities[entityIndex] = nextEntity;

        sync();

        Logger.customize({
          name: 'CLIUtilityInitialize.promptEntities::edit',
          padTop: 1,
          padBottom: 1,
        }).info('Updated entity.');

        continue;
      }

      if (menuResult.action.kind === 'remove') {
        const entityIndex = menuResult.action.index;

        if (entityIndex < 0 || entityIndex >= entities.length) {
          continue;
        }

        const entityToRemove = entities[entityIndex];

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

        entities.splice(entityIndex, 1);

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
    const roleValues = ['author', 'contributor', 'supporter'] as CLIUtilityInitializePromptEntitiesFormRoleValues;

    const existingName = (typeof entity?.name === 'string') ? entity.name : '';
    const existingEmail = (typeof entity?.email === 'string') ? entity.email : '';
    const existingUrl = (typeof entity?.url === 'string') ? entity.url : '';

    let existingRoles: CLIUtilityInitializePromptEntitiesFormExistingRoles = [];

    if (Array.isArray(entity?.roles)) {
      existingRoles = entity.roles.filter((role) => roleValues.includes(role as typeof roleValues[number]));
    }

    const roleChoices = roleValues.map((role) => ({
      title: `${role.charAt(0).toUpperCase()}${role.slice(1)}`,
      value: role,
    }));
    const roleInitialSelection = roleChoices
      .map((choice, index) => (existingRoles.includes(choice.value)) ? index : -1)
      .filter((index) => index >= 0);
    const questions: CLIUtilityInitializePromptEntitiesFormQuestions = [
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
    ];
    const roleQuestion: CLIUtilityInitializePromptEntitiesFormRoleQuestion = {
      type: 'multiselect',
      name: 'entityRoles',
      message: 'Entity roles',
      choices: roleChoices,
    };

    if (roleInitialSelection.length > 0) {
      roleQuestion.initial = roleInitialSelection;
    }

    questions.push(roleQuestion);

    let wasCancelled = false;

    const questionsForPrompts = questions as CLIUtilityInitializePromptEntitiesFormQuestionsForPrompts;
    const answersRaw = await prompts(questionsForPrompts, {
      onCancel: () => {
        wasCancelled = true;

        return false;
      },
    });

    if (wasCancelled) {
      return {
        action: 'back',
      };
    }

    const answers = answersRaw as CLIUtilityInitializePromptEntitiesFormAnswers ?? {};
    const resolvedEntity: CLIUtilityInitializePromptEntitiesFormResolvedEntity = {};

    const entityNameInput = (typeof answers.entityName === 'string') ? answers.entityName.trim() : '';
    const entityEmailInput = (typeof answers.entityEmail === 'string') ? answers.entityEmail.trim() : '';
    const entityUrlInput = (typeof answers.entityUrl === 'string') ? answers.entityUrl.trim() : '';

    let entityRolesAnswer: CLIUtilityInitializePromptEntitiesFormEntityRolesAnswer = [];

    if (Array.isArray(answers.entityRoles)) {
      entityRolesAnswer = answers.entityRoles.filter((role) => roleValues.includes(role as typeof roleValues[number]));
    }

    if (entityNameInput !== '') {
      resolvedEntity.name = entityNameInput;
    }

    if (entityEmailInput !== '') {
      resolvedEntity.email = entityEmailInput;
    }

    if (entityUrlInput !== '') {
      resolvedEntity.url = entityUrlInput;
    }

    if (entityRolesAnswer.length > 0) {
      resolvedEntity.roles = entityRolesAnswer;
    }

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
    const prompt: CLIUtilityInitializePromptEntitiesDeleteFormPrompt = {
      type: 'confirm',
      name: 'confirm',
      message: `Remove entity "${label}"?`,
      initial: false,
    };

    let wasCancelled = false;

    const promptResult = await prompts(prompt, {
      onCancel: () => {
        wasCancelled = true;

        return false;
      },
    });

    if (wasCancelled) {
      return false;
    }

    return promptResult.confirm === true;
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

    const urls: CLIUtilityInitializePromptUrlsUrls = (existingUrls !== undefined) ? { ...existingUrls } : {};

    const urlQuestions: CLIUtilityInitializePromptUrlsQuestions = [
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
    ];
    const nextUrls: CLIUtilityInitializePromptUrlsNextUrls = {};

    /**
     * CLI Utility - Initialize - Prompt urls - Assign.
     *
     * @param {CLIUtilityInitializePromptUrlsAssignKey}   key   - Key.
     * @param {CLIUtilityInitializePromptUrlsAssignInput} input - Input.
     *
     * @returns {CLIUtilityInitializePromptUrlsAssignReturns}
     *
     * @since 1.0.0
     */
    const assign = (key: CLIUtilityInitializePromptUrlsAssignKey, input: CLIUtilityInitializePromptUrlsAssignInput): CLIUtilityInitializePromptUrlsAssignReturns => {
      const field = (key === 'repository') ? 'repository' : undefined;
      const normalized = CLIUtilityInitialize.sanitizeHttpUrl(input, field);

      if (normalized !== undefined) {
        nextUrls[key] = normalized;
      }
    };

    let wasCancelled = false;

    const urlAnswersRaw = await prompts(urlQuestions, {
      onCancel: () => {
        wasCancelled = true;

        return false;
      },
    });

    if (wasCancelled) {
      return 'back';
    }

    const answers = urlAnswersRaw as CLIUtilityInitializePromptUrlsAnswers ?? {};

    assign('homepage', answers.urlsHomepage);
    assign('repository', answers.urlsRepository);
    assign('bugs', answers.urlsBugs);
    assign('license', answers.urlsLicense);
    assign('logo', answers.urlsLogo);
    assign('documentation', answers.urlsDocumentation);
    assign('github', answers.urlsGithub);
    assign('npm', answers.urlsNpm);

    const fundSourcesInput = (typeof answers.urlsFundSources === 'string') ? answers.urlsFundSources : '';
    const fundSourcesParts = fundSourcesInput.split(',')
      .map((fundSourceInput) => fundSourceInput.trim())
      .filter((fundSourceInput) => fundSourceInput !== '');

    if (fundSourcesParts.length > 0) {
      const fundSourcesList: CLIUtilityInitializePromptUrlsFundSourcesList = [];

      for (const fundSourcesPart of fundSourcesParts) {
        const normalizedPart = CLIUtilityInitialize.sanitizeHttpUrl(fundSourcesPart, 'fundSources');

        if (normalizedPart !== undefined) {
          fundSourcesList.push(normalizedPart);
        }
      }

      if (fundSourcesList.length > 0) {
        nextUrls.fundSources = fundSourcesList;
      }
    }

    if (Object.keys(nextUrls).length > 0) {
      Object.assign(config, { urls: nextUrls });
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
    const trimmedValue = value.trim();

    if (trimmedValue === '') {
      return true;
    }

    if (CLIUtilityInitialize.isAllowedHttpUrl(trimmedValue, field)) {
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
    const trimmedValue = value.trim();

    if (trimmedValue === '') {
      return true;
    }

    const parts = trimmedValue.split(',')
      .map((part) => part.trim())
      .filter((part) => part !== '');

    for (const part of parts) {
      if (!CLIUtilityInitialize.isAllowedHttpUrl(part, 'fundSources')) {
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

    const trimmedValue = value.trim();

    if (trimmedValue === '') {
      return undefined;
    }

    try {
      const parsed = new URL(trimmedValue);

      if (CLIUtilityInitialize.isAllowedHttpUrl(parsed.toString(), field)) {
        return parsed.toString();
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
    const locations = await discoverPackageJsons();

    Logger.customize({ name: 'CLIUtilityInitialize.checkPath::detectedLocations' }).debug(locations);

    // If command was ran outside of project root directory.
    if (locations.length < 1) {
      Logger.customize({ name: 'CLIUtilityInitialize.checkPath::lessThanOne' }).error('No "package.json" files were found. Re-run this command inside the project root directory.');
      Logger.customize({
        name: 'CLIUtilityInitialize.checkPath::lessThanOne',
        padBottom: 1,
      }).error(`Current directory is "${currentDirectory}"`);

      return false;
    }

    // If command was ran inside a monorepo package.
    if (locations.length > 1) {
      Logger.customize({ name: 'CLIUtilityInitialize.checkPath::greaterThanOne' }).error('Multiple "package.json" files were found. Re-run this command inside the project root directory.');
      Logger.customize({
        name: 'CLIUtilityInitialize.checkPath::greaterThanOne',
        padBottom: 1,
      }).error(`Current directory is "${currentDirectory}"`);

      return false;
    }

    // If command was not ran inside project root directory.
    if (locations.length === 1 && locations[0] !== currentDirectory) {
      Logger.customize({ name: 'CLIUtilityInitialize.checkPath::notProjectRootDir' }).error('Must be run inside the project root directory.');
      Logger.customize({
        name: 'CLIUtilityInitialize.checkPath::notProjectRootDir',
        padBottom: 1,
      }).error(`Current directory is "${currentDirectory}"`);

      return false;
    }

    return true;
  }
}
