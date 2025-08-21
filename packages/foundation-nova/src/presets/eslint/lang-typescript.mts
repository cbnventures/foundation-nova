import tseslint from 'typescript-eslint';

import type { FlatConfig } from '@/types/index.d.ts';
import stylistic from '@stylistic/eslint-plugin';

/**
 * Config.
 *
 * @since 1.0.0
 */
const config: FlatConfig = [
  {
    name: 'foundation-nova/lang-typescript',
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        project: true,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {},
  },
  {
    name: 'foundation-nova/lang-typescript/type-declarations',
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        project: true,
      },
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      // Use semicolons on multiple-line TypeScript members but optional on single-line to keep the style tidy yet flexible.
      '@stylistic/member-delimiter-style': ['error', {
        'multiline': {
          'delimiter': 'semi',
          'requireLast': true,
        },
        'singleline': {
          'delimiter': 'semi',
          'requireLast': false,
        },
      }],
    },
  },
];

export default config;
