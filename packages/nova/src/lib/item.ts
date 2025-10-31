import type {
  ItemAllowedPoliciesByRole,
  ItemBrandPrettyNames,
  ItemCategoryPrettyNames,
  ItemColumnTitlePrettyNames,
  ItemTypePrettyNames,
} from '@/types/lib/item.d.ts';

/**
 * Item allowed policies by role.
 *
 * @since 1.0.0
 */
export const itemAllowedPoliciesByRole: ItemAllowedPoliciesByRole = {
  project: ['freezable'],
  config: ['freezable', 'trackable'],
  docs: ['freezable', 'trackable'],
  app: ['trackable'],
  package: ['trackable', 'distributable'],
  tool: ['freezable', 'trackable'],
};

/**
 * Item brand pretty names.
 *
 * @since 1.0.0
 */
export const itemBrandPrettyNames: ItemBrandPrettyNames = {
  'brave': 'Brave Browser',
  'bun': 'Bun',
  'chrome': 'Google Chrome',
  'edge': 'Microsoft Edge',
  'firefox': 'Mozilla Firefox',
  'java': 'Java',
  'libreWolf': 'Mozilla LibreWolf',
  'nodeJs': 'Node.js',
  'npm': 'Node Package Manager (npm)',
  'nvmPosix': 'Node Version Manager (nvm)',
  'nvmWindows': 'NVM for Windows',
  'opera': 'Opera',
  'pnpm': 'Performant Node Package Manager (pnpm)',
  'rust': 'Rust',
  'safari': 'Apple Safari',
  'vivaldi': 'Vivaldi',
  'volta': 'Volta',
  'yarn': 'Yarn',
};

/**
 * Item category pretty names.
 *
 * @since 1.0.0
 */
export const itemCategoryPrettyNames: ItemCategoryPrettyNames = {
  'browsers': 'Web Browsers',
  'env': 'Environment Managers',
  'interpreters': 'Interpreters / Runtimes',
  'node': 'Node.js + Tools',
  'os': 'Operating System',
};

/**
 * Item column title pretty names.
 *
 * @since 1.0.0
 */
export const itemColumnTitlePrettyNames: ItemColumnTitlePrettyNames = {
  'key-browsers': 'Browser',
  'key-env': 'Manager',
  'key-interpreters': 'Program',
  'key-node': 'Tool',
  'key-os': 'Type',
  'value-browsers': 'Version',
  'value-env': 'Version',
  'value-interpreters': 'Version',
  'value-node': 'Version',
  'value-os': 'Value',
};

/**
 * Item type pretty names.
 *
 * @since 1.0.0
 */
export const itemTypePrettyNames: ItemTypePrettyNames = {
  'architecture': 'OS Architecture',
  'build': 'OS Build',
  'kernel': 'OS Kernel',
  'name': 'OS Name',
  'version': 'OS Version',
};
