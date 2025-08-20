import type { FlatConfig } from '@/types/index.d.ts';

/**
 * Config.
 *
 * @since 1.0.0
 */
const config: FlatConfig = [
  {
    name: 'foundation/fw-docusaurus/ignored-files',
    ignores: [
      './.docusaurus/**',
    ],
  },
];

export default config;
