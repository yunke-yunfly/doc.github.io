# Cspell

`cspell` 是一个用于拼写检查代码的命令行工具和库。一份代码的好与坏，单词拼写的正确性也显得尤为重要。

## 使用

### 1、安装依赖

```ts
yarn add cspell --dev
```

### 2、配置检测规则

```json filename="cspell.json"
{
  "version": "0.2",
  "language": "en",
  "words": [
    "typeof",
    "cnpm"
  ],
  "ignorePaths": [
    "package.json",
    "node_modules/**",
    "**/*.snap",
    "coverage/**",
    ".eslintrc.js",
    "cspell.json",
    "dist/**",
    "build/**"
  ]
}
```

配置详情: <https://www.npmjs.com/package/cspell#Customization>

### 3、配置脚本命令

```js filename="package.json" {3}
{
    "scripts": {
        "spell-check:all": "cspell \"**/*.{txt,ts,tsx,js,json,md}\""
    }
}
```

### 4、执行脚本命令

```js
yarn spell-check:all
```

## 结合 husky 与 lint-stage 来做 commit-cspell 校验

```bash
yarn add --dev husky@^4.3.8 lint-staged@^10.5.4
```

package.json 内配置 husky 配置项

```json filename="package.json" {4}
{
  "husky": {
    "hooks": {
      "pre-commit": "yarn spell-check:all"
    }
  }
},
```

更多使用请参考: <https://www.npmjs.com/package/cspell>
