
# 快速开始

- 通过框架脚手架快速初始化项目

## 设置淘宝镜像源

```js
// npm
npm config set registry https://registry.npmmirror.com

// yarn
yarn config set registry https://registry.npmmirror.com
```

## 通过脚手架快速初始化

- 安装依赖

```shell
yarn global add @yunflyjs/yunfly-cli
```

- 初始化模板

```shell
# 输入项目名称
npx yunfly-cli

# 安装依赖
yarn install
```

- 启动项目

```shell
// 启动项目
yarn dev
yarn watch:dev
```

- 访问应用

```shell
http://127.0.0.1:3000/example/simple/get?name=xxx
```

- 生产编译

```shell
// 编译
yarn build

// 运行
yarn run run
```
