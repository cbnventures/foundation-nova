import type {
  NovaConfig,
  NovaConfigEntities,
  NovaConfigEntityRole,
  NovaConfigProject,
  NovaConfigProjectDescription,
  NovaConfigProjectName,
  NovaConfigUrls,
  NovaConfigWorkspaceRole,
  NovaConfigWorkspaces,
} from '@/types/shared.d.ts';

/**
 * Nova Config - Config.
 *
 * @since 1.0.0
 */
export type NovaConfigConfig = NovaConfig;

/**
 * Nova Config - Get array of http urls.
 *
 * @since 1.0.0
 */
export type NovaConfigGetArrayOfHttpUrlsValue = unknown;

export type NovaConfigGetArrayOfHttpUrlsField = string;

export type NovaConfigGetArrayOfHttpUrlsReturns = string[] | undefined;

/**
 * Nova Config - Get array of non-empty strings.
 *
 * @since 1.0.0
 */
export type NovaConfigGetArrayOfNonEmptyStringsValue = unknown;

export type NovaConfigGetArrayOfNonEmptyStringsReturns = string[] | undefined;

/**
 * Nova Config - Get email.
 *
 * @since 1.0.0
 */
export type NovaConfigGetEmailValue = unknown;

export type NovaConfigGetEmailReturns = string | undefined;

/**
 * Nova Config - Get http url.
 *
 * @since 1.0.0
 */
export type NovaConfigGetHttpUrlValue = unknown;

export type NovaConfigGetHttpUrlField = string;

export type NovaConfigGetHttpUrlReturns = string | undefined;

/**
 * Nova Config - Get non-empty string.
 *
 * @since 1.0.0
 */
export type NovaConfigGetNonEmptyStringValue = unknown;

export type NovaConfigGetNonEmptyStringReturns = string | undefined;

/**
 * Nova Config - Is entity role.
 *
 * @since 1.0.0
 */
export type NovaConfigIsEntityRoleValue = unknown;

export type NovaConfigIsEntityRoleTypeGuard = NovaConfigEntityRole;

/**
 * Nova Config - Is plain object.
 *
 * @since 1.0.0
 */
export type NovaConfigIsPlainObjectValue = unknown;

export type NovaConfigIsPlainObjectTypeGuard = Record<string, unknown>;

/**
 * Nova Config - Load.
 *
 * @since 1.0.0
 */
export type NovaConfigLoadReturns = Promise<NovaConfigConfig>;

/**
 * Nova Config - Parse.
 *
 * @since 1.0.0
 */
export type NovaConfigParseValue = unknown;

export type NovaConfigParseReturns = NovaConfig;

export type NovaConfigParseResult = NovaConfig;

/**
 * Nova Config - Parse project.
 *
 * @since 1.0.0
 */
export type NovaConfigParseProjectValue = unknown;

export type NovaConfigParseProjectReturns = NovaConfigProject | undefined;

export type NovaConfigParseProjectProject = NovaConfigProject;

export type NovaConfigParseProjectName = NovaConfigProjectName;

export type NovaConfigParseProjectDescription = NovaConfigProjectDescription;

/**
 * Nova Config - Parse entities.
 *
 * @since 1.0.0
 */
export type NovaConfigParseEntitiesValue = unknown;

export type NovaConfigParseEntitiesReturns = NovaConfigEntities | undefined;

export type NovaConfigParseEntitiesParsedEntity = NovaConfigEntity;

/**
 * Nova Config - Parse urls.
 *
 * @since 1.0.0
 */
export type NovaConfigParseUrlsValue = unknown;

export type NovaConfigParseUrlsReturns = NovaConfigUrls | undefined;

export type NovaConfigParseUrlsUrls = NovaConfigUrls;

/**
 * Nova Config - Parse workspaces.
 *
 * @since 1.0.0
 */
export type NovaConfigParseWorkspacesValue = unknown;

export type NovaConfigParseWorkspacesSlug = string | undefined;

export type NovaConfigParseWorkspacesReturns = NovaConfigWorkspaces | undefined;

export type NovaConfigParseWorkspacesWorkspaces = NovaConfigWorkspaces;

export type NovaConfigParseWorkspacesAllowedRoles = NovaConfigWorkspaceRole[];

/**
 * Nova Config - Parse workspaces - Is name allowed.
 *
 * @since 1.0.0
 */
export type NovaConfigParseWorkspacesIsNameAllowedRole = NovaConfigWorkspaceRole;

export type NovaConfigParseWorkspacesIsNameAllowedName = string;

export type NovaConfigParseWorkspacesIsNameAllowedReturns = boolean;

/**
 * Nova Config - Save.
 *
 * @since 1.0.0
 */
export type NovaConfigSaveReturns = Promise<void>;

/**
 * Nova Config - Set.
 *
 * @since 1.0.0
 */
export type NovaConfigSetValue = NovaConfigConfig;

export type NovaConfigSetReturns = void;
