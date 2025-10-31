import type { PromptObject } from 'prompts';

import type {
  DialogAction,
  EntityMenuAction,
  HttpUrlField,
  NovaConfig,
  NovaConfigCategory,
  NovaConfigEntities,
  NovaConfigEntity,
  NovaConfigEntityRole,
  NovaConfigUrls,
  NovaConfigWorkspace,
  NovaConfigWorkspacePolicy,
  NovaConfigWorkspaceRole,
} from '@/types/shared.d.ts';

/**
 * CLI Utility - Initialize - Check path.
 *
 * @since 1.0.0
 */
export type CLIUtilityInitializeCheckPathCurrentDirectory = string;

export type CLIUtilityInitializeCheckPathReturns = Promise<boolean>;

/**
 * CLI Utility - Initialize - Is allowed http url.
 *
 * @since 1.0.0
 */
export type CLIUtilityInitializeIsAllowedHttpUrlValue = string;

export type CLIUtilityInitializeIsAllowedHttpUrlField = HttpUrlField;

export type CLIUtilityInitializeIsAllowedHttpUrlReturns = boolean;

/**
 * CLI Utility - Initialize - Prompt entities.
 *
 * @since 1.0.0
 */
export type CLIUtilityInitializePromptEntitiesConfig = NovaConfig;

export type CLIUtilityInitializePromptEntitiesReturns = Promise<Extract<DialogAction, 'back'>>;

export type CLIUtilityInitializePromptEntitiesEntities = NovaConfigEntities;

export type CLIUtilityInitializePromptEntitiesChoiceTitle = string;

export type CLIUtilityInitializePromptEntitiesChoiceDescription = string;

export type CLIUtilityInitializePromptEntitiesChoiceValue = EntityMenuAction;

export type CLIUtilityInitializePromptEntitiesChoice = {
  title: CLIUtilityInitializePromptEntitiesChoiceTitle;
  description: CLIUtilityInitializePromptEntitiesChoiceDescription;
  value: CLIUtilityInitializePromptEntitiesChoiceValue;
};

export type CLIUtilityInitializePromptEntitiesChoices = CLIUtilityInitializePromptEntitiesChoice[];

export type CLIUtilityInitializePromptEntitiesDescriptionParts = string[];

export type CLIUtilityInitializePromptEntitiesNormalizedRolesReduce = string[];

export type CLIUtilityInitializePromptEntitiesMenuOutputKeys = 'action';

export type CLIUtilityInitializePromptEntitiesMenuOutputResult = EntityMenuAction;

/**
 * CLI Utility - Initialize - Prompt entities - Sync.
 *
 * @since 1.0.0
 */
export type CLIUtilityInitializePromptEntitiesSyncReturns = void;

/**
 * CLI Utility - Initialize - Prompt entities delete form.
 *
 * @since 1.0.0
 */
export type CLIUtilityInitializePromptEntitiesDeleteFormLabel = string;

export type CLIUtilityInitializePromptEntitiesDeleteFormReturns = Promise<boolean>;

export type CLIUtilityInitializePromptEntitiesDeleteFormConfirmOutputKey = 'confirm';

export type CLIUtilityInitializePromptEntitiesDeleteFormConfirmOutputValue = boolean;

/**
 * CLI Utility - Initialize - Prompt entities form.
 *
 * @since 1.0.0
 */
export type CLIUtilityInitializePromptEntitiesFormEntity = NovaConfigEntity | undefined;

export type CLIUtilityInitializePromptEntitiesFormMode = 'create' | 'update';

export type CLIUtilityInitializePromptEntitiesFormReturnsApplyAction = 'apply';

export type CLIUtilityInitializePromptEntitiesFormReturnsApplyEntity = NovaConfigEntity;

export type CLIUtilityInitializePromptEntitiesFormReturnsApply = {
  action: CLIUtilityInitializePromptEntitiesFormReturnsApplyAction;
  entity: CLIUtilityInitializePromptEntitiesFormReturnsApplyEntity;
};

export type CLIUtilityInitializePromptEntitiesFormReturnsBackAction = Extract<DialogAction, 'back'>;

export type CLIUtilityInitializePromptEntitiesFormReturnsBack = {
  action: CLIUtilityInitializePromptEntitiesFormReturnsBackAction;
};

export type CLIUtilityInitializePromptEntitiesFormReturns = Promise<CLIUtilityInitializePromptEntitiesFormReturnsApply | CLIUtilityInitializePromptEntitiesFormReturnsBack>;

export type CLIUtilityInitializePromptEntitiesFormValidRoles = NovaConfigEntityRole[];

export type CLIUtilityInitializePromptEntitiesFormExistingRoles = NovaConfigEntityRole[];

export type CLIUtilityInitializePromptEntitiesFormQuestionsOutputKey = 'entityName' | 'entityEmail' | 'entityUrl' | 'entityRoles';

export type CLIUtilityInitializePromptEntitiesFormQuestionsOutputValue<Key extends CLIUtilityInitializePromptEntitiesFormOutputKey> = Key extends 'entityRoles' ? NovaConfigEntityRole[] : string;

export type CLIUtilityInitializePromptEntitiesFormResolvedEntity = NovaConfigEntity;

/**
 * CLI Utility - Initialize - Prompt flow.
 *
 * @since 1.0.0
 */
export type CLIUtilityInitializePromptFlowConfig = NovaConfig;

export type CLIUtilityInitializePromptFlowReturns = Promise<Exclude<DialogAction, 'back'>>;

export type CLIUtilityInitializePromptFlowCategoryTypeLabel = string;

export type CLIUtilityInitializePromptFlowCategoryTypeDescription = string;

export type CLIUtilityInitializePromptFlowCategoryTypeHandler = (config: NovaConfig) => Promise<Extract<DialogAction, 'back'>>;

export type CLIUtilityInitializePromptFlowCategoryType = {
  label: CLIUtilityInitializePromptFlowCategoryTypeLabel;
  description: CLIUtilityInitializePromptFlowCategoryTypeDescription;
  handler: CLIUtilityInitializePromptFlowCategoryTypeHandler;
};

export type CLIUtilityInitializePromptFlowCategory = Record<NovaConfigCategory, CLIUtilityInitializePromptFlowCategoryType>;

export type CLIUtilityInitializePromptFlowChoiceTitle = string;

export type CLIUtilityInitializePromptFlowChoiceDescription = string;

export type CLIUtilityInitializePromptFlowChoiceValue = NovaConfigCategory | Exclude<DialogAction, 'back'>;

export type CLIUtilityInitializePromptFlowChoice = {
  title: CLIUtilityInitializePromptFlowChoiceTitle;
  description: CLIUtilityInitializePromptFlowChoiceDescription;
  value: CLIUtilityInitializePromptFlowChoiceValue;
};

export type CLIUtilityInitializePromptFlowChoices = CLIUtilityInitializePromptFlowChoice[];

export type CLIUtilityInitializePromptFlowSelectMenuOutputKeys = 'action';

export type CLIUtilityInitializePromptFlowSelectMenuOutputResult = NovaConfigCategory | Exclude<DialogAction, 'back'>;

/**
 * CLI Utility - Initialize - Prompt project.
 *
 * @since 1.0.0
 */
export type CLIUtilityInitializePromptProjectConfig = NovaConfig;

export type CLIUtilityInitializePromptProjectReturns = Promise<Extract<DialogAction, 'back'>>;

export type CLIUtilityInitializePromptProjectQuestionsOutputKeys =
  'projectNameTitle'
  | 'projectNameSlug'
  | 'projectDescriptionShort'
  | 'projectDescriptionLong'
  | 'projectKeywords';

export type CLIUtilityInitializePromptProjectQuestionsOutputResult = string;

export type CLIUtilityInitializePromptProjectRolesToSync = NovaConfigWorkspaceRole[];

/**
 * CLI Utility - Initialize - Prompt urls.
 *
 * @since 1.0.0
 */
export type CLIUtilityInitializePromptUrlsConfig = NovaConfig;

export type CLIUtilityInitializePromptUrlsReturns = Promise<Extract<DialogAction, 'back'>>;

export type CLIUtilityInitializePromptUrlsValidatedUrls = NovaConfigUrls;

export type CLIUtilityInitializePromptUrlsQuestionsOutputKey =
  'urlsHomepage'
  | 'urlsRepository'
  | 'urlsBugs'
  | 'urlsLicense'
  | 'urlsLogo'
  | 'urlsDocumentation'
  | 'urlsGithub'
  | 'urlsNpm'
  | 'urlsFundSources';

export type CLIUtilityInitializePromptUrlsQuestionsOutputValue = string;

export type CLIUtilityInitializePromptUrlsFundSourcesList = string[];

/**
 * CLI Utility - Initialize - Prompt urls - Validate.
 *
 * @since 1.0.0
 */
export type CLIUtilityInitializePromptUrlsValidateKey = Exclude<keyof NovaConfigUrls, 'fundSources'>;

export type CLIUtilityInitializePromptUrlsValidateInput = string | undefined;

export type CLIUtilityInitializePromptUrlsValidateReturns = void;

/**
 * CLI Utility - Initialize - Prompt with cancel.
 *
 * @since 1.0.0
 */
export type CLIUtilityInitializePromptWithCancelQuestions<Keys> = PromptObject<Keys> | PromptObject<Keys>[];

export type CLIUtilityInitializePromptWithCancelReturnsResolvedResult<Keys, Result> = Record<Keys, Result>;

export type CLIUtilityInitializePromptWithCancelReturnsResolved<Keys, Result> = {
  cancelled: false;
  result: CLIUtilityInitializePromptWithCancelReturnsResolvedResult<Keys, Result>;
};

export type CLIUtilityInitializePromptWithCancelReturnsReject = {
  cancelled: true;
};

export type CLIUtilityInitializePromptWithCancelReturns<Keys, Result> = Promise<CLIUtilityInitializePromptWithCancelReturnsResolved<Keys, Result> | CLIUtilityInitializePromptWithCancelReturnsReject>;

/**
 * CLI Utility - Initialize - Prompt workspaces.
 *
 * @since 1.0.0
 */
export type CLIUtilityInitializePromptWorkspacesConfig = NovaConfig;

export type CLIUtilityInitializePromptWorkspacesReturns = Promise<Extract<DialogAction, 'back'>>;

export type CLIUtilityInitializePromptWorkspaces = NovaConfigWorkspaces;

export type CLIUtilityInitializePromptWorkspacesSummaryParts = string[];

export type CLIUtilityInitializePromptWorkspacesMenuOutputKey = 'workspacePath';

export type CLIUtilityInitializePromptWorkspacesMenuOutputValue = string;

/**
 * CLI Utility - Initialize - Prompt workspaces form.
 *
 * @since 1.0.0
 */
export type CLIUtilityInitializePromptWorkspacesFormOptionsWorkspacePath = string;

export type CLIUtilityInitializePromptWorkspacesFormOptionsExistingWorkspace = NovaConfigWorkspace;

export type CLIUtilityInitializePromptWorkspacesFormOptionsProjectSlug = string | undefined;

export type CLIUtilityInitializePromptWorkspacesFormOptions = {
  workspacePath: CLIUtilityInitializePromptWorkspacesFormOptionsWorkspacePath;
  existingWorkspace: CLIUtilityInitializePromptWorkspacesFormOptionsExistingWorkspace;
  projectSlug: CLIUtilityInitializePromptWorkspacesFormOptionsProjectSlug;
};

export type CLIUtilityInitializePromptWorkspacesFormReturnsApplyAction = 'apply';

export type CLIUtilityInitializePromptWorkspacesFormReturnsApplyWorkspace = NovaConfigWorkspace;

export type CLIUtilityInitializePromptWorkspacesFormReturnsApply = {
  action: CLIUtilityInitializePromptWorkspacesFormReturnsApplyAction;
  workspace: CLIUtilityInitializePromptWorkspacesFormReturnsApplyWorkspace;
};

export type CLIUtilityInitializePromptWorkspacesFormReturnsBackAction = Extract<DialogAction, 'back'>;

export type CLIUtilityInitializePromptWorkspacesFormReturnsBack = {
  action: CLIUtilityInitializePromptWorkspacesFormReturnsBackAction;
};

export type CLIUtilityInitializePromptWorkspacesFormReturns = Promise<CLIUtilityInitializePromptWorkspacesFormReturnsApply | CLIUtilityInitializePromptWorkspacesFormReturnsBack>;

export type CLIUtilityInitializePromptWorkspacesFormAllowedRoleTitle = string;

export type CLIUtilityInitializePromptWorkspacesFormAllowedRoleDescription = string;

export type CLIUtilityInitializePromptWorkspacesFormAllowedRoleValue = NovaConfigWorkspaceRole;

export type CLIUtilityInitializePromptWorkspacesFormAllowedRole = {
  title: CLIUtilityInitializePromptWorkspacesFormAllowedRoleTitle;
  description: CLIUtilityInitializePromptWorkspacesFormAllowedRoleDescription;
  value: CLIUtilityInitializePromptWorkspacesFormAllowedRoleValue;
};

export type CLIUtilityInitializePromptWorkspacesFormAllowedRoles = CLIUtilityInitializePromptWorkspacesFormAllowedRole[];

export type CLIUtilityInitializePromptWorkspacesFormPolicyTypeLabel = string;

export type CLIUtilityInitializePromptWorkspacesFormPolicyTypeDescription = string;

export type CLIUtilityInitializePromptWorkspacesFormPolicyType = {
  label: CLIUtilityInitializePromptWorkspacesFormPolicyTypeLabel;
  description: CLIUtilityInitializePromptWorkspacesFormPolicyTypeDescription;
};

export type CLIUtilityInitializePromptWorkspacesFormPolicy = Record<NovaConfigWorkspacePolicy, CLIUtilityInitializePromptWorkspacesFormPolicyType>;

export type CLIUtilityInitializePromptWorkspacesFormRolePromptKey = 'workspaceRole';

export type CLIUtilityInitializePromptWorkspacesFormRolePromptValue = NovaConfigWorkspaceRole;

export type CLIUtilityInitializePromptWorkspacesFormPolicyPromptKey = 'workspacePolicy';

export type CLIUtilityInitializePromptWorkspacesFormPolicyPromptValue = NovaConfigWorkspacePolicy;

/**
 * CLI Utility - Initialize - Prompt workspaces form - Resolve name.
 *
 * @since 1.0.0
 */
export type CLIUtilityInitializePromptWorkspacesFormResolveNameRole = NovaConfigWorkspaceRole;

export type CLIUtilityInitializePromptWorkspacesFormResolveNameReturns = Promise<string | undefined>;

/**
 * CLI Utility - Initialize - Validate fund sources.
 *
 * @since 1.0.0
 */
export type CLIUtilityInitializeValidateFundSourcesValue = string;

export type CLIUtilityInitializeValidateFundSourcesReturns = true | string;

/**
 * CLI Utility - Initialize - Validate http url.
 *
 * @since 1.0.0
 */
export type CLIUtilityInitializeValidateHttpUrlValue = string;

export type CLIUtilityInitializeValidateHttpUrlField = HttpUrlField;

export type CLIUtilityInitializeValidateHttpUrlReturns = true | string;

/**
 * CLI Utility - Initialize - Sanitize http url.
 *
 * @since 1.0.0
 */
export type CLIUtilityInitializeSanitizeHttpUrlValue = string | undefined;

export type CLIUtilityInitializeSanitizeHttpUrlField = HttpUrlField;

export type CLIUtilityInitializeSanitizeHttpUrlReturns = string | undefined;

/**
 * CLI Utility - Initialize - Run.
 *
 * @since 1.0.0
 */
export type CLIUtilityInitializeRunOptions = {
  dryRun?: true;
};

export type CLIUtilityInitializeRunReturns = Promise<void>;

/**
 * CLI Utility - Version - Get browser version.
 *
 * @since 1.0.0
 */
export type CLIUtilityVersionGetBrowserVersionReturns = Promise<CLIUtilityVersionGetBrowserVersionBrowsers>;

export type CLIUtilityVersionGetBrowserVersionBrowsers = Record<string, string>;

/**
 * CLI Utility - Version - Get environment manager version.
 *
 * @since 1.0.0
 */
export type CLIUtilityVersionGetEnvironmentManagerVersionReturns = Promise<CLIUtilityVersionGetEnvironmentManagerVersionManagers>;

export type CLIUtilityVersionGetEnvironmentManagerVersionManagers = Record<string, string>;

/**
 * CLI Utility - Version - Get interpreter version.
 *
 * @since 1.0.0
 */
export type CLIUtilityVersionGetInterpreterVersionReturns = Promise<CLIUtilityVersionGetInterpreterVersionInterpreters>;

export type CLIUtilityVersionGetInterpreterVersionInterpreters = Record<string, string>;

/**
 * CLI Utility - Version - Get node version.
 *
 * @since 1.0.0
 */
export type CLIUtilityVersionGetNodeVersionReturns = Promise<CLIUtilityVersionGetNodeVersionTools>;

export type CLIUtilityVersionGetNodeVersionTools = Record<string, string>;

/**
 * CLI Utility - Version - Get os version.
 *
 * @since 1.0.0
 */
export type CLIUtilityVersionGetOsVersionReturnsName = CLIUtilityVersionGetOsVersionName;

export type CLIUtilityVersionGetOsVersionReturnsVersion = CLIUtilityVersionGetOsVersionVersion;

export type CLIUtilityVersionGetOsVersionReturnsArchitecture = CLIUtilityVersionGetOsVersionArchitecture;

export type CLIUtilityVersionGetOsVersionReturnsBuild = CLIUtilityVersionGetOsVersionBuild;

export type CLIUtilityVersionGetOsVersionReturnsKernel = CLIUtilityVersionGetOsVersionKernel;

export type CLIUtilityVersionGetOsVersionReturns = Promise<{
  name: CLIUtilityVersionGetOsVersionReturnsName;
  version: CLIUtilityVersionGetOsVersionReturnsVersion;
  architecture: CLIUtilityVersionGetOsVersionReturnsArchitecture;
  build: CLIUtilityVersionGetOsVersionReturnsBuild;
  kernel: CLIUtilityVersionGetOsVersionReturnsKernel;
}>;

export type CLIUtilityVersionGetOsVersionName = NodeJS.Platform | string;

export type CLIUtilityVersionGetOsVersionVersion = string;

export type CLIUtilityVersionGetOsVersionArchitecture = NodeJS.Architecture;

export type CLIUtilityVersionGetOsVersionBuild = string;

export type CLIUtilityVersionGetOsVersionKernel = string;

/**
 * CLI Utility - Version - Print.
 *
 * @since 1.0.0
 */
export type CLIUtilityVersionPrintList = Record<string, Record<string, string>>;

export type CLIUtilityVersionPrintReturns = void;

/**
 * CLI Utility - Version - Run.
 *
 * @since 1.0.0
 */
export type CLIUtilityVersionRunOptions = {
  all?: true;
  browser?: true;
  env?: true;
  interpreter?: true;
  node?: true;
  os?: true;
};

export type CLIUtilityVersionRunReturns = Promise<void>;

export type CLIUtilityVersionRunTasks = Promise<[keyof CLIUtilityVersionRunList, Record<string, string>]>[];

export type CLIUtilityVersionRunList = Record<string, Record<string, string>>;
