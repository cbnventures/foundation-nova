import stylisticPlugin from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

import type { FlatConfig } from '@/types/presets/eslint.d.ts';

/**
 * Config.
 *
 * @since 1.0.0
 */
const config: FlatConfig = [
  {
    name: 'nova/lang-typescript',
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
    rules: {
      ...tseslint.configs.eslintRecommended.rules,
    },
  },
  {
    name: 'nova/lang-typescript/classes',
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
    rules: {
      // Require explicit accessibility modifiers on all class members to improve clarity.
      '@typescript-eslint/explicit-member-accessibility': ['error', {
        accessibility: 'explicit',
      }],
    },
  },
  {
    name: 'nova/lang-typescript/type-declarations',
    files: [
      '**/*.d.ts',
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
      '@stylistic': stylisticPlugin,
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

      // Enforce line breaks before operators, except for '=' which should be placed directly after the type name.
      '@stylistic/operator-linebreak': ['error', 'before', {
        overrides: {
          '=': 'after',
        },
      }],
    },
  },
];

export default config;
