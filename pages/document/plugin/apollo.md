# @yunflyjs/yunfly-plugin-apollo

apollo 插件

## 使用

1. 安装依赖

```bash
yarn add @yunflyjs/yunfly-plugin-apollo
```

2. **config/config.plugin.ts** 中申明插件

```ts
/**
 * yunfly plugin
 */
const plugins: {[key:string]: string}[] = [
  {
    name: 'apollo',
    package: '@yunflyjs/yunfly-plugin-apollo',
    lifeHook: 'beforeStart'
  }
];
// 
export default plugins;
```

3. **config/config.default.ts** 中启用插件

```js
config.apollo = {
  enable: true,
}
```

## 参数说明

### interface 

```ts
export interface ApolloConfig {
  enable?: boolean;
  secret?: string;
  serviceUrl?: string;
  namespace?: string;
  serviceName?: string;
}
```

### description

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| ------ | ------ |------ |------ | ------ |
| enable | `boolean` | 是 | `false` | 是否开启插件 |
| secret | `string` | 否 | `process.env.APOLLO_ACCESSKEY_SECRET` | apollo secret |
| serviceUrl | `string` | 否 | `process.env.APOLLO_META_SERVER_URL` | apollo host url (备注：需要带上 http:// 或 https://) |
| namespace | `string` | 否 | `application` | apollo config namespace |
| serviceName | `string` | 否 | `packageJson.name` | 默认取项目下 package.json 中的name字段 |


## api

插件只暴露一个 api `getApolloConfig`

- getApolloConfig

api 使用

```ts
import { getApolloConfig } from '@yunflyjs/yunfly-plugin-apollo';

console.log('getApolloConfig',getApolloConfig);
```

- 在 controller 中获取 apolloConfig

```ts
import { Controller, Get } from '@yunflyjs/yunfly';
import { getApolloConfig } from '@yunflyjs/yunfly-plugin-apollo';
 
@Controller()
export class ExampleController {
  @Get('/users')
  getApolloConfig() {
    return getApolloConfig();
  }
}
```

## 环境变量

### process.env.APOLLO_META_SERVER_URL

axios 请求 apollo 配置的 url host 地址，需要以 `http://` 或 `https://` 开头。

- 优先级：

`config.apollo.serviceUrl` > `process.env.APOLLO_META_SERVER_URL`

### process.env.APOLLO_ACCESSKEY_SECRET

apollo 秘钥, 若 apollo 管理端开启了秘钥时，需要传递此参数

- 优先级：

`config.apollo.secret` > `process.env.APOLLO_ACCESSKEY_SECRET`

## 其他说明

1. 内置apollo热更新能力，使用http长轮询进行热更新，长轮询时间间隔为1分钟
2. 热更新若失败会重试5次


