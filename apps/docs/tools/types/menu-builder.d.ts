import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';
import type { NavbarItem, FooterLinkItem } from '@docusaurus/theme-common';

/**
 * Menu builder - Get category metadata.
 *
 * @since 1.0.0
 */
export type MenuBuilderGetCategoryMetadataRouteBasePath = string;

export type MenuBuilderGetCategoryMetadataCategoryId = string;

export type MenuBuilderGetCategoryMetadataCategoryName = string;

export type MenuBuilderGetCategoryMetadataCategoryPath = string;

export type MenuBuilderGetCategoryMetadataCategoryPosition = number;

export type MenuBuilderGetCategoryMetadataCategory = {
  id: MenuBuilderGetCategoryMetadataCategoryId;
  name: MenuBuilderGetCategoryMetadataCategoryName;
  path: MenuBuilderGetCategoryMetadataCategoryPath;
  position: MenuBuilderGetCategoryMetadataCategoryPosition;
};

export type MenuBuilderGetCategoryMetadataCategories = MenuBuilderGetCategoryMetadataCategory[];

export type MenuBuilderGetCategoryMetadataReturns = Omit<MenuBuilderGetCategoryMetadataCategory, 'position'>[];

/**
 * Menu builder - Get footer links.
 *
 * @since 1.0.0
 */
export type MenuBuilderGetFooterLinksRouteBasePath = string;

export type MenuBuilderGetFooterLinksReturns = FooterLinkItem[];

/**
 * Menu builder - Get nav bar items.
 *
 * @since 1.0.0
 */
export type MenuBuilderGetNavBarItemsRouteBasePath = string;

export type MenuBuilderGetNavBarItemsReturns = NavbarItem[];

/**
 * Menu builder - Get sidebars.
 *
 * @since 1.0.0
 */
export type MenuBuilderGetSidebarsRouteBasePath = string;

export type MenuBuilderGetSidebarsReturns = SidebarsConfig;
