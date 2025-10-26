import type { PromptObject } from 'prompts';

import type {
  DialogAction,
  EntityMenuAction,
  EntityRoleChoice,
  HttpUrlField,
  NovaConfig,
  NovaConfigCategory,
  NovaConfigEntity,
  NovaConfigEntityRole,
  NovaConfigUrls,
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

export type CLIUtilityInitializePromptEntitiesReturns = Promise<DialogAction>;

export type CLIUtilityInitializePromptEntitiesMenuChoiceTitle = string;

export type CLIUtilityInitializePromptEntitiesMenuChoiceDescription = string;

export type CLIUtilityInitializePromptEntitiesMenuChoiceValue = EntityMenuAction;

export type CLIUtilityInitializePromptEntitiesMenuChoice = {
  title: CLIUtilityInitializePromptEntitiesMenuChoiceTitle;
  description?: CLIUtilityInitializePromptEntitiesMenuChoiceDescription;
  value: CLIUtilityInitializePromptEntitiesMenuChoiceValue;
};

export type CLIUtilityInitializePromptEntitiesMenuChoices = CLIUtilityInitializePromptEntitiesMenuChoice[];

export type CLIUtilityInitializePromptEntitiesDescriptionParts = string[];

export type CLIUtilityInitializePromptEntitiesNormalizedRoles = string[];

export type CLIUtilityInitializePromptEntitiesMenuPromptType = 'select';

export type CLIUtilityInitializePromptEntitiesMenuPromptName = 'action';

export type CLIUtilityInitializePromptEntitiesMenuPromptMessage = string;

export type CLIUtilityInitializePromptEntitiesMenuPromptChoices = CLIUtilityInitializePromptEntitiesMenuChoices;

export type CLIUtilityInitializePromptEntitiesMenuPrompt = {
  type: CLIUtilityInitializePromptEntitiesMenuPromptType;
  name: CLIUtilityInitializePromptEntitiesMenuPromptName;
  message: CLIUtilityInitializePromptEntitiesMenuPromptMessage;
  choices: CLIUtilityInitializePromptEntitiesMenuPromptChoices;
};

export type CLIUtilityInitializePromptEntitiesMenuResultAction = EntityMenuAction;

export type CLIUtilityInitializePromptEntitiesMenuResult = {
  action?: CLIUtilityInitializePromptEntitiesMenuResultAction;
};

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

export type CLIUtilityInitializePromptEntitiesDeleteFormPromptType = 'confirm';

export type CLIUtilityInitializePromptEntitiesDeleteFormPromptName = 'confirm';

export type CLIUtilityInitializePromptEntitiesDeleteFormPromptMessage = string;

export type CLIUtilityInitializePromptEntitiesDeleteFormPromptInitial = boolean;

export type CLIUtilityInitializePromptEntitiesDeleteFormPrompt = {
  type: CLIUtilityInitializePromptEntitiesDeleteFormPromptType;
  name: CLIUtilityInitializePromptEntitiesDeleteFormPromptName;
  message: CLIUtilityInitializePromptEntitiesDeleteFormPromptMessage;
  initial?: CLIUtilityInitializePromptEntitiesDeleteFormPromptInitial;
};

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

export type CLIUtilityInitializePromptEntitiesFormRoleValues = NovaConfigEntityRole[];

export type CLIUtilityInitializePromptEntitiesFormExistingRoles = NovaConfigEntityRole[];

export type CLIUtilityInitializePromptEntitiesFormQuestionTextType = 'text';

export type CLIUtilityInitializePromptEntitiesFormQuestionTextName = 'entityName' | 'entityEmail' | 'entityUrl';

export type CLIUtilityInitializePromptEntitiesFormQuestionTextMessage = string;

export type CLIUtilityInitializePromptEntitiesFormQuestionTextInitial = string;

export type CLIUtilityInitializePromptEntitiesFormQuestionTextValidate = (value: string) => boolean | string;

export type CLIUtilityInitializePromptEntitiesFormQuestionText = {
  type: CLIUtilityInitializePromptEntitiesFormQuestionTextType;
  name: CLIUtilityInitializePromptEntitiesFormQuestionTextName;
  message: CLIUtilityInitializePromptEntitiesFormQuestionTextMessage;
  initial?: CLIUtilityInitializePromptEntitiesFormQuestionTextInitial;
  validate?: CLIUtilityInitializePromptEntitiesFormQuestionTextValidate;
};

export type CLIUtilityInitializePromptEntitiesFormQuestionMultiSelectType = 'multiselect';

export type CLIUtilityInitializePromptEntitiesFormQuestionMultiSelectName = 'entityRoles';

export type CLIUtilityInitializePromptEntitiesFormQuestionMultiSelectMessage = string;

export type CLIUtilityInitializePromptEntitiesFormQuestionMultiSelectChoices = EntityRoleChoice[];

export type CLIUtilityInitializePromptEntitiesFormQuestionMultiSelectInitial = number[];

export type CLIUtilityInitializePromptEntitiesFormQuestionMultiSelect = {
  type: CLIUtilityInitializePromptEntitiesFormQuestionMultiSelectType;
  name: CLIUtilityInitializePromptEntitiesFormQuestionMultiSelectName;
  message: CLIUtilityInitializePromptEntitiesFormQuestionMultiSelectMessage;
  choices: CLIUtilityInitializePromptEntitiesFormQuestionMultiSelectChoices;
  initial?: CLIUtilityInitializePromptEntitiesFormQuestionMultiSelectInitial;
};

export type CLIUtilityInitializePromptEntitiesFormQuestion = CLIUtilityInitializePromptEntitiesFormQuestionText | CLIUtilityInitializePromptEntitiesFormQuestionMultiSelect;

export type CLIUtilityInitializePromptEntitiesFormQuestions = CLIUtilityInitializePromptEntitiesFormQuestion[];

export type CLIUtilityInitializePromptEntitiesFormRoleQuestion = CLIUtilityInitializePromptEntitiesFormQuestionMultiSelect;

export type CLIUtilityInitializePromptEntitiesFormQuestionsForPrompt = PromptObject<'entityName' | 'entityEmail' | 'entityUrl' | 'entityRoles'>;

export type CLIUtilityInitializePromptEntitiesFormQuestionsForPrompts = CLIUtilityInitializePromptEntitiesFormQuestionsForPrompt[];

export type CLIUtilityInitializePromptEntitiesFormAnswersEntityName = string;

export type CLIUtilityInitializePromptEntitiesFormAnswersEntityEmail = string;

export type CLIUtilityInitializePromptEntitiesFormAnswersEntityUrl = string;

export type CLIUtilityInitializePromptEntitiesFormAnswersEntityRoles = NovaConfigEntityRole[];

export type CLIUtilityInitializePromptEntitiesFormAnswers = {
  entityName?: CLIUtilityInitializePromptEntitiesFormAnswersEntityName;
  entityEmail?: CLIUtilityInitializePromptEntitiesFormAnswersEntityEmail;
  entityUrl?: CLIUtilityInitializePromptEntitiesFormAnswersEntityUrl;
  entityRoles?: CLIUtilityInitializePromptEntitiesFormAnswersEntityRoles;
};

export type CLIUtilityInitializePromptEntitiesFormResolvedEntity = NovaConfigEntity;

export type CLIUtilityInitializePromptEntitiesFormEntityRolesAnswer = NovaConfigEntityRole[];

/**
 * CLI Utility - Initialize - Prompt flow.
 *
 * @since 1.0.0
 */
export type CLIUtilityInitializePromptFlowConfig = NovaConfig;

export type CLIUtilityInitializePromptFlowReturns = Promise<Exclude<DialogAction, 'back'>>;

export type CLIUtilityInitializePromptFlowCategoryKeys = NovaConfigCategory[];

export type CLIUtilityInitializePromptFlowSelectChoiceTitle = string;

export type CLIUtilityInitializePromptFlowSelectChoiceDescription = string;

export type CLIUtilityInitializePromptFlowSelectChoiceValue = NovaConfigCategory | Exclude<DialogAction, 'back'>;

export type CLIUtilityInitializePromptFlowSelectChoice = {
  title: CLIUtilityInitializePromptFlowSelectChoiceTitle;
  description: CLIUtilityInitializePromptFlowSelectChoiceDescription;
  value: CLIUtilityInitializePromptFlowSelectChoiceValue;
};

export type CLIUtilityInitializePromptFlowSelectChoices = CLIUtilityInitializePromptFlowSelectChoice[];

export type CLIUtilityInitializePromptFlowSelectPromptType = 'select';

export type CLIUtilityInitializePromptFlowSelectPromptName = 'action';

export type CLIUtilityInitializePromptFlowSelectPromptMessage = string;

export type CLIUtilityInitializePromptFlowSelectPromptChoices = CLIUtilityInitializePromptFlowSelectChoices;

export type CLIUtilityInitializePromptFlowSelectPrompt = {
  type: CLIUtilityInitializePromptFlowSelectPromptType;
  name: CLIUtilityInitializePromptFlowSelectPromptName;
  message: CLIUtilityInitializePromptFlowSelectPromptMessage;
  choices: CLIUtilityInitializePromptFlowSelectPromptChoices;
};

export type CLIUtilityInitializePromptFlowSelectPromptResultAction = NovaConfigCategory | Exclude<DialogAction, 'back'>;

export type CLIUtilityInitializePromptFlowSelectPromptResult = {
  action?: CLIUtilityInitializePromptFlowSelectPromptResultAction;
};

/**
 * CLI Utility - Initialize - Prompt project.
 *
 * @since 1.0.0
 */
export type CLIUtilityInitializePromptProjectConfig = NovaConfig;

export type CLIUtilityInitializePromptProjectReturns = Promise<Extract<DialogAction, 'back'>>;

export type CLIUtilityInitializePromptProjectQuestionType = 'text';

export type CLIUtilityInitializePromptProjectQuestionName =
  'projectNameTitle'
  | 'projectNameSlug'
  | 'projectDescriptionShort'
  | 'projectDescriptionLong'
  | 'projectKeywords';

export type CLIUtilityInitializePromptProjectQuestionMessage = string;

export type CLIUtilityInitializePromptProjectQuestionInitial = string;

export type CLIUtilityInitializePromptProjectQuestionValidate = (value: string) => boolean | string;

export type CLIUtilityInitializePromptProjectQuestion = {
  type: CLIUtilityInitializePromptProjectQuestionType;
  name: CLIUtilityInitializePromptProjectQuestionName;
  message: CLIUtilityInitializePromptProjectQuestionMessage;
  initial?: CLIUtilityInitializePromptProjectQuestionInitial;
  validate?: CLIUtilityInitializePromptProjectQuestionValidate;
};

export type CLIUtilityInitializePromptProjectQuestions = CLIUtilityInitializePromptProjectQuestion[];

export type CLIUtilityInitializePromptProjectAnswers = Partial<Record<CLIUtilityInitializePromptProjectQuestionName, string>>;

/**
 * CLI Utility - Initialize - Prompt urls.
 *
 * @since 1.0.0
 */
export type CLIUtilityInitializePromptUrlsConfig = NovaConfig;

export type CLIUtilityInitializePromptUrlsReturns = Promise<Extract<DialogAction, 'back'>>;

export type CLIUtilityInitializePromptUrlsUrls = NovaConfigUrls;

export type CLIUtilityInitializePromptUrlsQuestionType = 'text';

export type CLIUtilityInitializePromptUrlsQuestionName =
  'urlsHomepage'
  | 'urlsRepository'
  | 'urlsBugs'
  | 'urlsLicense'
  | 'urlsLogo'
  | 'urlsDocumentation'
  | 'urlsGithub'
  | 'urlsNpm'
  | 'urlsFundSources';

export type CLIUtilityInitializePromptUrlsQuestionMessage = string;

export type CLIUtilityInitializePromptUrlsQuestionInitial = string;

export type CLIUtilityInitializePromptUrlsQuestionValidate = (value: string) => boolean | string;

export type CLIUtilityInitializePromptUrlsQuestion = {
  type: CLIUtilityInitializePromptUrlsQuestionType;
  name: CLIUtilityInitializePromptUrlsQuestionName;
  message: CLIUtilityInitializePromptUrlsQuestionMessage;
  initial?: CLIUtilityInitializePromptUrlsQuestionInitial;
  validate?: CLIUtilityInitializePromptUrlsQuestionValidate;
};

export type CLIUtilityInitializePromptUrlsQuestions = CLIUtilityInitializePromptUrlsQuestion[];

export type CLIUtilityInitializePromptUrlsNextUrls = NovaConfigUrls;

export type CLIUtilityInitializePromptUrlsAnswers = Partial<Record<CLIUtilityInitializePromptUrlsQuestionName, string>>;

export type CLIUtilityInitializePromptUrlsFundSourcesList = string[];

/**
 * CLI Utility - Initialize - Prompt urls - Assign.
 *
 * @since 1.0.0
 */
export type CLIUtilityInitializePromptUrlsAssignKey = Exclude<keyof NovaConfigUrls, 'fundSources'>;

export type CLIUtilityInitializePromptUrlsAssignInput = string | undefined;

export type CLIUtilityInitializePromptUrlsAssignReturns = void;

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
