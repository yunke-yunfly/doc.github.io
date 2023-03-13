// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Yunfly',
  tagline: 'Node.js WEB 框架',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/yunfly/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'yunfly', // Usually your GitHub org/user name.
  projectName: 'doc.github.io', // Usually your repo name.
  plugins: [
    [require.resolve('docusaurus-lunr-search'), {
      languages: ['en', 'zh'] // language codes
    }],
  ],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Yunfly',
        hideOnScroll: true,
        logo: {
          alt: 'Yunfly Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'introduction/introduce',
            position: 'left',
            label: '使用文档',
          },
          { to: '/update', label: '↑版本升级', position: 'right' },
          {
            href: 'https://github.com/yunke-yunfly/doc.github.io',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '文档',
            items: [
              {
                label: '简介',
                to: '/docs/introduction/introduce',
              },
              {
                label: '插件',
                to: '/docs/introduction/introduce',
              },
              {
                label: '多进程模型',
                to: '/docs/introduction/introduce',
              }
            ],
          },
          {
            title: '知识',
            items: [
              {
                label: 'Node.js',
                href: 'https://www.nodeapp.cn/',
              },
              {
                label: 'Koa',
                href: 'https://koa.bootcss.com/',
              },
              {
                label: 'routing-controllers',
                href: 'https://github.com/typestack/routing-controllers',
              },
            ],
          },
          {
            title: '更多',
            items: [
              {
                label: '掘金社区',
                href: 'https://juejin.cn/user/1821238205358616',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with yunfly.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
