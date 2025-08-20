import type { IconifyIcon } from '@iconify/react';
import type React, { ReactNode } from 'react';

/**
 * Feature item.
 *
 * @since 1.0.0
 */
export type FeatureItemId = string;

export type FeatureItemTitle = string;

export type FeatureItemIcon = string | IconifyIcon;

export type FeatureItemDescription = ReactNode;

export type FeatureItem = {
  id: FeatureItemId;
  title: FeatureItemTitle;
  icon: FeatureItemIcon;
  description: FeatureItemDescription;
};

export type FeatureItems = FeatureItem[];

/**
 * Styles.
 *
 * @since 1.0.0
 */
export type Styles = {
  [key: string]: React.CSSProperties;
};
