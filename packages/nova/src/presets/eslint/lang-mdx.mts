import * as mdxParser from 'eslint-mdx';
import * as mdxPlugin from 'eslint-plugin-mdx';

import type { FlatConfig } from '@/types/presets/eslint.d.ts';

/**
 * Config.
 *
 * @since 1.0.0
 */
const config: FlatConfig = [
  {
    name: 'nova/lang-mdx',
    files: [
      '**/*.mdx',
    ],
    languageOptions: {
      parser: mdxParser,
    },
    plugins: {
      mdx: mdxPlugin,
    },
    processor: mdxPlugin.createRemarkProcessor({
      lintCodeBlocks: false,
    }),
    rules: {
      ...mdxPlugin.flat.rules,
    },
  },
  {
    name: 'nova/lang-mdx/no-raw-text-in-code',
    files: [
      '**/*.mdx',
    ],
    languageOptions: {
      parser: mdxParser,
    },
    plugins: {
      mdx: mdxPlugin,
    },
    processor: mdxPlugin.createRemarkProcessor({
      lintCodeBlocks: false,
    }),
    rules: {
      // Forbid raw text children inside <code> in MDX to avoid inconsistent rendering and parsing.
      'no-restricted-syntax': ['error', {
        selector: 'JSXElement[openingElement.name.type="JSXIdentifier"][openingElement.name.name="code"] > JSXText',
        message: 'Do not put raw text inside the <code> element. Use backticks in prose (e.g., `map`) or pass a string child in the <code> element (e.g., <code>{\'map\'}</code>).',
      }],
    },
  },
];

export default config;
