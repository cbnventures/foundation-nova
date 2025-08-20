import stylistic from '@stylistic/eslint-plugin';

import type { FlatConfig } from '@/types/index.d.ts';

/**
 * Config.
 *
 * @since 1.0.0
 */
const config: FlatConfig = [
  {
    name: 'foundation/dx-code-style',
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
      '@stylistic': stylistic,
    },
    rules: {
      ...stylistic.configs.recommended.rules,
    },
  },
  {
    name: 'foundation/dx-code-style/arrows',
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
      '@stylistic': stylistic,
    },
    rules: {
      // Always wrap arrow function parameters in parentheses so "if (a => b)" isn't mistaken for a comparison.
      '@stylistic/arrow-parens': ['error', 'always'],
    },
  },
  {
    name: 'foundation/dx-code-style/braces-commas-semicolons',
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
      '@stylistic': stylistic,
    },
    rules: {
      // Always use 1tbs (one true brace style) so opening and closing braces stay consistent across code.
      '@stylistic/brace-style': ['error', '1tbs', {
        'allowSingleLine': false,
      }],

      // Require trailing commas in multiline code so adding lines doesn't break diffs or need editing nearby.
      '@stylistic/comma-dangle': ['error', 'always-multiline'],

      // Always use semicolons so code doesn't break unexpectedly from missing line ends.
      '@stylistic/semi': ['error', 'always'],
    },
  },
  {
    name: 'foundation/dx-code-style/objects-newlines',
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
      '@stylistic': stylistic,
    },
    rules: {
      // Force line breaks inside braces when there are multiple items or inner line breaks so the structure stays uniform.
      '@stylistic/object-curly-newline': ['error', {
        ObjectExpression: {
          minProperties: 1,
          multiline: true,
          consistent: true,
        },
        ObjectPattern: {
          minProperties: 2,
          multiline: true,
          consistent: true,
        },
        ImportDeclaration: {
          minProperties: 4,
          multiline: true,
          consistent: true,
        },
        TSTypeLiteral: {
          minProperties: 1,
          multiline: true,
          consistent: true,
        },
        TSInterfaceBody: {
          minProperties: 1,
          multiline: true,
          consistent: true,
        },
        TSEnumBody: {
          minProperties: 1,
          multiline: true,
          consistent: true,
        },
      }],
    },
  },
  {
    name: 'foundation/dx-code-style/quotes-props',
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
      '@stylistic': stylistic,
    },
    rules: {
      // Use single quotes for strings to match common JavaScript coding habits.
      '@stylistic/quotes': ['error', 'single'],

      // Enforce quoting all or none of the keys in an object so some properties don't look out of place.
      '@stylistic/quote-props': ['error', 'consistent'],
    },
  },
  {
    name: 'foundation/dx-code-style/ternary-layout',
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
      '@stylistic': stylistic,
    },
    rules: {
      // Disallow line breaks in ternary expressions, except allow them in JSX when needed.
      '@stylistic/multiline-ternary': ['error', 'never', {
        'ignoreJSX': true,
      }],
    },
  },
  {
    name: 'foundation/dx-code-style/whitespace',
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
      '@stylistic': stylistic,
    },
    rules: {
      // Disallow strange whitespace characters so unseen spaces don't cause errors or misformatting.
      'no-irregular-whitespace': ['error'],
    },
  },
];

export default config;
