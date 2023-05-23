# yundoc

## 介绍

一款通过 `routing-controllers` 注解生成 `OpenAPI` 数据的插件。

它提供以下能力：

> 1. `typescript` 类型转换为 `jsonschema` 数据
> 2. `routing-controllers` 注解转换为 `openapi` 数据
> 3. `openapi` 转换为 `typescript` 代码

## 使用

### 安装依赖

```bash
yarn add @yunflyjs/yundoc --dev
```

### 新增 script 命令

```json
// 仅仅本地生成openapi文档数据
"yundoc": "yundoc",

// 本地生成openapi数据的同时生成Request代码
"yundoc": "yundoc --api",
```

- `yundoc` 命令行参数说明

  | 字段  |说明 |
  | ------  |------ |
  | push |  生成 `openapi` 数据之后动态更新到 `middleman` 文档平台 |
  | api | 生成 `openapi` 数据之后动态生成前端 `request` 代码 |

### 配置 `yundoc.config.js` 文件 【可选】

```ts filename="yundoc.config.js"
  /** 
   * yundoc 生成api文档配置项
  */
  const path = require('path');
  module.exports = {
    routePrefix: '/api', // 此处请跟你routing-controllers保持一致
    controllers: [path.join(process.cwd(), "./src/controller/*")],
    filterFiles: [],
    requiredType: 'typescript', // typescript | routing-controllers
    servers: [
      {
        url: 'http://127.0.0.1:3000',
        description: '开发环境域名前缀',
      }
    ],
    // 是否根据生成结果生成前端请求代码和类型定义
    // 此参数在 --api 下生效
    genApi: {
        // 输出目录，一般指向 bff 对应的前端项目 src/api 这样的目录
        outputDir: path.join(__dirname, './api'),
        // 支持自定义 axios，必须使用 export default 导出 axios 或其实例
        // axiosFilePath: path.join(__dirname, './utils/request'),
        // 是否需要生成 header 相关参数（默认不开启，header 推荐在 axios 拦截器全局处理）
        header: false,
        // 是否需要生成 cookie 相关参数（默认不开启，cookie 推荐在 axios 拦截器全局处理） 
        cookie: false,
        // prettier 配置文件，用于格式化生成结果
        // prettierConfig: path.join(__dirname, '../xxx/.prettierrc')
    },
    // 自定义 response 返回结构
    // 若不需要自定义外层数据结构则屏蔽此参数
    responseSchema: {
        additionalProperties: false,
        type: 'object',
        properties: {
            code: {
            type: "number",
                description: "接口返回code码字段",
            },
            // data配置必填，格式固定请不要更改
            data: {
                $ref: "#Response",
            },
            msg: {
                type: "string",
                description: "接口返回信息字段",
            }
        },
        required: [
            "code",
            "data",
        ]
    }
  }
```

- 参数说明

| 字段 | 类型 | 必填 |说明 |
| ------ | ------ |------ |------ |
| routePrefix | `string` | 否 | 路由前缀，跟 `routing-controllers保持一致` |
| controllers | `string\|string[]` | 否 | 需要解析的controller文件或需要解析的controller文件夹，默认：`/src/controller/*`，可根据文件名匹配，例如: `/src/**/*Controller.ts`，备注： 必须是绝对路径 |
| requiredType | `typescript \| routing-controllers` | 否 | controller`参数必填`模式，默认使用 `typescript` |
| filterFiles | `string[]` | 否 | 过滤解析的npm包或者ts文件，例如：`grpcObj,serviceWrapper,getGrpcClient` |
| outfile | `string` | 否 | openapi数据存放文件，备注：必须是绝对路径 |
| servers | `{url：string,description?:string}[]` | 否 | api根路由与描述 |
| responseSchema | `ResponseSchemaObject` | 否 | 返回数据包裹层数据格式，由于大部分BFF使用了内置的返回包裹，在controller级别无法解析，因此开发给使用方进行自定义。|
| genApi | `GenApiConfig` | 否 | 根据 `BFF` `Controller` 自动生成前端 `Request` 代码 |

- responseSchema 参数说明
responseSchema`严格遵循 JsonSchema 数据格式`

| 字段 | 类型 | 必填 |说明 |
| ------ | ------ |------ |------ |
| additionalProperties | `boolean\|{[key:string]:any}` | 是 | 表示能否出现除schema定义之外属性,若不填写，则生成的ts属性下会添加`[k:string]:any` |
| type | `string` | 是 | 值为`object`，固定值不要更改（描述当前schema数据类型） |
| properties | `{[prop:string]: {type?:string;$ref?:string;description?:string}}` | 否 | 当前对象的属性描述信息。 |
| required | `string[]` | 否 | 描述当前`object`的必填字段，若无必填字段则不需要此参数 |

- properties 字段描述

| 字段 | 类型 | 必填 |说明 |
| ------ | ------ |------ |------ |
| type | `string` | 是 | 此处type只需要填写简单类型，例如：`string`,`number`,`boolean` |
| $ref | `string` | 是 | 此处为固定值：`#Response`, 不要更改 |
| description | `string` | 否 | 当前字段描述信息 |

备注： properties 中 `$ref` 和 `type` 必须有一项为真。

- genApi 字段描述 `--api` 模式下生效  

```ts
// 配置案例
{
    // 输出目录，一般指向 bff 对应的前端项目 src/api 这样的目录
    outputDir: path.join(__dirname, './api'),
    // 支持自定义 axios，必须使用 export default 导出 axios 或其实例
    // axiosFilePath: path.join(__dirname, './utils/request'),
    // 是否需要生成 header 相关参数（默认不开启，header 推荐在 axios 拦截器全局处理）
    header: false,
    // 是否需要生成 cookie 相关参数（默认不开启，cookie 推荐在 axios 拦截器全局处理） 
    cookie: false,
    // prettier 配置文件，用于格式化生成结果
    // prettierConfig: path.join(__dirname, '../xxx/.prettierrc')
}
```

| 字段 | 类型 | 必填 |说明 |
| ------ | ------ |------ |------ |
| outputDir | `string` | 是 | 前端 `Request` 代码生成之后的存放目录（推荐填写对于的前端应用目录） |
| axiosFilePath | `string` | 否 | 自定义 `axios` 文件地址，自定义 `axios` 文件时,必须使用 `export default` 导出 `axios` 或其实例 |
| header | `boolean` | 否 | 是否需要生成 `header` 相关参数（默认不开启，`header` 推荐在 `axios` 拦截器全局处理） |
| cookie | `boolean` | 否 | 是否需要生成 `cookie` 相关参数（默认不开启，`cookie` 推荐在 `axios` 拦截器全局处理）  |
| prettierConfig | `string` | 否 | prettier 配置文件，用于格式化生成结果 |

### `.gitignore` 文件中屏蔽 `openapi` 文件夹

## 注解,类型支持说明

[注解,类型支持参考链接](https://github.com/yunke-yunfly/routing-controllers-to-openapi/blob/master/DOCS.md)

## 贡献

本库所依赖的解析库 `routing-controllers-to-openapi` 已进行开源（[Github 地址](https://github.com/yunke-yunfly/routing-controllers-to-openapi)），若小伙伴在使用途中有问题，可以提 `issue` 或 `PR`，欢迎各位小伙伴共建。
