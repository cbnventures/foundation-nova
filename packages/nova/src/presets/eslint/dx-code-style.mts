import stylisticPlugin from '@stylistic/eslint-plugin';

import type { FlatConfig } from '@/types/presets/eslint.d.ts';

/**
 * Config.
 *
 * @since 1.0.0
 */
const config: FlatConfig = [
  {
    name: 'nova/dx-code-style',
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
      '@stylistic': stylisticPlugin,
    },
    rules: {
      ...stylisticPlugin.configs.recommended.rules,
    },
  },
  {
    name: 'nova/dx-code-style/arrows',
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
      '@stylistic': stylisticPlugin,
    },
    rules: {
      // Always wrap arrow function parameters in parentheses so "if (a => b)" isn't mistaken for a comparison.
      '@stylistic/arrow-parens': ['error', 'always'],
    },
  },
  {
    name: 'nova/dx-code-style/braces-commas-semicolons',
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
      '@stylistic': stylisticPlugin,
    },
    rules: {
      // Enforce curly braces for all control structures (if, for, while, etc.).
      'curly': ['error', 'all'],

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
    name: 'nova/dx-code-style/objects',
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
      '@stylistic': stylisticPlugin,
    },
    rules: {
      // Force line breaks inside braces when there are multiple items or inner line breaks so the structure stays uniform.
      '@stylistic/object-curly-newline': ['error', {
        // Object literal expressions (e.g., const obj = { a: 1 }).
        ObjectExpression: {
          minProperties: 2,
          multiline: true,
          consistent: true,
        },
        // Object destructuring patterns (e.g., const { a, b } = obj).
        ObjectPattern: {
          minProperties: 4,
          multiline: true,
          consistent: true,
        },
        // Named imports in ES modules (e.g., import { a, b } from 'lib').
        ImportDeclaration: {
          minProperties: 4,
          multiline: true,
          consistent: true,
        },
        // TypeScript type literals (e.g., type X = { a: string }).
        TSTypeLiteral: {
          minProperties: 1,
          multiline: true,
          consistent: true,
        },
        // TypeScript interface bodies (e.g., interface X { a: string }).
        TSInterfaceBody: {
          minProperties: 1,
          multiline: true,
          consistent: true,
        },
        // TypeScript enum bodies (e.g., enum X { A, B }).
        TSEnumBody: {
          minProperties: 1,
          multiline: true,
          consistent: true,
        },
      }],

      // Prefer shorthand properties (e.g., `choices` instead of `choices: choices`) for cleaner object literals.
      'object-shorthand': ['error', 'always'],
    },
  },
  {
    name: 'nova/dx-code-style/operators',
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
      '@stylistic': stylisticPlugin,
    },
    rules: {
      // Forbid "++" and "--" so increments are explicit and side effects are not hidden.
      'no-plusplus': ['error'],

      // Disallow bitwise operators which are rare in app code and often indicate a bug or premature optimization.
      'no-bitwise': ['error'],

      // Disallow assignment in conditional expressions; avoids accidental "=" instead of "===".
      'no-cond-assign': ['error', 'always'],

      // Disallow using void for side effects; favor explicit "undefined" or comments for intent.
      'no-void': ['error'],

      // Disallow deleting variables; meaningless on bindings in modern JS.
      'no-delete-var': ['error'],

      // Disallow reassigning function parameters and avoid hidden mutations.
      'no-param-reassign': ['error', {
        props: true,
      }],

      // Prevent confusing negation of the left operand of relational operators (e.g., "!a in b").
      'no-unsafe-negation': ['error'],

      // Require parentheses when mixing operators with different precedence for clearer intent.
      '@stylistic/no-mixed-operators': ['error', {
        allowSamePrecedence: true,
      }],
    },
  },
  {
    name: 'nova/dx-code-style/quotes',
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
      '@stylistic': stylisticPlugin,
    },
    rules: {
      // Use single quotes for strings to match common JavaScript coding habits.
      '@stylistic/quotes': ['error', 'single'],

      // Enforce quoting all or none of the keys in an object so some properties don't look out of place.
      '@stylistic/quote-props': ['error', 'consistent'],

      // Prefer template literals instead of "string" + "concatenation".
      'prefer-template': ['error'],
    },
  },
  {
    name: 'nova/dx-code-style/regex',
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
    rules: {
      // Keep patterns reusable and do not put flags on literals so callers choose flags to use with "RegExp".
      'no-restricted-syntax': ['error', {
        selector: 'Literal[regex][regex.flags=/./]',
        message: 'Do not use flags on regex literals. Add flags with RegExp("pattern", "flags") at the call site instead.',
      }],
    },
  },
  {
    name: 'nova/dx-code-style/ternary',
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
      '@stylistic': stylisticPlugin,
    },
    rules: {
      // Disallow line breaks in ternary expressions, except allow them in JSX when needed.
      '@stylistic/multiline-ternary': ['error', 'never', {
        'ignoreJSX': true,
      }],
    },
  },
  {
    name: 'nova/dx-code-style/text-characters',
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
    rules: {
      // Disallow irregular Unicode whitespace in runtime text (strings, template chunks, JSX text) and skip comments and regex to avoid false positives.
      'no-irregular-whitespace': ['error', {
        skipStrings: false,
        skipComments: true,
        skipRegExps: true,
        skipTemplates: false,
        skipJSXText: false,
      }],
    },
  },
];

export default config;
