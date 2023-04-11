import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <>
    <img style={{ width: "40px", marginRight: "10px" }} src="data:image/png;base64,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" />
    <strong>Yunfly</strong>
  </>,
  project: {
    link: 'https://github.com/yunke-yunfly/doc.github.io',
    icon: <svg width="24" height="24" className="tanuki-logo" viewBox="0 0 36 36">
      <path className="tanuki-shape tanuki-left-ear" fill="#e24329" d="M2 14l9.38 9v-9l-4-12.28c-.205-.632-1.176-.632-1.38 0z"></path>
      <path className="tanuki-shape tanuki-right-ear" fill="#e24329" d="M34 14l-9.38 9v-9l4-12.28c.205-.632 1.176-.632 1.38 0z"></path>
      <path className="tanuki-shape tanuki-nose" fill="#e24329" d="M18,34.38 3,14 33,14 Z"></path>
      <path className="tanuki-shape tanuki-left-eye" fill="#fc6d26" d="M18,34.38 11.38,14 2,14 6,25Z"></path>
      <path className="tanuki-shape tanuki-right-eye" fill="#fc6d26" d="M18,34.38 24.62,14 34,14 30,25Z"></path>
      <path className="tanuki-shape tanuki-left-cheek" fill="#fca326" d="M2 14L.1 20.16c-.18.565 0 1.2.5 1.56l17.42 12.66z"></path>
      <path className="tanuki-shape tanuki-right-cheek" fill="#fca326" d="M34 14l1.9 6.16c.18.565 0 1.2-.5 1.56L18 34.38z"></path>
    </svg>,
  },
  // chat: {
  //   link: 'https://discord.com',
  // },
  docsRepositoryBase: 'https://github.com/yunke-yunfly/doc.github.io',
  // footer: {
  //   text: 'Nextra Docs Template',
  // },
  feedback: {
    content: "问题? 请反馈给我们 ->"
  },
  head: (
    <>
      <meta property="og:title" content="nextra-doc" />
      <meta property="og:description" content="一款高效的 Node.js Web 框架。" />
    </>
  ),
}

export default config
