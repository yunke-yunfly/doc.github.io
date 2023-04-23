# 插件开发

## 插件模型

```txt
                                 ┌─────────────────────────┐       
                                 │        yunfly           │ 
                                 └─────────────────────────┘
                                             |
                                             |    
                                 ┌─────────────────────────┐   
                                 │         koa app         │    
                                 └─────────────────────────┘  
                              /   /    /     |      \    \    \
                          /     /     /      |       \     \       \
                      /      /       /       |        \      \        \
                  /        /        /        |         \        \         \
┌───────┐ ┌────────┐ ┌───────┐ ┌───────┐ ┌────────┐ ┌────────┐ ┌─────────┐ ┌──────────┐    
│ jwt   │ │response│ │ logger│ │ error │ │ session│ │ redis  │ │security │ │prometheus│ ......
└───────┘ └────────┘ └───────┘ └───────┘ └────────┘ └────────┘ └─────────┘ └──────────┘    
```

## 目录结构

```txt
. yunfly-plugin-xxx
├── package.json
├── src
│   ├── app.ts (可选)
│   ├── config
│   |   ├── config.default.ts
│   |   ├── config.local.ts (可选)
│   |   ├── config.test.ts (可选)
│   |   ├── config.release.ts (可选)
│   |   ├── config.prod.ts (可选)
│   |   ├── config.middleware.ts (可选)
│   ├── middleware (可选)
│   |   └── SomeMiddleware.js
│   ├── controller (可选)
│   |   ├── SomeController.ts
│   ├── service (可选)
│   |   ├── SomeService.ts
│   ├── schedule (可选)
│   |   ├── task1.ts
│   |   ├── task2.ts
│   ├── __tests__  (可选)
│   |   ├── test.xxx1.ts
│   |   └── test.xxx2.ts
│   |   └── 其他文件
├── README.md
├── tsconfig.json
├── .gitignore
├── .gitlab-ci.yml
├── .eslintrc.js
├── jest.config.js
├── grpc-code-gen.config.js
└── grpc-service.dev.config.js
```

- 插件目录说明
  1. 插件入口文件为 `app.ts`
  2. 插件 `config` 同样支持`多环境`，config配置优先级：`应用 config > yunfly config > plugin config`
  3. 插件支持 `controller`, 插件 `controller` 默认会自动增加`相应插件名的路由前缀`
  4. 插件支持定时任务

## 命名规范

- 插件命名规范

1. `npm` 包名以 `yunfly-plugin` 开头，且为全小写，例如：`yunfly-plugin-xx`。比较长的词组用中划线：`yunfly-plugin-hello-world`
2. 对应的 `npm` 包名使用 `@yunflyjs/yunfly-plugin-xxx` 为准

- `package.json` 书写规范

1. 遵循 `yunfly` 模板库规范
2. 在 `keywords` 里加上 `yunfly`、`yunfly-plugin` 等关键字，便于索引

## 使用插件配置

我们看下面示例来说明 plugin 配置

```ts filename="src/config/config.plugin.ts"
/**
 * yunfly 插件
 * 不配置 lifeHook 的情况下，数组顺序就是插件的加载顺序
 */
import * as path from 'path'
// 
const plugins: {[key:string]: string}[] = [
  /**
   * 使用 path 模式，插件在项目目录
   * async 为 true，表示 同步加载插件，加载完才会加载下一个插件
   * lifeHook 为 beforeStart，表示在 beforeStart 生命周期下进行加载
   */
  {
    name: 'hello',
    path: path.join(__dirname, '../plugin/yunfly-plugin-hello'),
    async: true,
    lifeHook: 'beforeStart',
  },
  /**
   * 使用npm包模式
   */
  {
    name: 'redis',
    package: '@yunflyjs/yunfly-plugin-redis',
  }
];
// 
export default plugins;
```

| 字段 | 类型 | 必选 | 说明 |
| ------ | ------ |------ |------ |
| name | `string` | 是 | 当前插件配置的唯一标识 `name`, 跟 `config.default.ts` 中字段保持一致, `name` 字段很有用，它用来标识`是否有重复插件`和`插件覆盖`的能力 |
| package | `string` | 否 | `npm包` 插件名，例如: `@yunflyjs/yunfly-plugin-redis`。 (备注：`package` 与 `path` 必须有一个字段为真)|
| path | `string` | 否 | `本地开发` 插件目录地址 (备注：`package` 与`path` 必须有一个字段为真)|
| async | `boolean` | 否 | 若为 `true`，表示同步加载插件，加载完才会加载下一个插件；否则为异步加载，不阻塞其他插件加载。|
| lifeHook | `string` | 否 | 可选值：`beforeStart`、`configDidReady`、`appDidReady`、`afterStart`，表示在哪个生命周期进行加载。默认在 `appDidReady` 周期下加载插件。想进一步了解生命周期[可看](./../basic-function/lifehook.md) |
| priority | `number` | 否 | 默认值为：50, 值越小越先执行插件 |

## 执行顺序

我们看下面的示例进行说明：

```ts filename="src/config/config.plugin.ts"

import * as path from 'path'

const plugins: {[key:string]: string}[] = [
  {
    name: 'a',
    package: '@yunflyjs/yunfly-plugin-a',
  },
  {
    name: 'b',
    package: '@yunflyjs/yunfly-plugin-b',
  },
  {
    name: 'c',
    package: '@yunflyjs/yunfly-plugin-c',
    priority: 10
  },
  /**
   * 使用npm包模式
   */
  {
    name: 'd',
    package: '@yunflyjs/yunfly-plugin-d',
    lifeHook: 'beforeStart',
  }
];
```

### 默认情况按数组顺序执行

上面案例中 a,b 插件执行顺序为 `a > b`

### 按生命周期分组执行

如果插件有 `lifeHook` 生命周期配置，则插件会根据生命周期分类，并按数组顺序执行。

默认情况下，在插件没有配置 `lifeHook` 时，插件会在 `appDidReady` 生命周期钩子进行加载，按数组顺序执行。

但是案例的 d 配置了 `lifeHook: 'beforeStart'`，`beforeStart` 生命周期钩子早于 `appDidReady` 生命周期钩子（[生命周期说明可看](./../basic-function/lifehook.md))

上面案例中 a,b,d 执行顺序为 `d > a > b`

### 插件执行顺序权重

插件第一优先级通过生命周期分组，组内根据权重值进行排序，权重值越小越先执行插件，若无权重值，则默认数组执行顺序。

上面案例中 插件 c 设置了权重,由于插件默认权重值为50，因此最终案例插件执行顺序为： `d > c > a > b`

## controller 插件路由

- 插件支持`controller`的加载, 你可以通过`npm`包的方式来开发通用的`api`。

### 解决插件路由冲突

- 案例： 现有一个 `@yunflyjs/yunfly-plugin-controller-example` 插件：

`ExampleController.ts` 核心代码如下:

```ts
import { HeaderParam, QueryParam, Get, JsonController } from "routing-controllers"
@JsonController('/example')
export default class TestController {
  @Inject() private exampleService: ExampleService
  @Get('/hello')
  async example(): Promise<string> {
    return 'hello world.'
  }
}
```

`config/config.default.ts` 配置:

```ts
config.controllerExample = {
  // 
}
```

- 1. 使用默认配置，插件内部默认会以`插件名称`作为`插件路由的前缀`

```ts
// 因此默认对外暴露的路由为
/yunfly-plugin-example/example/hello
```

- 2. 使用自定义路由，`config`插件配置中声明 `routePrefix` 配置

```ts
// 空
config.controllerExample = {
  routePrefix: '',
}
// 此配置对外暴露的路由为
/example/hello

// /plugin前缀
config.controllerExample = {
  routePrefix: '/plugin',
}
// 此配置对外暴露的路由为
/plugin/example/hello
```

## 渐进式开发

- 由[配置](#配置)可以知道，在Yunfly`插件`里, 有 `path` 和 `package` 两种加载模式，那我们该如何选择呢？

- 下面以实际案例，一步步进行演示，如何渐进式地进行代码演进。

### 最初始的状态

- 假设我们现在需要实现一个发送邮件的功能，实现`如下能力`：

```js
// 邮件的配置从config中获取
const message = {
  from: "sender@server.com",
  to: "receiver@sender.com",
  subject: "Message title",
  text: "Plaintext version of the message",
  html: "<p>HTML version of the message</p>"
};
ctx.email.sendMail(message);
```

- Yunfly现有能力，我们可以选择`开发一个 koa 中间件`或者写一个 `npm` 包：

- 1. 增加配置`config.email`

```ts
config.email = {
  host: 'xxxxxx',
  port: 587,
  secure: false,
  user: 'xxx',
  pass: 'xxx',
}
```

- 2. 核心代码 `config.middleware.ts`实现

```ts filename="src/config/config.middleware.ts"
import { KoaApp, Config } from '@yunflyjs/yunfly'
import { Context } from "koa"
const nodemailer = require("nodemailer");
// 
export default function KoaMiddleware(app: KoaApp, config: Config) {
  // 把邮件能力抽离为一个koa中间件
  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure, // true for 465, false for other ports
    auth: {
      user: config.email.user, // generated ethereal user
      pass: config.email.pass, // generated ethereal password
    },
  });

  // 挂载到context对象下
  app.context.email = transporter;
}
```

### 插件的雏形

- 我们很明显能感知到，这段逻辑是具备`通用性`的，可以写成插件。

- 但一开始的时候，`功能还没完善`，直接独立插件，维护起来比较麻烦。

- 此时，我们可以把代码写成`插件`的形式，但并不独立出去。

#### 新的实现

- 1. `应用/src/plugin` 文件夹下新增 `yunfly-plugin-email` 插件文件夹，Node应用目录结构如下：

```txt
. bff-example
├── node_modules
├── src
│   ├── alone
│   ├── config
│   ├── controller
│   ├── service
│   ├── utils
│   └── plugin
│   │   └── yunfly-plugin-email
│   │       ├── src
│   │       │   ├── config
│   │       │   │   └── config.default.ts
│   │       │   └── app.ts
│   │       ├── .gitlab-ci.yml
│   │       ├── tsconfig.json
│   │       ├── README.md
│   │       └── package.json
│   └── app.ts
├── README.md
├── tsconfig.json
├── .gitignore
├── .gitlab-ci.yml
├── .eslintrc.js
├── jest.config.js
├── package.json
```

- 核心代码实现：

- `应用/src/plugin/yunfly-plugin-email/src/app.ts` 代码实现

```ts filename="src/plugin/yunfly-plugin-email/src/app.ts"
import { ApolloConfig, Config, KoaApp } from "@yunflyjs/yunfly";
// 
export default function EmailPlugin(app: KoaApp, config: Config) {
  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });
  // 挂载到context对象下
  app.context.email = transporter;
}
```

- 2. `应用/src/config/config.default.ts` 下增加`config.email`配置项

```ts filename="src/config/config.default.ts"
config.email = {
  host: 'xxxxxx',
  port: 587,
  secure: false,
  user: 'xxx',
  pass: 'xxx',
}
```

- 3. `应用/src/config/config.plugin.ts`中通过`path`来挂载插件。

```ts filename="src/config/config.plugin.ts"
import * as path from 'path'
const plugins: {[key:string]: string}[] = [
  {
    name: 'eamil',
    path: path.join(__dirname, '../plugin/yunfly-plugin-email'),
  }
];
export default plugins;
```

- 4. `应用/package.json`中配置插件地址（此处是为了把插件中的`npm`包安装在全局的`node_modules`中）

```js filename="package.json"
"dependencies": {
  "@yunflyjs/yunfly": "*",
  "@yunflyjs/yunfly-plugin-email": "./src/plugin/yunfly-plugin-email"
},
```

### 抽成独立插件

经过一段时间开发后，该模块的功能成熟，此时可以考虑抽出来成为`独立的插件`。

- 1. 直接将 `应用/src/plugin/yunfly-plugin-email` 独立出来 发布一个  `@yunflyjs/yunfly-plugin-email`的`npm`包.

- 2. 安装插件

```bash
yarn add @yunflyjs/yunfly-plugin-email
```

- 3. 移除`plugin/yunfly-plugin-email` 目录

- 4. 移除`plugin/yunfly-plugin-email` 的 `package.json`的本地依赖

- 5. `config/config.plugin.ts`中修改依赖声明为`package`方式

```ts filename="config/config.plugin.ts"
plugins.push({
  name: 'eamil',
  path: '@yunflyjs/yunfly-plugin-email',
})
```

### 渐进式开发总结

综上所述，大家可以看到我们是如何一步步渐进地去进行框架演进.

- 一般来说，当多个应用中有可能会复用到的代码时，直接放到 `plugin` 目录去。
- 当该插件功能稳定后，即可独立出来作为一个 `node module`。
- 如此以往，应用中相对复用性较强的代码都会逐渐独立为单独的插件。
- 当你的应用逐渐进化到针对某类业务场景的解决方案时，将其抽象为独立的 `framework` 进行发布。
- 当在新项目中抽象出的插件，下沉集成到框架后，其他项目只需要简单的重新 `yarn install` 下就可以使用上，对整个团队的效率有极大的提升。

## 插件覆盖

- `yunfly` 设计的插件模式中,插件之间是可以覆盖的
  - 因此你可以开发一个适合于自己的插件来覆盖 `yunfly` 内置的插件
  - 你也可以自己开发一个插件来覆盖其他需要被覆盖的插件

### 插件覆盖规则

- 当框架检测到插件名（即: `plugin.name`）相同时, 会启用插件覆盖能力, 相同插件名情况下, 后加载的插件会覆盖前加载的插件。

> 备注: 插件覆盖只检测 `plugin.name` 字段, 因此 `path` 和 `package` 模式都支持

- 例如：你想覆盖 `yunfly` 中内置的 `log` 插件

### package 包模式

- 1. 开发自定义的 `log` 插件

```ts
// npm 包
@yunflyjs/yunfly-plugin-my-logger
```

- 2. `config.plugin.ts`中声明自定义的 `log` 插件

```ts filename="config/config.plugin.ts" {10-13}
/**
 * yunfly 插件
 * 数组顺序就是插件的加载顺序
 */
const plugins: {[key:string]: string}[] = [
  /**
   * 使用自定义的log插件覆盖yunfly log插件
   * 使用npm包模式
   */
  {
    name: 'log',
    package: '@yunflyjs/yunfly-plugin-my-logger'
  }
];
export default plugins;
```

### path 模式

1. `src/plugin/yunfly-plugin-my-logger` 下开发自定义的 `log` 插件逻辑

2. `config.plugin.ts` 中声明自定义的 `log` 插件

```ts filename="config/config.plugin.ts" {11-14}
import * as path from 'path'
/**
 * yunfly 插件
 * 数组顺序就是插件的加载顺序
 */
const plugins: {[key:string]: string}[] = [
  /**
   * 使用自定义的log插件覆盖yunfly log插件
   * 使用npm包模式
   */
  {
    name: 'log',
    path: path.join(__dirname, '../plugin/yunfly-plugin-my-logger'),
  },
];
export default plugins;
```

- 其他插件同理

## 插件即Node服务

- 当`yunfly`插件类型为`Yunfly Controller Plugin`类型时, 插件支持`路由`、`rpc`, 同时插件本身便可以是一个`Node`服务。

- 插件目录结构

```js
. yunfly-plugin-controller-example
├── package.json
├── src
│   ├── app.ts
│   ├── config
│   |   ├── config.default.ts
│   ├── middleware
│   |   └── SomeMiddleware.js
│   ├── controller
│   |   ├── SomeController.ts
│   ├── service
│   |   ├── SomeService.ts
│   └── __tests__
│       ├── test.xxx1.ts
│       └── test.xxx2.ts
├── README.md
├── tsconfig.json
├── .gitignore
├── .gitlab-ci.yml
├── .eslintrc.js
├── jest.config.js
├── grpc-code-gen.config.js
└── grpc-service.dev.config.js
```

- 插件安装`@yunflyjs/yunfly`为`devDependencies`依赖

## 最佳实践

下面我们通过对几种常见类型的插件进行举例。

### 常规插件

> 常规插件可以是`执行某一段逻辑的代码`, 可以是 `koa 中间件`, 也可以是`注册一个全局服务`。

常规插件的核心入口为 `app.ts`，下面跟着我步骤来创建一个常规插件, 以 `@yunflyjs/yunfly-plugin-probe` 插件为例。

- 1. 插件目录结构

  ```js
  . yunfly-plugin-probe
  ├── src
  |   ├── app.ts
  │   ├── config
  │   |   ├── config.default.ts
  ├── README.md
  ├── tsconfig.json
  ├── .gitignore
  ├── .gitlab-ci.yml
  ├── .eslintrc.js
  ├── jest.config.js
  ├── package.json
  ```

- 2. `app.ts` 代码实现

  ```ts filename="src/app.ts"
  import Koa from 'koa';
  interface ProbeOption {
    koaApp: Koa<Koa.DefaultState, Koa.DefaultContext>;
    pluginConfig: {enable: boolean;}
  }
  export default function YunflyProbePlugin({ koaApp, pluginConfig }: ProbeOption): void {
    if(!pluginConfig.enable) {
      return;
    }
    koaApp.use(async(ctx: Koa.Context, next: any) => {
      if (ctx.req.url === '/debug/vars') {
        ctx.set('Content-Type', 'application/json; charset=utf-8');
        ctx.status = 200;
        ctx.body = { code: 200, data: 'success' };
        return;
      }
      await next();
    });
  }
  ```

- 3. `config.default.ts` 代码实现

  ```ts filename="config/config.default.ts" {5-7}
  import { Config } from '@yunflyjs/yunfly';
  export default function config(): Config {
    const config: Config = {};
    // body参数配置
    config.probe = {
      enable: true
    };
    return config;
  }
  ```

- 4. `package.json` 核心配置。

  ```json filename="package.json"
  {
    "name": "@yunflyjs/yunfly-plugin-probe",
    "version": "1.0.0",
    "main": "./dist/app.js",
    "typings": "dist/app.d.ts",
    "scripts": {
      "build": "gts clean && tsc"
    },
    "files": [
      "dist"
    ],
    "devDependencies": {
      "@yunflyjs/yunfly": "^3.1.20"
    }
  }
  ```

- 5. 插件使用请参考： [配置](#配置)

### 定时任务插件

我们可以发布一个定时任务的 `plugin`, 定时任务插件需要创建一个固定的 `schedule` 文件夹，`schedule` 中的每一个文件即是一个定时任务。

下面以 `@yunflyjs/yunfly-plugin-schedule-example` 插件为例。

- 1. 插件目录结构

  ```js
  . yunfly-plugin-schedule-example
  ├── src
  |   ├── app.ts
  │   ├── config
  │   |   ├── config.default.ts
  │   ├── schedule
  │   |   ├── task1.ts
  │   |   ├── task2.ts
  ├── README.md
  ├── tsconfig.json
  ├── .gitignore
  ├── .gitlab-ci.yml
  ├── .eslintrc.js
  ├── jest.config.js
  ├── package.json
  ```

- 2. `app.ts` 代码实现
  - 定时任务不依赖于 `app.ts` 入口，因此我们默认为一个空函数即可

  ```ts filename="src/app.ts"
  export default function YunflyPlugin(): void {
    // do nothing
  }
  ```

- 3. `task` 代码实现

  ```ts filename="src/schedule/task1.ts"
  import { Config, FlyApp } from '@yunflyjs/yunfly';
  export default function schedule() {
    return {
      schedule: {
        cron: '*/5 * * * * *',
        enable: true,
        type: 'worker', // 可选值 worker: 随机选择一个worker执行， all: 所有worker都执行, 默认为worker
      },
      task: (config: Config, app?: FlyApp) => {
        console.log(`yunfly example schedule plugin task: ${ new Date()} (5s一次)`);
      },
    };
  }
  ```

- 4. `package.json` 核心配置。

  ```json filename="package.json"
  {
    "name": "@yunflyjs/yunfly-plugin-schedule-example",
    "version": "1.0.0",
    "main": "./dist/app.js",
    "typings": "dist/app.d.ts",
    "scripts": {
      "build": "gts clean && tsc"
    },
    "files": [
      "dist"
    ]
  }
  ```

- 5. 插件使用请参考： [配置](#配置)

### 中间件插件

 插件可以是一个 `middleware` (一般建议，一个插件推荐只做一件事情)。

  下面以 `@yunflyjs/yunfly-plugin-logger` 插件为例。

- 1. 插件目录结构

  ```js
  . yunfly-plugin-schedule-example
  ├── src
  |   ├── app.ts
  │   ├── config
  │   |   ├── config.default.ts
  │   ├── middleware
  │   |   ├── LoggerMiddleware.ts
  ├── README.md
  ├── tsconfig.json
  ├── .gitignore
  ├── .gitlab-ci.yml
  ├── .eslintrc.js
  ├── jest.config.js
  ├── package.json
  ```

- 2. `app.ts` 代码实现
  - 定时任务不依赖于 `app.ts` 入口，因此我们默认为一个空函数即可

  ```ts filename="src/app.ts"
  export default function YunflyPlugin(): void {
    // do nothing
  }
  ```

- 3. `LoggerMiddleware.ts` 插件实现

  ```ts filename="src/middleware/LoggerMiddleware.ts"
  import { Context } from 'koa';
  import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';
  @Middleware({ type: 'before' })
  export default class LoggerMiddleware implements KoaMiddlewareInterface {
    async use(context:Context, next:(err?:any) => Promise<any>):Promise<any> {
      console.info('yunfly-plugin-logger begin...');
      await next();
      console.info('yunfly-plugin-logger end...');
    }
  }
  ```

- 4. `package.json` 核心配置。

  ```json filename="package.json"
  {
    "name": "@yunflyjs/yunfly-plugin-logger",
    "version": "1.0.0",
    "main": "./dist/app.js",
    "typings": "dist/app.d.ts",
    "scripts": {
      "build": "gts clean && tsc"
    },
    "files": [
      "dist"
    ],
    "devDependencies": {
      "routing-controllers": "^0.7.7"
    }
  }
  ```

- 5. 插件使用请参考： [配置](#配置)

### 路由插件

  顾名思义，路由插件主要用于拓展路由。下面以 `@yunflyjs/yunfly-plugin-controller-example` 插件为例。

- 1. 插件目录结构

  ```js
  . yunfly-plugin-controller-example
  ├── package.json
  ├── src
  │   ├── app.ts
  │   ├── config
  │   |   ├── config.default.ts
  │   ├── middleware
  │   |   └── SomeMiddleware.js
  │   ├── controller
  │   |   ├── SomeController.ts
  │   ├── service
  │   |   ├── SomeService.ts
  │   └── __tests__
  │       ├── test.xxx1.ts
  │       └── test.xxx2.ts
  ├── README.md
  ├── tsconfig.json
  ├── .gitignore
  ├── .gitlab-ci.yml
  ├── .eslintrc.js
  └── jest.config.js
  ```

- 2. `app.ts` 代码实现
  - 定时任务不依赖于 `app.ts` 入口，因此我们默认为一个空函数即可

    ```ts filename="src/app.ts"
    export default function YunflyPlugin(): void {
      // do nothing
    }
    ```

- 3.1. `UserController` 代码实现

  ```ts filename="src/controller/UserController.ts"
  import { Get, Inject, JsonController, QueryParam } from '@yunflyjs/yunfly';
  import * as types from '../grpc-code-gen/yued/grpc-server-example/types';
  import UserService from '../service/UserService';
  // 
  @JsonController('/user')
  export default class UserController {
    @Inject() private userService: UserService
    // 
    @Get('/gen-user-info')
    async genToken(
      @QueryParam('user_id') user_id: number,
    ): Promise<types.user.GetUserInfoResponse> {
      return await this.userService.getUserInfo({ user_id });
    }
  }
  ```

- 3.2. `UserService.ts` 代码实现

  ```ts filename="src/service/UserService.ts"
  import { Service } from 'typedi';
  import { userServiceV2 } from '../../grpc-code-gen/yued/grpc-server-example/user/UserService';
  import * as types from '../../grpc-code-gen/yued/grpc-server-example/types';
  // 
  @Service()
  export default class UserService {
    // 
    async getUserInfo(request: types.user.GetUserInfoRequest, metadata?: any ): Promise<types.user.GetUserInfoResponse> {
      const { error, response }: any = await userServiceV2.GetUserInfoV2({
        request, metadata,
      });
      if (error) {
        throw error;
      }
      return response;
    }
  }
  ```

- 4. `config.default.ts` 代码实现

```ts filename="src/config/config.default.ts"
import { Config } from '@yunflyjs/yunfly';
// 
export default function config(apolloConfig: any = {} /* V3.1.14+新增参数 */): Config {
  const config: Config = {};
  // 插件配置
  config.routingControllersExample = {
    routePrefix: '/yunfly-plugin-controller-example',
  };
  return config;
}
```

- 5. `package.json` 核心配置。

```json filename="package.json"
{
  "name": "@yunflyjs/yunfly-plugin-controller-example",
  "version": "1.0.0",
  "main": "./dist/app.js",
  "typings": "dist/app.d.ts",
  "scripts": {
    "watch:dev": "cross-env NODE_ENV=dev YUNFLY_TYPE=link yunfly --watch",
    "grpc-gen": "grpc-code-gen gen",
    "build": "gts clean && tsc",
  },
  "files": [
    "dist",
    ".grpc-code-gen",
    "grpc-code-gen.config.js",
    "grpc-service.dev.config.js"
  ],
  "devDependencies": {
    "@yunflyjs/yunfly": "^1.0.0"
  },
  "optionalDependencies": {
    "grpc": "^1.24.6"
  }
}
```

备注：

> - `controller` 插件安装 `@yunflyjs/yunfly` npm包之后，可以是一个完整的Node小型应用

## 附录

### 插件架构图

![插件](https://github.com/yunke-yunfly/doc.github.io/blob/nextra/image/1646709290055-0-image.png)

### 插件插拔模型

![插件](https://yunke-oss.oss-cn-hangzhou.aliyuncs.com/bff-basis-fe-sites/imgs/2022/03/08/1646709332445-0-image.png)

### 插件代码插拔模型

![插件](https://yunke-oss.oss-cn-hangzhou.aliyuncs.com/bff-basis-fe-sites/imgs/2022/03/08/1646709355673-0-image.png)
