import type { ItemPrettyNames, NovaConfigWorkspacePolicy } from '@/types/shared.d.ts';

/**
 * Item allowed policies by role.
 *
 * @since 1.0.0
 */
export type ItemAllowedPoliciesByRoleProject = Exclude<NovaConfigWorkspacePolicy, 'trackable' | 'distributable'>[];

export type ItemAllowedPoliciesByRoleConfig = Exclude<NovaConfigWorkspacePolicy, 'distributable'>[];

export type ItemAllowedPoliciesByRoleDocs = Exclude<NovaConfigWorkspacePolicy, 'distributable'>[];

export type ItemAllowedPoliciesByRoleApp = Exclude<NovaConfigWorkspacePolicy, 'freezable' | 'distributable'>[];

export type ItemAllowedPoliciesByRolePackage = Exclude<NovaConfigWorkspacePolicy, 'freezable'>[];

export type ItemAllowedPoliciesByRoleTool = Exclude<NovaConfigWorkspacePolicy, 'distributable'>[];

export type ItemAllowedPoliciesByRole = {
  project: ItemAllowedPoliciesByRoleProject;
  config: ItemAllowedPoliciesByRoleConfig;
  docs: ItemAllowedPoliciesByRoleDocs;
  app: ItemAllowedPoliciesByRoleApp;
  package: ItemAllowedPoliciesByRolePackage;
  tool: ItemAllowedPoliciesByRoleTool;
};

/**
 * Item brand pretty names.
 *
 * @since 1.0.0
 */
export type ItemBrandPrettyNames = ItemPrettyNames;

/**
 * Item category pretty names.
 *
 * @since 1.0.0
 */
export type ItemCategoryPrettyNames = ItemPrettyNames;

/**
 * Item column title pretty names.
 *
 * @since 1.0.0
 */
export type ItemColumnTitlePrettyNames = ItemPrettyNames;

/**
 * Item type pretty names.
 *
 * @since 1.0.0
 */
export type ItemTypePrettyNames = ItemPrettyNames;
