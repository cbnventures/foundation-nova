/**
 * Border style.
 *
 * @since 1.0.0
 */
export type BorderStyle = 'box' | 'round' | 'thick';

/**
 * Dialog action.
 *
 * @since 1.0.0
 */
export type DialogAction = 'save' | 'cancel' | 'back';

/**
 * Entity menu action.
 *
 * @since 1.0.0
 */
export type EntityMenuActionKind = 'add' | 'edit' | 'remove' | 'back';

export type EntityMenuActionIndex = number;

export type EntityMenuActionAdd = {
  kind: Extract<EntityMenuActionKind, 'add'>;
};

export type EntityMenuActionEdit = {
  kind: Extract<EntityMenuActionKind, 'edit'>;
  index: EntityMenuActionIndex;
};

export type EntityMenuActionRemove = {
  kind: Extract<EntityMenuActionKind, 'remove'>;
  index: EntityMenuActionIndex;
};

export type EntityMenuActionBack = {
  kind: Extract<EntityMenuActionKind, 'back'>;
};

export type EntityMenuAction = EntityMenuActionAdd | EntityMenuActionEdit | EntityMenuActionRemove | EntityMenuActionBack;

/**
 * Entity role choice.
 *
 * @since 1.0.0
 */
export type EntityRoleChoiceTitle = string;

export type EntityRoleChoiceValue = NovaConfigEntityRole;

export type EntityRoleChoice = {
  title: EntityRoleChoiceTitle;
  value: EntityRoleChoiceValue;
};

/**
 * Http url field.
 *
 * @since 1.0.0
 */
export type HttpUrlField = 'repository' | 'fundSources';

/**
 * Item pretty names.
 *
 * @since 1.0.0
 */
export type ItemPrettyNames = Record<string, string>;

/**
 * Log level.
 *
 * @since 1.0.0
 */
export type LogLevel =
  'debug'
  | 'info'
  | 'warn'
  | 'error';

/**
 * Log options.
 *
 * @since 1.0.0
 */
export type LogOptionsName = string;

export type LogOptionsPadTop = number;

export type LogOptionsPadBottom = number;

export type LogOptions = {
  name?: LogOptionsName;
  padTop?: LogOptionsPadTop;
  padBottom?: LogOptionsPadBottom;
};

/**
 * Nova config.
 *
 * @since 1.0.0
 */
export type NovaConfigProjectNameSlug = string;

export type NovaConfigProjectNameTitle = string;

export type NovaConfigProjectName = {
  slug?: NovaConfigProjectNameSlug;
  title?: NovaConfigProjectNameTitle;
};

export type NovaConfigProjectDescriptionShort = string;

export type NovaConfigProjectDescriptionLong = string;

export type NovaConfigProjectDescription = {
  short?: NovaConfigProjectDescriptionShort;
  long?: NovaConfigProjectDescriptionLong;
};

export type NovaConfigProjectKeyword = string;

export type NovaConfigProjectKeywords = NovaConfigProjectKeyword[];

export type NovaConfigProject = {
  name?: NovaConfigProjectName;
  description?: NovaConfigProjectDescription;
  keywords?: NovaConfigProjectKeywords;
};

export type NovaConfigEntityName = string;

export type NovaConfigEntityEmail = string;

export type NovaConfigEntityUrl = string;

export type NovaConfigEntityRole = 'author' | 'contributor' | 'supporter';

export type NovaConfigEntityRoles = NovaConfigEntityRole[];

export type NovaConfigEntity = {
  name?: NovaConfigEntityName;
  email?: NovaConfigEntityEmail;
  url?: NovaConfigEntityUrl;
  roles?: NovaConfigEntityRoles;
};

export type NovaConfigEntities = NovaConfigEntity[];

export type NovaConfigUrlsHomepage = string;

export type NovaConfigUrlsRepository = string;

export type NovaConfigUrlsBugs = string;

export type NovaConfigUrlsLicense = string;

export type NovaConfigUrlsLogo = string;

export type NovaConfigUrlsDocumentation = string;

export type NovaConfigUrlsGitHub = string;

export type NovaConfigUrlsNpm = string;

export type NovaConfigUrlsFundSource = string;

export type NovaConfigUrlsFundSources = NovaConfigUrlsFundSource[];

export type NovaConfigUrls = {
  homepage?: NovaConfigUrlsHomepage;
  repository?: NovaConfigUrlsRepository;
  bugs?: NovaConfigUrlsBugs;
  license?: NovaConfigUrlsLicense;
  logo?: NovaConfigUrlsLogo;
  documentation?: NovaConfigUrlsDocumentation;
  github?: NovaConfigUrlsGitHub;
  npm?: NovaConfigUrlsNpm;
  fundSources?: NovaConfigUrlsFundSources;
};

export type NovaConfig = {
  project?: NovaConfigProject;
  entities?: NovaConfigEntities;
  urls?: NovaConfigUrls;
};

/**
 * Nova config category.
 *
 * @since 1.0.0
 */
export type NovaConfigCategory = 'project' | 'entities' | 'urls';

/**
 * Text align.
 *
 * @since 1.0.0
 */
export type TextAlign = 'left' | 'center' | 'right';
