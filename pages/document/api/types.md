# Types

## PluginConfig

插件参数类型

```ts
export interface PluginConfig {
  name: string;
  path?: string;
  package?: string;
  async?: boolean;
  lifeHook?: 'beforeStart' | 'appDidReady' | 'afterStart';
  priority?: number;
}
```

| 字段 | 必选 | 说明 |
| ------  |------ |------ |
| name | 是 | 当前插件配置的唯一标识`name`, 跟`config.default.ts`中字段保持一致, `name` 字段很有用，它用来标识`是否有重复插件`和`插件覆盖`的能力 |
| package |  否 | `npm包`插件名，例如: `@yunflyjs/yunfly-plugin-redis`。 (备注：`package`与`path`必须有一个字段为真)|
| path |  否 | `本地开发`插件目录地址 (备注：`package`与`path`必须有一个字段为真)|
| async | 否 | 是否时同步插件 |
| lifeHook | 否 | 插件执行的生命周期 |
| priority |  否 | 插件的权重 |

```ts
import { PluginConfig } from '@yunflyjs/yunfly';

const plugins: PluginConfig[] = [
  {
    name: 'routingControllersExample',
    package: '@yunflyjs/yunfly-plugin-controller-example'
  }
];
export default plugins;
```

## KoaApp

koa 实例化对象类型

```ts filename="config.middleware.ts"
import { KoaApp, Config } from '@yunflyjs/yunfly';

export default function KoaMiddleware(app: KoaApp, config: Config) {
    // 
}
```

## Config

yunfly config 配置类型

```ts title = "config.default.ts"
import { Config } from '@yunflyjs/yunfly';

const config = () => {
  const config: Config = {};
  // jwt配置
  config.jwt = {
    token: {
      domain: '127.0.0.1',
    },
  };
  return config;
};
export default config;
```

## Context

yunfly 在 koa context 类型上进行扩展的类型

```ts filename="config.middleware.ts"
import { KoaApp, Config } from '@yunflyjs/yunfly';

app.use(async function (ctx: Context, next: any) {
    // 所有的config配置注入到ctx中
    await next();
});
// Context.config
// Context.traceId
```
