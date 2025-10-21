import chalk from 'chalk';
import prompts from 'prompts';

import { NovaConfig } from '@/lib/nova-config.js';
import { PATTERN_EMAIL_SIMPLE, PATTERN_SLUG_SIMPLE } from '@/lib/regex.js';
import { discoverPackageJsons } from '@/lib/utility.js';
import { Logger } from '@/toolkit/index.js';
import type {
  CLIInitializeCheckPathCurrentDirectory,
  CLIInitializeCheckPathReturns,
  CLIInitializeIsAllowedHttpUrlField,
  CLIInitializeIsAllowedHttpUrlReturns,
  CLIInitializeIsAllowedHttpUrlValue,
  CLIInitializePromptEntitiesConfig,
  CLIInitializePromptEntitiesDeleteFormLabel,
  CLIInitializePromptEntitiesDeleteFormPrompt,
  CLIInitializePromptEntitiesDeleteFormReturns,
  CLIInitializePromptEntitiesDescriptionParts,
  CLIInitializePromptEntitiesFormAnswers,
  CLIInitializePromptEntitiesFormEntity,
  CLIInitializePromptEntitiesFormEntityRolesAnswer,
  CLIInitializePromptEntitiesFormExistingRoles,
  CLIInitializePromptEntitiesFormMode,
  CLIInitializePromptEntitiesFormQuestions,
  CLIInitializePromptEntitiesFormQuestionsForPrompts,
  CLIInitializePromptEntitiesFormResolvedEntity,
  CLIInitializePromptEntitiesFormReturns,
  CLIInitializePromptEntitiesFormRoleQuestion,
  CLIInitializePromptEntitiesFormRoleValues,
  CLIInitializePromptEntitiesMenuChoices,
  CLIInitializePromptEntitiesMenuPrompt,
  CLIInitializePromptEntitiesMenuResult,
  CLIInitializePromptEntitiesNormalizedRoles,
  CLIInitializePromptEntitiesReturns,
  CLIInitializePromptEntitiesSyncReturns,
  CLIInitializePromptFlowCategoryKeys,
  CLIInitializePromptFlowConfig,
  CLIInitializePromptFlowReturns,
  CLIInitializePromptFlowSelectChoices,
  CLIInitializePromptFlowSelectPrompt,
  CLIInitializePromptFlowSelectPromptResult,
  CLIInitializePromptProjectAnswers,
  CLIInitializePromptProjectConfig,
  CLIInitializePromptProjectQuestions,
  CLIInitializePromptProjectReturns,
  CLIInitializePromptUrlsAnswers,
  CLIInitializePromptUrlsAssignInput,
  CLIInitializePromptUrlsAssignKey,
  CLIInitializePromptUrlsAssignReturns,
  CLIInitializePromptUrlsConfig,
  CLIInitializePromptUrlsFundSourcesList,
  CLIInitializePromptUrlsNextUrls,
  CLIInitializePromptUrlsQuestions,
  CLIInitializePromptUrlsReturns,
  CLIInitializePromptUrlsUrls,
  CLIInitializeRunOptions,
  CLIInitializeRunReturns,
  CLIInitializeSanitizeHttpUrlField,
  CLIInitializeSanitizeHttpUrlReturns,
  CLIInitializeSanitizeHttpUrlValue,
  CLIInitializeValidateFundSourcesReturns,
  CLIInitializeValidateFundSourcesValue,
  CLIInitializeValidateHttpUrlField,
  CLIInitializeValidateHttpUrlReturns,
  CLIInitializeValidateHttpUrlValue,
} from '@/types/cli.d.ts';

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
    const currentDirectory = process.cwd();
    const isProjectRoot = await CLIInitialize.checkPath(currentDirectory);

    if (!isProjectRoot) {
      process.exitCode = 1;

      return;
    }

    if (options.dryRun === true) {
      Logger.customize({
        name: 'CLIInitialize.run::options',
        padBottom: 1,
      }).warn('Dry run enabled. File changes will not be made in this session.');
    }

    const novaConfig = new NovaConfig();
    const workingFile = await novaConfig.load();
    const promptFlowResult = await CLIInitialize.promptFlow(workingFile);

    if (promptFlowResult === 'cancel') {
      Logger.customize({
        name: 'CLIInitialize.run::promptFlow',
        padTop: 1,
        padBottom: 1,
      }).debug('Prompt flow exited without saving.');

      return;
    }

    novaConfig.set(workingFile);

    if (options.dryRun === true) {
      Logger.customize({
        name: 'CLIInitialize.run::promptFlow',
        padTop: 1,
        padBottom: 1,
      }).debug('Dry run enabled. Skipping save operation.');

      return;
    }

    await novaConfig.save();
  }

  /**
   * CLI Initialize - Prompt flow.
   *
   * @param {CLIInitializePromptFlowConfig} config - Config.
   *
   * @private
   *
   * @returns {CLIInitializePromptFlowReturns}
   *
   * @since 1.0.0
   */
  private static async promptFlow(config: CLIInitializePromptFlowConfig): CLIInitializePromptFlowReturns {
    const categoryHandlers = {
      project: CLIInitialize.promptProject,
      entities: CLIInitialize.promptEntities,
      urls: CLIInitialize.promptUrls,
    };
    const categoryKeys: CLIInitializePromptFlowCategoryKeys = [
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
      const selectChoices: CLIInitializePromptFlowSelectChoices = categoryKeys.map((categoryKey) => ({
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

      const selectPrompt: CLIInitializePromptFlowSelectPrompt = {
        type: 'select',
        name: 'action',
        message: 'Select a Nova configuration category to edit.',
        choices: selectChoices,
      };

      let wasCancelled = false;

      const selectPromptResult: CLIInitializePromptFlowSelectPromptResult = await prompts(selectPrompt, {
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
   * CLI Initialize - Prompt project.
   *
   * @param {CLIInitializePromptProjectConfig} config - Config.
   *
   * @private
   *
   * @returns {CLIInitializePromptProjectReturns}
   *
   * @since 1.0.0
   */
  private static async promptProject(config: CLIInitializePromptProjectConfig): CLIInitializePromptProjectReturns {
    const existingProject = config.project;
    const existingProjectName = existingProject?.name;
    const existingProjectDescription = existingProject?.description;
    const existingProjectKeywords = existingProject?.keywords;

    const project = (existingProject !== undefined) ? { ...existingProject } : {};
    const projectName = (existingProjectName !== undefined) ? { ...existingProjectName } : {};
    const projectDescription = (existingProjectDescription !== undefined) ? { ...existingProjectDescription } : {};
    const projectQuestions: CLIInitializePromptProjectQuestions = [
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

    const answers = answersRaw as CLIInitializePromptProjectAnswers ?? {};

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
      name: 'CLIInitialize.promptProject::updated',
      padTop: 1,
      padBottom: 1,
    }).info('Project details updated.');

    return 'back';
  }

  /**
   * CLI Initialize - Prompt entities.
   *
   * @param {CLIInitializePromptEntitiesConfig} config - Config.
   *
   * @private
   *
   * @returns {CLIInitializePromptEntitiesReturns}
   *
   * @since 1.0.0
   */
  private static async promptEntities(config: CLIInitializePromptEntitiesConfig): CLIInitializePromptEntitiesReturns {
    const entities = (Array.isArray(config.entities)) ? config.entities.map((entity) => {
      const clonedEntity = { ...entity };

      if (Array.isArray(entity.roles) === true) {
        clonedEntity.roles = [...entity.roles];
      }

      return clonedEntity;
    }) : [];

    /**
     * CLI Initialize - Prompt entities - Sync.
     *
     * @returns {CLIInitializePromptEntitiesSyncReturns}
     *
     * @since 1.0.0
     */
    const sync = (): CLIInitializePromptEntitiesSyncReturns => {
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
      const menuChoices: CLIInitializePromptEntitiesMenuChoices = [];

      entities.forEach((entity, index) => {
        const entityName = (typeof entity.name === 'string') ? entity.name.trim() : '';
        const entityEmail = (typeof entity.email === 'string') ? entity.email.trim() : '';
        const entityRoles = (Array.isArray(entity.roles)) ? entity.roles.filter((role) => role.trim() !== '') : [];

        const label = entityName || entityEmail || `Entity ${index + 1}`;
        const descriptionParts: CLIInitializePromptEntitiesDescriptionParts = [];

        if (entityEmail !== '') {
          descriptionParts.push(entityEmail);
        }

        if (entityRoles.length > 0) {
          const normalizedRoles = entityRoles
            .map((entityRole) => entityRole.trim())
            .filter((entityRole) => entityRole.length > 0)
            .reduce<CLIInitializePromptEntitiesNormalizedRoles>((unique, entityRole) => {
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

      const menuPrompt: CLIInitializePromptEntitiesMenuPrompt = {
        type: 'select',
        name: 'action',
        message: (entities.length > 0) ? 'Select an entity to manage.' : 'No entities found. Choose an option.',
        choices: menuChoices,
      };

      let wasCancelled = false;

      const menuResult: CLIInitializePromptEntitiesMenuResult = await prompts(menuPrompt, {
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
        const result = await CLIInitialize.promptEntitiesForm(undefined, 'create');

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
          name: 'CLIInitialize.promptEntities::add',
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
        const entityResult = await CLIInitialize.promptEntitiesForm(entityToEdit, 'update');

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
          name: 'CLIInitialize.promptEntities::edit',
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
        const shouldRemove = await CLIInitialize.promptEntitiesDeleteForm(entityLabel);

        if (!shouldRemove) {
          continue;
        }

        entities.splice(entityIndex, 1);

        sync();

        Logger.customize({
          name: 'CLIInitialize.promptEntities::remove',
          padTop: 1,
          padBottom: 1,
        }).info('Removed entity.');
      }
    }
  }

  /**
   * CLI Initialize - Prompt entities form.
   *
   * @param {CLIInitializePromptEntitiesFormEntity} entity - Entity.
   * @param {CLIInitializePromptEntitiesFormMode}   mode   - Mode.
   *
   * @private
   *
   * @returns {CLIInitializePromptEntitiesFormReturns}
   *
   * @since 1.0.0
   */
  private static async promptEntitiesForm(entity: CLIInitializePromptEntitiesFormEntity, mode: CLIInitializePromptEntitiesFormMode): CLIInitializePromptEntitiesFormReturns {
    const roleValues = ['author', 'contributor', 'supporter'] as CLIInitializePromptEntitiesFormRoleValues;

    const existingName = (typeof entity?.name === 'string') ? entity.name : '';
    const existingEmail = (typeof entity?.email === 'string') ? entity.email : '';
    const existingUrl = (typeof entity?.url === 'string') ? entity.url : '';

    let existingRoles: CLIInitializePromptEntitiesFormExistingRoles = [];

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
    const questions: CLIInitializePromptEntitiesFormQuestions = [
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

          if (CLIInitialize.isAllowedHttpUrl(trimmed)) {
            return true;
          }

          return 'Enter a valid URL (http:// or https://) or leave blank.';
        },
      },
    ];
    const roleQuestion: CLIInitializePromptEntitiesFormRoleQuestion = {
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

    const questionsForPrompts = questions as CLIInitializePromptEntitiesFormQuestionsForPrompts;
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

    const answers = answersRaw as CLIInitializePromptEntitiesFormAnswers ?? {};
    const resolvedEntity: CLIInitializePromptEntitiesFormResolvedEntity = {};

    const entityNameInput = (typeof answers.entityName === 'string') ? answers.entityName.trim() : '';
    const entityEmailInput = (typeof answers.entityEmail === 'string') ? answers.entityEmail.trim() : '';
    const entityUrlInput = (typeof answers.entityUrl === 'string') ? answers.entityUrl.trim() : '';

    let entityRolesAnswer: CLIInitializePromptEntitiesFormEntityRolesAnswer = [];

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
   * CLI Initialize - Prompt entities delete form.
   *
   * @param {CLIInitializePromptEntitiesDeleteFormLabel} label - Label.
   *
   * @private
   *
   * @returns {CLIInitializePromptEntitiesDeleteFormReturns}
   *
   * @since 1.0.0
   */
  private static async promptEntitiesDeleteForm(label: CLIInitializePromptEntitiesDeleteFormLabel): CLIInitializePromptEntitiesDeleteFormReturns {
    const prompt: CLIInitializePromptEntitiesDeleteFormPrompt = {
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
   * CLI Initialize - Prompt urls.
   *
   * @param {CLIInitializePromptUrlsConfig} config - Config.
   *
   * @private
   *
   * @returns {CLIInitializePromptUrlsReturns}
   *
   * @since 1.0.0
   */
  private static async promptUrls(config: CLIInitializePromptUrlsConfig): CLIInitializePromptUrlsReturns {
    const existingUrls = config.urls;

    const urls: CLIInitializePromptUrlsUrls = (existingUrls !== undefined) ? { ...existingUrls } : {};

    const urlQuestions: CLIInitializePromptUrlsQuestions = [
      {
        type: 'text',
        name: 'urlsHomepage',
        message: 'Homepage URL',
        initial: urls.homepage ?? '',
        validate: (value) => CLIInitialize.validateHttpUrl(value),
      },
      {
        type: 'text',
        name: 'urlsRepository',
        message: 'Repository URL',
        initial: urls.repository ?? '',
        validate: (value) => CLIInitialize.validateHttpUrl(value, 'repository'),
      },
      {
        type: 'text',
        name: 'urlsBugs',
        message: 'Issue tracker URL',
        initial: urls.bugs ?? '',
        validate: (value) => CLIInitialize.validateHttpUrl(value),
      },
      {
        type: 'text',
        name: 'urlsLicense',
        message: 'License URL',
        initial: urls.license ?? '',
        validate: (value) => CLIInitialize.validateHttpUrl(value),
      },
      {
        type: 'text',
        name: 'urlsLogo',
        message: 'Logo URL',
        initial: urls.logo ?? '',
        validate: (value) => CLIInitialize.validateHttpUrl(value),
      },
      {
        type: 'text',
        name: 'urlsDocumentation',
        message: 'Documentation URL',
        initial: urls.documentation ?? '',
        validate: (value) => CLIInitialize.validateHttpUrl(value),
      },
      {
        type: 'text',
        name: 'urlsGithub',
        message: 'GitHub URL',
        initial: urls.github ?? '',
        validate: (value) => CLIInitialize.validateHttpUrl(value),
      },
      {
        type: 'text',
        name: 'urlsNpm',
        message: 'npm package URL',
        initial: urls.npm ?? '',
        validate: (value) => CLIInitialize.validateHttpUrl(value),
      },
      {
        type: 'text',
        name: 'urlsFundSources',
        message: 'Funding URLs (comma separated)',
        initial: (Array.isArray(urls.fundSources)) ? urls.fundSources.join(', ') : '',
        validate: CLIInitialize.validateFundSources,
      },
    ];
    const nextUrls: CLIInitializePromptUrlsNextUrls = {};

    /**
     * CLI Initialize - Prompt urls - Assign.
     *
     * @param {CLIInitializePromptUrlsAssignKey}   key   - Key.
     * @param {CLIInitializePromptUrlsAssignInput} input - Input.
     *
     * @returns {CLIInitializePromptUrlsAssignReturns}
     *
     * @since 1.0.0
     */
    const assign = (key: CLIInitializePromptUrlsAssignKey, input: CLIInitializePromptUrlsAssignInput): CLIInitializePromptUrlsAssignReturns => {
      const field = (key === 'repository') ? 'repository' : undefined;
      const normalized = CLIInitialize.sanitizeHttpUrl(input, field);

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

    const answers = urlAnswersRaw as CLIInitializePromptUrlsAnswers ?? {};

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
      const fundSourcesList: CLIInitializePromptUrlsFundSourcesList = [];

      for (const fundSourcesPart of fundSourcesParts) {
        const normalizedPart = CLIInitialize.sanitizeHttpUrl(fundSourcesPart, 'fundSources');

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
      name: 'CLIInitialize.promptUrls::updated',
      padTop: 1,
      padBottom: 1,
    }).info('URL references updated.');

    return 'back';
  }

  /**
   * CLI Initialize - Validate http url.
   *
   * @param {CLIInitializeValidateHttpUrlValue} value   - Value.
   * @param {CLIInitializeValidateHttpUrlField} [field] - Field.
   *
   * @private
   *
   * @returns {CLIInitializeValidateHttpUrlReturns}
   *
   * @since 1.0.0
   */
  private static validateHttpUrl(value: CLIInitializeValidateHttpUrlValue, field?: CLIInitializeValidateHttpUrlField): CLIInitializeValidateHttpUrlReturns {
    const trimmedValue = value.trim();

    if (trimmedValue === '') {
      return true;
    }

    if (CLIInitialize.isAllowedHttpUrl(trimmedValue, field)) {
      return true;
    }

    return 'Enter a valid URL (http:// or https://) or leave blank.';
  }

  /**
   * CLI Initialize - Validate fund sources.
   *
   * @param {CLIInitializeValidateFundSourcesValue} value - Value.
   *
   * @private
   *
   * @returns {CLIInitializeValidateFundSourcesReturns}
   *
   * @since 1.0.0
   */
  private static validateFundSources(value: CLIInitializeValidateFundSourcesValue): CLIInitializeValidateFundSourcesReturns {
    const trimmedValue = value.trim();

    if (trimmedValue === '') {
      return true;
    }

    const parts = trimmedValue.split(',')
      .map((part) => part.trim())
      .filter((part) => part !== '');

    for (const part of parts) {
      if (!CLIInitialize.isAllowedHttpUrl(part, 'fundSources')) {
        return 'Enter comma separated URLs (http:// or https://) or leave blank.';
      }
    }

    return true;
  }

  /**
   * CLI Initialize - Sanitize http url.
   *
   * @param {CLIInitializeSanitizeHttpUrlValue} value   - Value.
   * @param {CLIInitializeSanitizeHttpUrlField} [field] - Field.
   *
   * @private
   *
   * @returns {CLIInitializeSanitizeHttpUrlReturns}
   *
   * @since 1.0.0
   */
  private static sanitizeHttpUrl(value: CLIInitializeSanitizeHttpUrlValue, field?: CLIInitializeSanitizeHttpUrlField): CLIInitializeSanitizeHttpUrlReturns {
    if (typeof value !== 'string') {
      return undefined;
    }

    const trimmedValue = value.trim();

    if (trimmedValue === '') {
      return undefined;
    }

    try {
      const parsed = new URL(trimmedValue);

      if (CLIInitialize.isAllowedHttpUrl(parsed.toString(), field)) {
        return parsed.toString();
      }
    } catch {
      /* empty */
    }

    return undefined;
  }

  /**
   * CLI Initialize - Is allowed http url.
   *
   * @param {CLIInitializeIsAllowedHttpUrlValue} value   - Value.
   * @param {CLIInitializeIsAllowedHttpUrlField} [field] - Field.
   *
   * @private
   *
   * @returns {CLIInitializeIsAllowedHttpUrlReturns}
   *
   * @since 1.0.0
   */
  private static isAllowedHttpUrl(value: CLIInitializeIsAllowedHttpUrlValue, field?: CLIInitializeIsAllowedHttpUrlField): CLIInitializeIsAllowedHttpUrlReturns {
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
   * CLI Initialize - Check path.
   *
   * @param {CLIInitializeCheckPathCurrentDirectory} currentDirectory - Current directory.
   *
   * @private
   *
   * @returns {CLIInitializeCheckPathReturns}
   *
   * @since 1.0.0
   */
  private static async checkPath(currentDirectory: CLIInitializeCheckPathCurrentDirectory): CLIInitializeCheckPathReturns {
    const locations = await discoverPackageJsons();

    Logger.customize({ name: 'CLIInitialize.checkPath::detectedLocations' }).debug(locations);

    // If command was ran outside of project root directory.
    if (locations.length < 1) {
      Logger.customize({ name: 'CLIInitialize.checkPath::lessThanOne' }).error('No "package.json" files were found. Re-run this command inside the project root directory.');
      Logger.customize({
        name: 'CLIInitialize.checkPath::lessThanOne',
        padBottom: 1,
      }).error(`Current directory is "${currentDirectory}"`);

      return false;
    }

    // If command was ran inside a monorepo package.
    if (locations.length > 1) {
      Logger.customize({ name: 'CLIInitialize.checkPath::greaterThanOne' }).error('Multiple "package.json" files were found. Re-run this command inside the project root directory.');
      Logger.customize({
        name: 'CLIInitialize.checkPath::greaterThanOne',
        padBottom: 1,
      }).error(`Current directory is "${currentDirectory}"`);

      return false;
    }

    // If command was not ran inside project root directory.
    if (locations.length === 1 && locations[0] !== currentDirectory) {
      Logger.customize({ name: 'CLIInitialize.checkPath::notProjectRootDir' }).error('Must be run inside the project root directory.');
      Logger.customize({
        name: 'CLIInitialize.checkPath::notProjectRootDir',
        padBottom: 1,
      }).error(`Current directory is "${currentDirectory}"`);

      return false;
    }

    return true;
  }
}
