---
sidebar_position: 3
---

# 逐步搭建

- 一步一步逐步搭建

## 设置 npm 镜像源

```js
// npm
npm config set registry https://registry.npmmirror.com
// yarn
yarn config set registry https://registry.npmmirror.com
```

## 初始化项目

### 初始化下目录结构

```js
mkdir yunfly-example
cd yunfly-example
yarn init
yarn add yunfly
yarn add cross-env typescript tsconfig-paths gts --dev
```

### 配置脚本命令

- `package.json` 中添加 `npm scripts` 脚本

```js title="package.json"
{
    "scripts": {
        "dev": "cross-env NODE_ENV=dev PORT=3000 yunfly",
        "watch:dev": "cross-env NODE_ENV=dev PORT=3000 yunfly --watch",
        "run": "cross-env PORT=3000 NODE_ENV=production RUNTIME_ENV=prod yunfly",
        "build": "yarn clean && yarn compile",
        "clean": "gts clean",
        "compile": "tsc -p ."
    }
}
```

### 配置 tsconfig.json

```json title="tsconfig.json"
{
  "extends": "./node_modules/gts/tsconfig-google.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "./build/",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "noEmitOnError": false,
    "noUnusedLocals": true,
    "noUnusedParameters": false,
    "moduleResolution": "node",
    "strictPropertyInitialization": false,
    "module": "commonjs",
    "target": "es2017",
    "sourceMap": false
  },
  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

## 编写 Controller

```ts title="src/controller/ExampleController.ts"
import { Get, JsonController, BodyParam, Post, QueryParam } from 'yunfly';
/**
 * 测试案例controller
 *
 * @export
 * @class TestController
 */
@JsonController('/example')
export default class ExampleController {
  /**
   * 简单案例 - get
   *
   * @param {string} name 姓名
   * @return {*}  {string}
   * @memberof ExampleController
   */
    @Get('/simple/get')
    simple(
        @QueryParam('name') name: string,
    ): string {
        return name || 'success';
    }
    /**
    * 简单案例 -post
    *
    * @param {string} name 姓名
    * @return {*}  {string}
    * @memberof ExampleController
    */
    @Post('/simple/post')
    simple1(
        @BodyParam('name') name: string,
    ): string {
        return name || 'success';
    }
}
```

## 配置 Config

```ts title="src/config/config.default.ts"

/**
 * This is an env aggregation default config.
 * (note) this is a minimum config.
*/
import * as path from 'path';
import { Config } from 'yunfly';

const config = () => {
    const config: Config = {};

    /*
    * routing-controllers configs
    * 1. controllers、middlewares、authorizationChecker 需要使用`path.join`进行文件位置的绝对定位
    * 2. 如果 middlewares 、authorizationChecker中有rpc请求，则需要使用函数包裹。
    */
    config.routingControllersOptions = {
        defaultErrorHandler: false,
        controllers: [path.join(__dirname, '../controller/*')],
        middlewares: [path.join(__dirname, '../middleware/*')],
        // middlewares: [
        //   require(path.join(__dirname,'../middleware/xxxMiddleware')).default,
        // ]
        defaults: {
            nullResultCode: 200,  // 204 | 404
            undefinedResultCode: 200 // 204 | 404
        }
    };
    
    return config;
};

export default config;
```

- 此时目录结构如下：

```js
yunfly-example
├── src
│   ├── config 
│   │   └── config.default.ts
│   └── controller
│       └── ExampleController.ts
├── package.json
├── tsconfig.json
└── yarn.locak
```

## 运行项目

```js
// 运行
yarn dev
// 监听模式运行 
yarn watch:dev

// open: http://127.0.0.1:3000/example/simple/get?name=xiaoming
```
