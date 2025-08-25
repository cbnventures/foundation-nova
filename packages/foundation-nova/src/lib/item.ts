import type {
  ItemBrandPrettyNames,
  ItemCategoryPrettyNames,
  ItemColumnTitlePrettyNames,
  ItemTypePrettyNames,
} from '@/types/item.js';

/**
 * Item brand pretty names.
 *
 * @since 1.0.0
 */
export const itemBrandPrettyNames: ItemBrandPrettyNames = {
  'brave': 'Brave Browser',
  'chrome': 'Google Chrome',
  'edge': 'Microsoft Edge',
  'firefox': 'Mozilla Firefox',
  'libreWolf': 'Mozilla LibreWolf',
  'nodeJs': 'Node.js',
  'npm': 'npm',
  'opera': 'Opera',
  'orion': 'Orion',
  'safari': 'Apple Safari',
  'vivaldi': 'Vivaldi',
};

/**
 * Item category pretty names.
 *
 * @since 1.0.0
 */
export const itemCategoryPrettyNames: ItemCategoryPrettyNames = {
  'browsers': 'Web Browsers',
  'node': 'Node.js Environment',
  'os': 'Operating System',
};

/**
 * Item column title pretty names.
 *
 * @since 1.0.0
 */
export const itemColumnTitlePrettyNames: ItemColumnTitlePrettyNames = {
  'key-browsers': 'Browser',
  'key-node': 'Tool',
  'key-os': 'Type',
  'value-browsers': 'Version',
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
