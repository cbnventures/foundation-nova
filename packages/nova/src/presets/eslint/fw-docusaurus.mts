import type { FlatConfig } from '@/types/presets/eslint.d.ts';

/**
 * Config.
 *
 * @since 1.0.0
 */
const config: FlatConfig = [
  {
    name: 'nova/fw-docusaurus/ignored-files',
    ignores: [
      './.docusaurus/**',
    ],
  },
];

export default config;
