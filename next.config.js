const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true,
})

module.exports = {
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/document/introduction/introduce',
  //       permanent: true,
  //     },
  //   ]
  // },
  ...withNextra(),
  images: {
    unoptimized: true,
  },
  basePath: '/doc.github.io',
}
