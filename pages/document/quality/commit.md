# Commit

## 背景

我们为什么要使用统一的 commit message 规范？

- 1. 方便快速浏览查找，回溯之前的工作内容
- 2. 可以直接从 commit 生成 Change log(发布时用于说明版本差异)

如果我们不统一 commit message 规范？

- 1. 每个人风格不同，格式凌乱，不能清晰的通过 commit message 看出修改内容
- 2. 部分 commit 没有填写 message，事后难以得知对应修改的作用

所以一份好的 commit message 规范可以提高团队协作的效率，减少代码回溯的时间。

## 什么样的 Git Commit 是合适的？

简单来说，Git Commit Message 应该是解释性的。通过阅读 Git Commit Message，应该可以了解到以下信息：

- 这是一个什么样的修改？例如，这是一个 Bug 修复，新功能还是文档修改？
- 这个修改大概影响的范围是哪些？
- 这个修改的目的是什么？

当一份解释性 Git Commit Message 包含足够的信息，那么就可以用于快速地搜索、定位改动。目前市面上常用的规范就是[angular](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#)的规范，结构如下所示

```text
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

其中，类型包含以下类别：

- build：针对编译系统或外部依赖的修改，例如修改了 webpack 或 babel 的配置，或是升级了某个 npm 库
- ci：针对 CI 系统配置的修改，例如修改了 Travis 或 Circle 的配置文件
- docs：只针对文档的修改
- feat：添加新的功能
- fix：修复 Bug
- perf：针对性能提升的优化
- refactor：代码重构的改动，既没有修复 Bug 也没有添加新功能
- revert：回滚之前的改动
- style：仅仅是针对代码格式的改动，如修复一些 ESLint 的报错
- test：针对测试的改动，如添加新的测试或是修复已有测试的问题

可选作用域(scope)用于说明当前修改的影响范围。这里的描述一般根据项目不同，会有差异。选填，可以没有。

描述(subject)用于简短的描述当前修改的主要内容，长度不超过 50 个字符。（见 [50/72 Formatting](https://stackoverflow.com/questions/2290016/git-commit-messages-50-72-formatting)）

正文(body)作为描述的补充，可以提供额外的信息。如果内容比较多，需要注意换行的问题。一般不建议 Commit Message 过长。例如，在 VSCode 中，一行 Commit Message 最长为 72 个字符。另外，从规范语言的角度来说，如果是英文 Commit Message，建议使用第一人称现在时，动词用原型即可。举例来说，写 fix 而不是 fixes 或者 fixed。

脚注(footer)是描述的一些补充说明。主要有两种：

- 不兼容改动：如果内容包含了不兼容的改动，需要用 BREAKING CHANGE 开头，后面可以补充说明当前不兼容变更的细节、理由以及升级的方案。
- Issues：如果修改有对应的 Issue，那么可以带上相应的 ID，方便后续查找。以 ISSUE 开头，后面跟随一个或多个 Issue ID，如 ISSUE #123 #456。

## 项目中使用

1、安装依赖

```bash
yarn add --dev @commitlint/config-angular @commitlint/cli
# or
yarn add --dev @commitlint/config-conventional @commitlint/cli
```

2、修改 `.commitlintrc.js`

```js filename=".commitlintrc.js"
module.exports = {
  // 继承默认配置
  extends: ['@commitlint/config-angular'] // or ['@commitlint/config-conventional']
};
```

> `@commitlint/config-angular` 与 `@commitlint/config-conventional` 没什么大的区别。

3、自定义规则

```js filename=".commitlintrc.js"
module.exports = {
  // 继承默认配置
  extends: ['@commitlint/config-angular'],
  // 自定义规则
  rules: {
    'type-enum': [
      2,
      'always',
      ['upd', 'feat', 'fix', 'refactor', 'docs', 'chore', 'style', 'revert'],
    ],
    'header-max-length': [0, 'always', 72],
  },
}
```

### 结合 husky 与 lint-stage 来做 commit-message 校验

```bash
yarn add --dev husky@^4.3.8 lint-staged@^10.5.4
```

package.json 内配置 husky 配置项

```json filename="package.json" {4}
{
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
},
```

更多使用方式可以查看[commitlint](https://github.com/conventional-changelog/commitlint)。

## 链接

- [commitlint](https://github.com/conventional-changelog/commitlint)
- [why-use-conventional-commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/#why-use-conventional-commits)
