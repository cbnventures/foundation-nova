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
export type EntityMenuActionAddKind = 'add';

export type EntityMenuActionAdd = {
  kind: EntityMenuActionAddKind;
};

export type EntityMenuActionEditKind = 'edit';

export type EntityMenuActionEditIndex = number;

export type EntityMenuActionEdit = {
  kind: EntityMenuActionEditKind;
  index: EntityMenuActionEditIndex;
};

export type EntityMenuActionRemoveKind = 'remove';

export type EntityMenuActionRemoveIndex = number;

export type EntityMenuActionRemove = {
  kind: EntityMenuActionRemoveKind;
  index: EntityMenuActionRemoveIndex;
};

export type EntityMenuActionBackKind = 'back';

export type EntityMenuActionBack = {
  kind: EntityMenuActionBackKind;
};

export type EntityMenuAction = EntityMenuActionAdd | EntityMenuActionEdit | EntityMenuActionRemove | EntityMenuActionBack;

/**
 * Http url field.
 *
 * @since 1.0.0
 */
export type HttpUrlField = 'repository' | 'generic';

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

export type NovaConfigWorkspaceName = string;

export type NovaConfigWorkspaceRole = 'project' | 'docs' | 'config' | 'app' | 'package' | 'tool';

export type NovaConfigWorkspacePolicy = 'freezable' | 'trackable' | 'distributable';

export type NovaConfigWorkspace = {
  name: NovaConfigWorkspaceName;
  role: NovaConfigWorkspaceRole;
  policy: NovaConfigWorkspacePolicy;
};

export type NovaConfigWorkspaces = {
  [key: string]: NovaConfigWorkspace;
};

export type NovaConfig = {
  project?: NovaConfigProject;
  entities?: NovaConfigEntities;
  urls?: NovaConfigUrls;
  workspaces?: NovaConfigWorkspaces;
};

/**
 * Nova config category.
 *
 * @since 1.0.0
 */
export type NovaConfigCategory = 'project' | 'entities' | 'urls' | 'workspaces';

/**
 * Text align.
 *
 * @since 1.0.0
 */
export type TextAlign = 'left' | 'center' | 'right';
