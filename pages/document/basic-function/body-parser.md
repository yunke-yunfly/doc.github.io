# 获取 Post 请求参数

## 简介

- 获取 `post` 请求参数

## 使用

1. 安装依赖

```ts
yarn add @yunflyjs/yunfly-plugin-body-parser
```

2. `config.plugin.ts` 中声明插件

```ts filename="src/config/config.plugin.ts"
const plugins: { [key: string]: string }[] = [
  {
    name: 'bodyParser',
    package: '@yunflyjs/yunfly-plugin-body-parser',
    priority: 5
  },
];
export default plugins;
```

3. `config.default.ts` 配置项 （可选）

```ts filename="src/config/config.default.ts"
// body参数配置
config.bodyParser = {
  jsonLimit: '1mb',
  formLimit: '1mb',
  queryString: {
    parameterLimit: 1 * 1024 * 1024,
  },
};
```

## 使用案例

```ts filename = "src/controller/ExampleController.ts" {8,10}
import { JsonController, BodyParam, Post, Ctx, Context } from '@yunflyjs/yunfly';

@JsonController('/example')
export default class ExampleController {
  @Post('/simple/post')
  simple1(
    @Ctx() ctx: Context,
    @BodyParam('name') name: string,
  ): string {
    const request = ctx.request?.body;
    return request;
  }
}
```

## 参数说明

| 字段 | 类型 | 必填 | 默认值 |说明 |
| ------ | ------ |------ |------ | ------ |
| queryString |  | 否 |  | query 参数限制大小 |
| jsonLimit | `string` | 否 | 1mb | 传输json数据限制大小 |
| textLimit | `string` | 否 | 1mb | 传输text格式限制大小 |
| xmlLimit | `string` | 否 | 1mb | 传输xml格式限制大小 |
| formLimit | `string` | 否 | 1mb | 表单数据限制大小 |
| enableTypes | `json/form/text/xml[]` | 否 | `['json', 'form']` | 表单数据限制大小 |
| encoding | `string` | 否 | utf-8 | 数据格式编码 |

## 参考文档

<https://www.npmjs.com/package/koa-bodyparser#options>
