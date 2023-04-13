# Hsts

## 说明

> * HTTP Strict Transport Security（通常简称为HSTS）是一个安全功能，它告诉浏览器只能通过HTTPS访问当前资源，而不是HTTP

## 语法

```
Strict-Transport-Security: max-age=<expire-time>
Strict-Transport-Security: max-age=<expire-time>; includeSubDomains
```

| 值  |说明 |
| ------ | ------ |
| `max-age=<expire-time>` | 设置在浏览器收到这个请求后的`<expire-time>`秒的时间内凡是访问这个域名下的请求都使用HTTPS请求。|
| includeSubDomains  | 如果这个可选的参数被指定，那么说明此规则也适用于该网站的所有子域名。|

## 使用

* 安装依赖

```shell
yarn add @yunflyjs/yunfly-plugin-security
```

* 新增安全配置 `security.hsts`

```js filename="src/config/config.default.ts" {3-9}
config.security = {
    enable: true,
    hsts: {
      enable: true,
      maxAge: 15552000,
      includeSubDomains: true,
      match: [],
      ignore: [],
    },
  }
```

## 参数说明

| 字段 | 类型 | 必填 |说明 |
| ------ | ------ |------ | ------ |
| enable | `boolean` | 否 | 是否开启 |
| match | `string[]` | 否 | 需要开启csrf规则的url列表，命中规则为`indexOf`, 值为空则命中所有路由 |
| ignore | `string[]` | 否 | 需要忽略csrf规则的url列表，命中规则为`indexOf` |
| maxAge | `number` | 否 | https访问过期时间（默认：15552000，即：180天） |
| includeSubDomains | `boolean` | 否 | 是否开启子域 |

参考地址： <https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Strict-Transport-Security>
