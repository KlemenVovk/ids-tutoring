// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'IDS 2023/24 tutoring',
  tagline: 'Data science tutoring for the course Introduction to Data Science at UL FRI',
  favicon: 'img/favicon.png',
  url: 'https://github.com',
  baseUrl: '/ids-tutoring/',
  organizationName: 'KlemenVovk',
  projectName: 'ids-tutoring',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/KlemenVovk/ids-tutoring/edit/master/',
        },
        blog: false
        
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'IDS 2023/24 - tutoring',
        logo: {
          alt: 'UL FRI Data Science logo',
          src: 'img/logo.png',
        },
        items: [
          {
            href: 'https://github.com/KlemenVovk/ids-tutoring',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
