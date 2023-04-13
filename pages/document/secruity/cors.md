---
sidebar_position: 8
---

# CORS

## 说明

> 当使用XMLHttpRequest从其他域名中获取资源进行跨域通信时使用, 主要设置HTTP头部信息字段。

```js
Access-Control-Allow-Origin: http://www.example.com
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: X-TRICORDER
Access-Control-Max-Age: 1728000
Access-Control-Expose-Headers: Server-Authorization
```

## 使用

* 新增安全配置 `security.cors`

* 安装依赖

```shell
yarn add @yunflyjs/yunfly-plugin-security
```

```js filename="src/config/config.default.ts" {3-16}
config.security = {
    enable: true,
    cors: {
      enable: false,
      origin: () => {
        return "https://xxx.com/";
      },
      maxAge: 3600,
      credentials: true,
      exposeHeaders: [],
      allowMethods: ['GET', 'POST', 'OPTIONS'],
      allowHeaders: [
        'Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'x-csrf-token','x-rate-limiter-key',
        'x-rate-limiter', 'trace-branch', 'Cookie', "token",'x-timestamp','x-autho-token','trace-id'
      ],
    },
  }
```

## 参数说明

| 字段 | 类型 | 必填 |说明 |
| ------ | ------ |------ | ------ |
| enable | `boolean` | 否 | 是否开启 |
| origin | `string/function` | 否 | 域名规则 |
| maxAge | `number` | 否 |  |
| credentials | `boolean` | 否 | 是否允许携带cookie（备注：origin字段为具体域名时生效） |
| allowMethods | `string[]` | 否 | 允许的请求协议 |
| allowHeaders | `string[]` | 否 | 允许Request的 Header头信息 |
| exposeHeaders | `string[]` | 否 | 允许暴露给浏览器的Header头信息 |

参考地址：<https://www.npmjs.com/package/koa2-cors>
