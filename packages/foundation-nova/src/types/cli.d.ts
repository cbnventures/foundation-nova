import type { Command, CommandUnknownOpts } from '@commander-js/extra-typings';
import type { ChalkInstance } from 'chalk';
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
 * CLI - Execute command.
 *
 * @since 1.0.0
 */
export type CLIExecuteCommandOptions<Options> = {
  [OptionKey in keyof Options]?: true;
};

export type CLIExecuteCommandTarget = (options: CLIExecuteCommandOptions) => void | Promise<void>;

export type CLIExecuteCommandReturns = Promise<void>;

/**
 * CLI - Get header.
 *
 * @since 1.0.0
 */
export type CLIGetHeaderReturns = string;

/**
 * CLI - Get command usage.
 *
 * @since 1.0.0
 */
export type CLIGetCommandUsageCommand = CommandUnknownOpts;

export type CLIGetCommandUsageReturns = string;

/**
 * CLI - Get subcommand term.
 *
 * @since 1.0.0
 */
export type CLIGetSubcommandTermCommand = CommandUnknownOpts;

export type CLIGetSubcommandTermReturns = string;

/**
 * CLI - Program.
 *
 * @since 1.0.0
 */
export type CLIProgram = Command;

/**
 * CLI - Register commands.
 *
 * @since 1.0.0
 */
export type CLIRegisterCommandsReturns = void;

/**
 * CLI Initialize - Check path.
 *
 * @since 1.0.0
 */
export type CLIInitializeCheckPathCurrentDirectory = string;

export type CLIInitializeCheckPathReturns = Promise<boolean>;

/**
 * CLI Initialize - Is allowed http url.
 *
 * @since 1.0.0
 */
export type CLIInitializeIsAllowedHttpUrlValue = string;

export type CLIInitializeIsAllowedHttpUrlField = HttpUrlField;

export type CLIInitializeIsAllowedHttpUrlReturns = boolean;

/**
 * CLI Initialize - Prompt entities.
 *
 * @since 1.0.0
 */
export type CLIInitializePromptEntitiesConfig = NovaConfig;

export type CLIInitializePromptEntitiesReturns = Promise<DialogAction>;

export type CLIInitializePromptEntitiesMenuChoiceTitle = string;

export type CLIInitializePromptEntitiesMenuChoiceDescription = string;

export type CLIInitializePromptEntitiesMenuChoiceValue = EntityMenuAction;

export type CLIInitializePromptEntitiesMenuChoice = {
  title: CLIInitializePromptEntitiesMenuChoiceTitle;
  description?: CLIInitializePromptEntitiesMenuChoiceDescription;
  value: CLIInitializePromptEntitiesMenuChoiceValue;
};

export type CLIInitializePromptEntitiesMenuChoices = CLIInitializePromptEntitiesMenuChoice[];

export type CLIInitializePromptEntitiesDescriptionParts = string[];

export type CLIInitializePromptEntitiesNormalizedRoles = string[];

export type CLIInitializePromptEntitiesMenuPromptType = 'select';

export type CLIInitializePromptEntitiesMenuPromptName = 'action';

export type CLIInitializePromptEntitiesMenuPromptMessage = string;

export type CLIInitializePromptEntitiesMenuPromptChoices = CLIInitializePromptEntitiesMenuChoices;

export type CLIInitializePromptEntitiesMenuPrompt = {
  type: CLIInitializePromptEntitiesMenuPromptType;
  name: CLIInitializePromptEntitiesMenuPromptName;
  message: CLIInitializePromptEntitiesMenuPromptMessage;
  choices: CLIInitializePromptEntitiesMenuPromptChoices;
};

export type CLIInitializePromptEntitiesMenuResultAction = EntityMenuAction;

export type CLIInitializePromptEntitiesMenuResult = {
  action?: CLIInitializePromptEntitiesMenuResultAction;
};

/**
 * CLI Initialize - Prompt entities - Sync.
 *
 * @since 1.0.0
 */
export type CLIInitializePromptEntitiesSyncReturns = void;

/**
 * CLI Initialize - Prompt entities delete form.
 *
 * @since 1.0.0
 */
export type CLIInitializePromptEntitiesDeleteFormLabel = string;

export type CLIInitializePromptEntitiesDeleteFormReturns = Promise<boolean>;

export type CLIInitializePromptEntitiesDeleteFormPromptType = 'confirm';

export type CLIInitializePromptEntitiesDeleteFormPromptName = 'confirm';

export type CLIInitializePromptEntitiesDeleteFormPromptMessage = string;

export type CLIInitializePromptEntitiesDeleteFormPromptInitial = boolean;

export type CLIInitializePromptEntitiesDeleteFormPrompt = {
  type: CLIInitializePromptEntitiesDeleteFormPromptType;
  name: CLIInitializePromptEntitiesDeleteFormPromptName;
  message: CLIInitializePromptEntitiesDeleteFormPromptMessage;
  initial?: CLIInitializePromptEntitiesDeleteFormPromptInitial;
};

/**
 * CLI Initialize - Prompt entities form.
 *
 * @since 1.0.0
 */
export type CLIInitializePromptEntitiesFormEntity = NovaConfigEntity | undefined;

export type CLIInitializePromptEntitiesFormMode = 'create' | 'update';

export type CLIInitializePromptEntitiesFormReturnsApplyAction = 'apply';

export type CLIInitializePromptEntitiesFormReturnsApplyEntity = NovaConfigEntity;

export type CLIInitializePromptEntitiesFormReturnsApply = {
  action: CLIInitializePromptEntitiesFormReturnsApplyAction;
  entity: CLIInitializePromptEntitiesFormReturnsApplyEntity;
};

export type CLIInitializePromptEntitiesFormReturnsBackAction = Extract<DialogAction, 'back'>;

export type CLIInitializePromptEntitiesFormReturnsBack = {
  action: CLIInitializePromptEntitiesFormReturnsBackAction;
};

export type CLIInitializePromptEntitiesFormReturns = Promise<CLIInitializePromptEntitiesFormReturnsApply | CLIInitializePromptEntitiesFormReturnsBack>;

export type CLIInitializePromptEntitiesFormRoleValues = NovaConfigEntityRole[];

export type CLIInitializePromptEntitiesFormExistingRoles = NovaConfigEntityRole[];

export type CLIInitializePromptEntitiesFormQuestionTextType = 'text';

export type CLIInitializePromptEntitiesFormQuestionTextName = 'entityName' | 'entityEmail' | 'entityUrl';

export type CLIInitializePromptEntitiesFormQuestionTextMessage = string;

export type CLIInitializePromptEntitiesFormQuestionTextInitial = string;

export type CLIInitializePromptEntitiesFormQuestionTextValidate = (value: string) => boolean | string;

export type CLIInitializePromptEntitiesFormQuestionText = {
  type: CLIInitializePromptEntitiesFormQuestionTextType;
  name: CLIInitializePromptEntitiesFormQuestionTextName;
  message: CLIInitializePromptEntitiesFormQuestionTextMessage;
  initial?: CLIInitializePromptEntitiesFormQuestionTextInitial;
  validate?: CLIInitializePromptEntitiesFormQuestionTextValidate;
};

export type CLIInitializePromptEntitiesFormQuestionMultiSelectType = 'multiselect';

export type CLIInitializePromptEntitiesFormQuestionMultiSelectName = 'entityRoles';

export type CLIInitializePromptEntitiesFormQuestionMultiSelectMessage = string;

export type CLIInitializePromptEntitiesFormQuestionMultiSelectChoices = EntityRoleChoice[];

export type CLIInitializePromptEntitiesFormQuestionMultiSelectInitial = number[];

export type CLIInitializePromptEntitiesFormQuestionMultiSelect = {
  type: CLIInitializePromptEntitiesFormQuestionMultiSelectType;
  name: CLIInitializePromptEntitiesFormQuestionMultiSelectName;
  message: CLIInitializePromptEntitiesFormQuestionMultiSelectMessage;
  choices: CLIInitializePromptEntitiesFormQuestionMultiSelectChoices;
  initial?: CLIInitializePromptEntitiesFormQuestionMultiSelectInitial;
};

export type CLIInitializePromptEntitiesFormQuestion = CLIInitializePromptEntitiesFormQuestionText | CLIInitializePromptEntitiesFormQuestionMultiSelect;

export type CLIInitializePromptEntitiesFormQuestions = CLIInitializePromptEntitiesFormQuestion[];

export type CLIInitializePromptEntitiesFormRoleQuestion = CLIInitializePromptEntitiesFormQuestionMultiSelect;

export type CLIInitializePromptEntitiesFormQuestionsForPrompt = PromptObject<'entityName' | 'entityEmail' | 'entityUrl' | 'entityRoles'>;

export type CLIInitializePromptEntitiesFormQuestionsForPrompts = CLIInitializePromptEntitiesFormQuestionsForPrompt[];

export type CLIInitializePromptEntitiesFormAnswersEntityName = string;

export type CLIInitializePromptEntitiesFormAnswersEntityEmail = string;

export type CLIInitializePromptEntitiesFormAnswersEntityUrl = string;

export type CLIInitializePromptEntitiesFormAnswersEntityRoles = NovaConfigEntityRole[];

export type CLIInitializePromptEntitiesFormAnswers = {
  entityName?: CLIInitializePromptEntitiesFormAnswersEntityName;
  entityEmail?: CLIInitializePromptEntitiesFormAnswersEntityEmail;
  entityUrl?: CLIInitializePromptEntitiesFormAnswersEntityUrl;
  entityRoles?: CLIInitializePromptEntitiesFormAnswersEntityRoles;
};

export type CLIInitializePromptEntitiesFormResolvedEntity = NovaConfigEntity;

export type CLIInitializePromptEntitiesFormEntityRolesAnswer = NovaConfigEntityRole[];

/**
 * CLI Initialize - Prompt flow.
 *
 * @since 1.0.0
 */
export type CLIInitializePromptFlowConfig = NovaConfig;

export type CLIInitializePromptFlowReturns = Promise<Exclude<DialogAction, 'back'>>;

export type CLIInitializePromptFlowCategoryKeys = NovaConfigCategory[];

export type CLIInitializePromptFlowSelectChoiceTitle = string;

export type CLIInitializePromptFlowSelectChoiceDescription = string;

export type CLIInitializePromptFlowSelectChoiceValue = NovaConfigCategory | Exclude<DialogAction, 'back'>;

export type CLIInitializePromptFlowSelectChoice = {
  title: CLIInitializePromptFlowSelectChoiceTitle;
  description: CLIInitializePromptFlowSelectChoiceDescription;
  value: CLIInitializePromptFlowSelectChoiceValue;
};

export type CLIInitializePromptFlowSelectChoices = CLIInitializePromptFlowSelectChoice[];

export type CLIInitializePromptFlowSelectPromptType = 'select';

export type CLIInitializePromptFlowSelectPromptName = 'action';

export type CLIInitializePromptFlowSelectPromptMessage = string;

export type CLIInitializePromptFlowSelectPromptChoices = CLIInitializePromptFlowSelectChoices;

export type CLIInitializePromptFlowSelectPrompt = {
  type: CLIInitializePromptFlowSelectPromptType;
  name: CLIInitializePromptFlowSelectPromptName;
  message: CLIInitializePromptFlowSelectPromptMessage;
  choices: CLIInitializePromptFlowSelectPromptChoices;
};

export type CLIInitializePromptFlowSelectPromptResultAction = NovaConfigCategory | Exclude<DialogAction, 'back'>;

export type CLIInitializePromptFlowSelectPromptResult = {
  action?: CLIInitializePromptFlowSelectPromptResultAction;
};

/**
 * CLI Initialize - Prompt project.
 *
 * @since 1.0.0
 */
export type CLIInitializePromptProjectConfig = NovaConfig;

export type CLIInitializePromptProjectReturns = Promise<Extract<DialogAction, 'back'>>;

export type CLIInitializePromptProjectQuestionType = 'text';

export type CLIInitializePromptProjectQuestionName =
  'projectNameTitle'
  | 'projectNameSlug'
  | 'projectDescriptionShort'
  | 'projectDescriptionLong'
  | 'projectKeywords';

export type CLIInitializePromptProjectQuestionMessage = string;

export type CLIInitializePromptProjectQuestionInitial = string;

export type CLIInitializePromptProjectQuestionValidate = (value: string) => boolean | string;

export type CLIInitializePromptProjectQuestion = {
  type: CLIInitializePromptProjectQuestionType;
  name: CLIInitializePromptProjectQuestionName;
  message: CLIInitializePromptProjectQuestionMessage;
  initial?: CLIInitializePromptProjectQuestionInitial;
  validate?: CLIInitializePromptProjectQuestionValidate;
};

export type CLIInitializePromptProjectQuestions = CLIInitializePromptProjectQuestion[];

export type CLIInitializePromptProjectAnswers = Partial<Record<CLIInitializePromptProjectQuestionName, string>>;

/**
 * CLI Initialize - Prompt urls.
 *
 * @since 1.0.0
 */
export type CLIInitializePromptUrlsConfig = NovaConfig;

export type CLIInitializePromptUrlsReturns = Promise<Extract<DialogAction, 'back'>>;

export type CLIInitializePromptUrlsUrls = NovaConfigUrls;

export type CLIInitializePromptUrlsQuestionType = 'text';

export type CLIInitializePromptUrlsQuestionName =
  'urlsHomepage'
  | 'urlsRepository'
  | 'urlsBugs'
  | 'urlsLicense'
  | 'urlsLogo'
  | 'urlsDocumentation'
  | 'urlsGithub'
  | 'urlsNpm'
  | 'urlsFundSources';

export type CLIInitializePromptUrlsQuestionMessage = string;

export type CLIInitializePromptUrlsQuestionInitial = string;

export type CLIInitializePromptUrlsQuestionValidate = (value: string) => boolean | string;

export type CLIInitializePromptUrlsQuestion = {
  type: CLIInitializePromptUrlsQuestionType;
  name: CLIInitializePromptUrlsQuestionName;
  message: CLIInitializePromptUrlsQuestionMessage;
  initial?: CLIInitializePromptUrlsQuestionInitial;
  validate?: CLIInitializePromptUrlsQuestionValidate;
};

export type CLIInitializePromptUrlsQuestions = CLIInitializePromptUrlsQuestion[];

export type CLIInitializePromptUrlsNextUrls = NovaConfigUrls;

export type CLIInitializePromptUrlsAnswers = Partial<Record<CLIInitializePromptUrlsQuestionName, string>>;

export type CLIInitializePromptUrlsFundSourcesList = string[];

/**
 * CLI Initialize - Prompt urls - Assign.
 *
 * @since 1.0.0
 */
export type CLIInitializePromptUrlsAssignKey = Exclude<keyof NovaConfigUrls, 'fundSources'>;

export type CLIInitializePromptUrlsAssignInput = string | undefined;

export type CLIInitializePromptUrlsAssignReturns = void;

/**
 * CLI Initialize - Validate fund sources.
 *
 * @since 1.0.0
 */
export type CLIInitializeValidateFundSourcesValue = string;

export type CLIInitializeValidateFundSourcesReturns = true | string;

/**
 * CLI Initialize - Validate http url.
 *
 * @since 1.0.0
 */
export type CLIInitializeValidateHttpUrlValue = string;

export type CLIInitializeValidateHttpUrlField = HttpUrlField;

export type CLIInitializeValidateHttpUrlReturns = true | string;

/**
 * CLI Initialize - Sanitize http url.
 *
 * @since 1.0.0
 */
export type CLIInitializeSanitizeHttpUrlValue = string | undefined;

export type CLIInitializeSanitizeHttpUrlField = HttpUrlField;

export type CLIInitializeSanitizeHttpUrlReturns = string | undefined;

/**
 * CLI Initialize - Run.
 *
 * @since 1.0.0
 */
export type CLIInitializeRunOptions = {
  dryRun?: true;
};

export type CLIInitializeRunReturns = Promise<void>;

/**
 * CLI Inspect - Run.
 *
 * @since 1.0.0
 */
export type CLIInspectRunOptions = {
  eslint?: true;
  nova?: true;
  tsconfig?: true;
};

export type CLIInspectRunReturns = Promise<void>;

/**
 * CLI Version - Get browser version.
 *
 * @since 1.0.0
 */
export type CLIVersionGetBrowserVersionReturns = Promise<CLIVersionGetBrowserVersionBrowsers>;

export type CLIVersionGetBrowserVersionBrowsers = Record<string, string>;

/**
 * CLI Version - Get environment manager version.
 *
 * @since 1.0.0
 */
export type CLIVersionGetEnvironmentManagerVersionReturns = Promise<CLIVersionGetEnvironmentManagerVersionManagers>;

export type CLIVersionGetEnvironmentManagerVersionManagers = Record<string, string>;

/**
 * CLI Version - Get interpreter version.
 *
 * @since 1.0.0
 */
export type CLIVersionGetInterpreterVersionReturns = Promise<CLIVersionGetInterpreterVersionInterpreters>;

export type CLIVersionGetInterpreterVersionInterpreters = Record<string, string>;

/**
 * CLI Version - Get node version.
 *
 * @since 1.0.0
 */
export type CLIVersionGetNodeVersionReturns = Promise<CLIVersionGetNodeVersionTools>;

export type CLIVersionGetNodeVersionTools = Record<string, string>;

/**
 * CLI Version - Get os version.
 *
 * @since 1.0.0
 */
export type CLIVersionGetOsVersionReturnsName = CLIVersionGetOsVersionName;

export type CLIVersionGetOsVersionReturnsVersion = CLIVersionGetOsVersionVersion;

export type CLIVersionGetOsVersionReturnsArchitecture = CLIVersionGetOsVersionArchitecture;

export type CLIVersionGetOsVersionReturnsBuild = CLIVersionGetOsVersionBuild;

export type CLIVersionGetOsVersionReturnsKernel = CLIVersionGetOsVersionKernel;

export type CLIVersionGetOsVersionReturns = Promise<{
  name: CLIVersionGetOsVersionReturnsName;
  version: CLIVersionGetOsVersionReturnsVersion;
  architecture: CLIVersionGetOsVersionReturnsArchitecture;
  build: CLIVersionGetOsVersionReturnsBuild;
  kernel: CLIVersionGetOsVersionReturnsKernel;
}>;

export type CLIVersionGetOsVersionName = NodeJS.Platform | string;

export type CLIVersionGetOsVersionVersion = string;

export type CLIVersionGetOsVersionArchitecture = NodeJS.Architecture;

export type CLIVersionGetOsVersionBuild = string;

export type CLIVersionGetOsVersionKernel = string;

/**
 * CLI - Handle cli error.
 *
 * @since 1.0.0
 */
export type CLIHandleCLIErrorText = string;

export type CLIHandleCLIErrorReturns = void;

/**
 * CLI Version - Print.
 *
 * @since 1.0.0
 */
export type CLIVersionPrintList = Record<string, Record<string, string>>;

export type CLIVersionPrintReturns = void;

/**
 * CLI Version - Run.
 *
 * @since 1.0.0
 */
export type CLIVersionRunOptions = {
  all?: true;
  browser?: true;
  env?: true;
  interpreter?: true;
  node?: true;
  os?: true;
};

export type CLIVersionRunReturns = Promise<void>;

export type CLIVersionRunTasks = Promise<[keyof CLIVersionRunList, Record<string, string>]>[];

export type CLIVersionRunList = Record<string, Record<string, string>>;

/**
 * CLI - Style text.
 *
 * @since 1.0.0
 */
export type CLIStyleTextType = 'commands' | 'description' | 'subcommands' | 'title' | 'usage';

export type CLIStyleTextText = string;

export type CLIStyleTextReturns = string;

export type CLIStyleTextCategoryStyles = Record<CLIStyleTextType, ChalkInstance[]>;

export type CLIStyleTextTitleStyles = Record<string, ChalkInstance[]>;
