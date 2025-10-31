import * as path from 'path';

import * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import * as docusaurusSearch from '@easyops-cn/docusaurus-search-local';
import { themes as prismThemes } from 'prism-react-renderer';

import { MenuBuilder } from './tools/menu-builder';

/**
 * Config.
 *
 * @since 1.0.0
 */
const config: Config = {
  title: 'Nova',
  titleDelimiter: ' - ',
  tagline: 'Scripts, templates, and project configuration for the common JavaScript and TypeScript developer',
  favicon: 'images/favicon.ico',
  url: 'https://cbnventures.github.io',
  baseUrl: '/nova/',
  organizationName: 'cbnventures',
  projectName: 'nova',
  onBrokenLinks: 'throw',
  i18n: {
    defaultLocale: 'en',
    locales: [
      'en',
    ],
    path: 'i18n',
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
        calendar: 'gregory',
        path: 'en',
      },
    },
  },
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        blog: false,
        docs: {
          routeBasePath: 'docs',
          sidebarPath: './sidebars.ts',
        },
        theme: {
          customCss: './static/styles/global.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    [
      'docusaurus-plugin-module-alias',
      {
        alias: {
          '@': path.resolve(__dirname, 'src'),
        },
      },
    ],
  ],
  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        indexDocs: true,
        indexBlog: false,
        indexPages: true,
        docsRouteBasePath: 'docs',
        hashed: true,
        highlightSearchTermsOnTargetPage: true,
        searchBarShortcutKeymap: 'mod+k',
      } satisfies docusaurusSearch.PluginOptions,
    ],
  ],
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Nova',
      logo: {
        alt: 'Nova',
        src: 'images/logo.svg',
      },
      items: [
        ...MenuBuilder.getNavBarItems('docs'),
        {
          label: 'GitHub',
          position: 'right',
          type: undefined,
          href: 'https://github.com/cbnventures/nova',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Links',
          items: [
            ...MenuBuilder.getFooterLinks('docs'),
          ],
        },
        {
          title: 'Stay Connected',
          items: [
            {
              label: 'Facebook',
              href: 'https://www.facebook.com/cbnventures',
            },
            {
              label: 'X',
              href: 'https://x.com/cbnventures',
            },
            {
              label: 'YouTube',
              href: 'https://www.youtube.com/@cbnventures',
            },
            {
              label: 'Instagram',
              href: 'https://www.instagram.com/cbnventures/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/cbnventures',
            },
            {
              label: 'Google Play',
              href: 'https://play.google.com/store/apps/dev?id=6419450160526226105',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/company/cbnventures/',
            },
          ],
        },
        {
          title: 'Company',
          items: [
            {
              label: 'Terms of Use',
              href: 'https://www.cbnventures.io/terms/',
            },
            {
              label: 'Privacy Policy',
              href: 'https://www.cbnventures.io/privacy/',
            },
            {
              label: 'Get In Touch',
              href: 'https://www.cbnventures.io/get-in-touch/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} CBN Ventures LLC. All Rights Reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
