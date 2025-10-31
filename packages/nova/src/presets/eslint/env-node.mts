import nPlugin from 'eslint-plugin-n';

import type { FlatConfig } from '@/types/presets/eslint.d.ts';

/**
 * Config.
 *
 * @since 1.0.0
 */
const config: FlatConfig = [
  {
    name: 'nova/env-node',
    files: [
      '**/*.js',
      '**/*.ts',
      '**/*.jsx',
      '**/*.tsx',
      '**/*.cjs',
      '**/*.cts',
      '**/*.mjs',
      '**/*.mts',
    ],
    plugins: {
      n: nPlugin,
    },
    rules: {
      ...nPlugin.configs.recommended.rules,
    },
  },
  {
    name: 'nova/env-node/bad-habits',
    files: [
      '**/*.js',
      '**/*.ts',
      '**/*.jsx',
      '**/*.tsx',
      '**/*.cjs',
      '**/*.cts',
      '**/*.mjs',
      '**/*.mts',
    ],
    plugins: {
      n: nPlugin,
    },
    rules: {
      // Prevent raw console output; rely on the "Logger" toolkit battery instead.
      'no-console': ['error'],

      // Disallow "process.exit()" to enforce structured error handling.
      'no-process-exit': ['error'],

      // Warn on use of synchronous APIs (e.g., fs.readFileSync) since they block the event loop.
      'no-sync': ['warn'],
    },
  },
  {
    name: 'nova/env-node/cli-hashbang',
    files: [
      '**/src/bin/index.js',
      '**/src/bin/index.ts',
      '**/src/bin/index.cjs',
      '**/src/bin/index.cts',
      '**/src/bin/index.mjs',
      '**/src/bin/index.mts',
      '**/src/cli/index.js',
      '**/src/cli/index.ts',
      '**/src/cli/index.cjs',
      '**/src/cli/index.cts',
      '**/src/cli/index.mjs',
      '**/src/cli/index.mts',
    ],
    plugins: {
      n: nPlugin,
    },
    rules: {
      // Turn off shebang enforcement for source-level CLI files.
      'n/hashbang': ['off'],
    },
  },
];

export default config;
