import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';
import type { NavbarItem, FooterLinkItem } from '@docusaurus/theme-common';

/**
 * Get category metadata.
 *
 * @since 1.0.0
 */
export type GetCategoryMetadataRouteBasePath = string;

export type GetCategoryMetadataCategoryId = string;

export type GetCategoryMetadataCategoryName = string;

export type GetCategoryMetadataCategoryPath = string;

export type GetCategoryMetadataCategoryPosition = number;

export type GetCategoryMetadataCategory = {
  id: GetCategoryMetadataCategoryId;
  name: GetCategoryMetadataCategoryName;
  path: GetCategoryMetadataCategoryPath;
  position: GetCategoryMetadataCategoryPosition;
};

export type GetCategoryMetadataCategories = GetCategoryMetadataCategory[];

export type GetCategoryMetadataReturns = Omit<GetCategoryMetadataCategory, 'position'>[];

/**
 * Get footer links.
 *
 * @since 1.0.0
 */
export type GetFooterLinksRouteBasePath = string;

export type GetFooterLinksReturns = FooterLinkItem[];

/**
 * Get nav bar items.
 *
 * @since 1.0.0
 */
export type GetNavBarItemsRouteBasePath = string;

export type GetNavBarItemsReturns = NavbarItem[];

/**
 * Get sidebars.
 *
 * @since 1.0.0
 */
export type GetSidebarsRouteBasePath = string;

export type GetSidebarsReturns = SidebarsConfig;
