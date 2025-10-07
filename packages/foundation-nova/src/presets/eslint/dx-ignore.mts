import type { FlatConfig } from '@/types/index.d.ts';

/**
 * Config.
 *
 * @since 1.0.0
 */
const config: FlatConfig = [
  {
    name: 'foundation-nova/dx-ignore/build-output',
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/out/**',
      '**/.output/**',
    ],
  },
  {
    name: 'foundation-nova/dx-ignore/generated',
    ignores: [
      '**/*.map',
      '**/generated/**',
      '**/__generated__/**',
    ],
  },
];

export default config;
