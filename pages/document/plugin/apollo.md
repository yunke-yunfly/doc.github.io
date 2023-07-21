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


