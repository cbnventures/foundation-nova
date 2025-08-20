import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

import { getSidebars } from './lib/menu-builder';

/**
 * Sidebars.
 *
 * @since 1.0.0
 */
const sidebars: SidebarsConfig = {
  ...getSidebars('docs'),
};

export default sidebars;
