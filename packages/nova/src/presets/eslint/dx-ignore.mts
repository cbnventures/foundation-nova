import type { FlatConfig } from '@/types/presets/eslint.d.ts';

/**
 * Config.
 *
 * @since 1.0.0
 */
const config: FlatConfig = [
  {
    name: 'nova/dx-ignore/build-output',
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/out/**',
      '**/.output/**',
    ],
  },
  {
    name: 'nova/dx-ignore/generated',
    ignores: [
      '**/*.map',
      '**/generated/**',
      '**/__generated__/**',
    ],
  },
];

export default config;
