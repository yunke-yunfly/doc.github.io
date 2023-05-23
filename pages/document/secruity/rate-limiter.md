# 限流

## 说明

* 为了防止流量洪峰时应用的崩溃，我们可以采取限流的方式来保护我们的应用，限流有多种规则

## 限流规则

1. Node.js应用 整体限流，即： 应用在某一段时间内所有接口的总流量限制
2. 具体 path 路径限流， 即： 应用在某一段时间内某个具体的 path 路径的流量限制
3. 具体 path+具体用户限流， 即： 应用在某一段时间内某个 path 单个用户的流量限制

## 使用

1. 安装

```bash
yarn add @yunflyjs/yunfly-plugin-rate-limiter
```

2. 申明插件 **config/config.plugin.ts**

```ts
/**
 * yunfly plugin
 */
const plugins: {[key:string]: string}[] = [
  {
    name: 'rateLimiter',
    package: '@yunflyjs/yunfly-plugin-rate-limiter',
    priority: 6
  }
];
// 
export default plugins;
```

3. 开启配置 **config/config.default.ts**

```js
config.rateLimiter = {
  enable: true,
  match: [],
  ignore: [],
  rules: [
    // 限流规则：对整个应用限流
    {
      threshold: 100,
      pos: 'yunfly-example',
      rule_name: '对整个应用限流'
    },
  ]
}
```

## 参数说明

- interface 

```ts
export interface RateLimiterConfig {
  enable?: boolean;
  match?: string[];
  ignore?: string[];
  type?: 'counter' | 'slideWindow';
  rules?: NeedRateLimiterOption;
}

interface NeedRateLimiterOption {
  threshold: number;
  pos: string;
  rule_name?: string;
  args?: {
    request?: ArgsOption[];
    header?: ArgsOption[];
    cookie?: ArgsOption[];
  };
}
interface ArgsOption {
  key: string;
  value: string;
}
```

### 字段说明

| 字段 | 类型 | 必填 |说明 |
| ------ | ------ |------ | ------ |
| enable | `boolean` | 是 | 是否开启配置 |
| type | `'counter' \| 'slideWindow'` | 否 | 限流规则算法 counter：计数器  slideWindow：滑动窗口 （默认值：slideWindow，推荐使用slideWindow）|
| match | `string[]` | 否 | 需要开启csrf规则的url列表，命中规则为`indexOf`, 值为空则命中所有路由 |
| ignore | `string[]` | 否 | 需要忽略csrf规则的url列表，命中规则为`indexOf` |
| rules | `NeedRateLimiterOption[]` | 否 | 限流规则 |


### rules 字段说明

| 字段 | 类型 | 必填 |说明 |
| ------ | ------ |------ | ------ |
| threshold | `number` | 是 | 限流大小（单机qps） |
| pos | `string` | 是 | 命中规则：1. Node.js 应用限流，应用名为项目package.name字段 2.path路由限流  |
| args | `Object` | 否 | 限流附加命中规则，最多6条，规则之间为且关系 |
| args.request | `ArgsOption[]` | 否 | 通过query或body参数进行命中（header,cookie同理） |
| args.request.key | `string` | 否 | 命中key标识 |
| args.request.value | `string` | 否 | 命中标识的value值（当前只支持等于） |

## 流控规则说明

| 字段  | 是否重要| 说明 |
| ------ | ------ | ------ |
| 规则名称  | `否`| 名称标识  |
| 资源类型  | `是` |  BFF支持`应用级别`限流、`api路径级别` 和 `用户级别`限流 |
| 资源名称  | `是` |  当类型为HTTP路由时，需要字节填写`api限流地址` |
| 匹配条件  | `否` |  支持`header`,`cookie`,`request` 三种字段匹配（匹配模式： 全匹配） |
| 阀值类型  | `是` |  固定为`QPS` |
| 单机QPS阀值  | `是` |  每秒请求量，（多线程时，实际的限制值是: `QPS/线程数`） |

## 应用级别限流

```ts
config.rateLimiter = {
  enable: true,
  rules: [
    // 当 yunfly-example 应用qps大于100时限流生效
    {
      threshold: 100,
      pos: 'yunfly-example',
      rule_name: '对整个应用限流'
    },
  ]
}
```

## api路径级别限流

```ts
config.rateLimiter = {
  enable: true,
  rules: [
    // 当path为/api/project/details且header头中有name=zhangshan qps大于10时限流生效
    {
      threshold: 10,
      pos: '/api/project/details',
      rule_name: '对某个具体path限流'
      args: {
        header: [
          {
            key: 'name',
            value: 'zhangshan'
          }
        ];
      };
    }
  ]
}
```

## 用户级别限流

```ts
config.rateLimiter = {
  enable: true,
  rules: [
    // 当path为/api/project/details 且用户级别qps大于10时限流生效
    {
      threshold: 10,
      pos: '/api/project/details',
      rule_name: '对某个具体path用户级别限流'
      args: {
        header: [
          {
            key: 'x-rate-limiter-user',
            value: '*'
          }
        ];
      };
    }
  ]
}
```

### 获取用户标识

默认情况下通过用户 `IP` 来识别用户。

### 自定义用户标识

通过 `IP` 识别用户会有**不精准的问题**，为了解决此问题支持用户自定义用户标识。

* 通过 `x-rate-limiter-key` 来自定义用户标识， 支持 `header`, `cookie`, `Request`。

* 用户标识获取优先级规则

1. 优先取 HTTP请求的header头独立用户标识字段（`x-rate-limiter-key`），
2. 其次取 Cookie请求头中的（`x-rate-limiter-key`）
3. 再次取 Request 参数中的（`x-rate-limiter-key`）
4. 最后取 用户的 `IP` 字段

## 多条规则命中优先级说明

1. 有多个规则生效时，谁先生效则限流生效
2. 多个规则之间相互独立，不互相清零

## 动态变更，规则实时生效

配置化的限流规则是不够灵活的，对业务来说不能实时生效，基于此插件提供动态更新的 api

- 动态更新规则

```ts
import { updateRateLimiterRules } from '@yunflyjs/yunfly-plugin-rate-limiter'

// 例如：EtchChange为规则变更监听函数，当规则变更时通过 updateRateLimiterRules api 实时更新限流规则
EtchChange().then((data: NeedRateLimiterOption)=>{
  updateRateLimiterRules(data)
})
```
