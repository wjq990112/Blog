/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

module.exports = {
  title: '炽翎同学的博客',
  tagline: '长期有耐心，一起做有意义的事',
  url: 'https://blog.jack-wjq.cn',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'csuft-guanju-studio', // Usually your GitHub org/user name.
  projectName: 'blog', // Usually your repo name.
  themeConfig: {
    googleAnalytics: {
      trackingID: 'UA-189636319-1',
    },
    gtag: {
      trackingID: 'UA-189636319-1',
    },
    navbar: {
      title: '炽翎同学',
      hideOnScroll: true,
      logo: {
        alt: '🦖',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'blog/basis/',
          label: '计算机基础',
          position: 'left',
        },
        {
          to: 'blog/fe-basis/',
          label: '前端基础',
          position: 'left',
        },
        {
          to: 'blog/fe-framework/',
          label: '前端框架',
          position: 'left',
        },
        {
          to: 'blog/fe-engineering/',
          label: '前端工程化',
          position: 'left',
        },
        {
          to: 'blog/translation/',
          label: '好文翻译',
          position: 'left',
        },
        // Please keep GitHub link to the right for consistency.
        {
          to: 'diary',
          label: '随想录',
          position: 'right',
        },
        {
          label: 'More',
          position: 'right',
          items: [
            {
              href: 'https://github.com/wjq990112/Blog',
              label: 'GitHub',
              position: 'right',
            },
            {
              href: 'https://juejin.cn/user/3122268753634541',
              label: '掘金',
              position: 'right',
            },
            {
              href: 'http://cdn.jack-wjq.cn/%E5%85%AC%E4%BC%97%E5%8F%B7.jpg',
              label: '公众号',
              position: 'right',
            },
            {
              href: 'https://www.zhihu.com/people/mr_chiling',
              label: '知乎',
              position: 'right',
            },
          ],
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Learn',
          items: [
            {
              label: '计算机基础',
              to: 'blog/basis/',
            },
            {
              label: '前端基础',
              to: 'blog/fe-basis/',
            },
            {
              label: '前端框架',
              to: 'blog/fe-framework/',
            },
            {
              label: '前端工程化',
              to: 'blog/fe-engineering/',
            },
            {
              label: '好文翻译',
              to: 'blog/translation',
            },
          ],
        },
        {
          title: 'Others',
          items: [
            {
              label: '随想录',
              to: 'diary',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/wjq990112/Blog',
            },
            {
              label: '掘金',
              href: 'https://juejin.cn/user/3122268753634541',
            },
            {
              label: '公众号',
              href: 'http://cdn.jack-wjq.cn/%E5%85%AC%E4%BC%97%E5%8F%B7.jpg',
            },
            {
              label: '知乎',
              href: 'https://www.zhihu.com/people/mr_chiling',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} 炽翎同学. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'blog',
          routeBasePath: 'blog',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/wjq990112/Blog/edit/master/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: {
          path: 'diary',
          routeBasePath: 'diary',
          editUrl: 'https://github.com/wjq990112/Blog/edit/master/',
          blogTitle: '炽翎同学的随想录',
          blogDescription: '就在这记录自己的所知所想吧~',
          blogSidebarCount: 'ALL',
          blogSidebarTitle: '炽翎同学的随想录',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: ['@docusaurus/plugin-ideal-image'],
};
