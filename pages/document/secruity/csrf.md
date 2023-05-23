# CSRF

## CSRF常用的防范方案

> * 通过响应页面时将 token 渲染到页面上，在 form 表单提交的时候通过隐藏域提交上来。
> * 将 token 设置在 Cookie 中，在提交请求时提交 Cookie，并通过 header 或者 body 带上 Cookie 中的 token，服务端进行对比校验。

## 使用

### 服务端

* 安装依赖

```shell
yarn add @yunflyjs/yunfly-plugin-security
```

* 新增安全配置 `security.csrf`

```js filename="src/config/config.default.ts" {3-12}
config.security = {
    enable: true,
    csrf: {
        enable: true,
        match: [],
        ignore: [],
        ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
        keyName: 'x-csrf-token',
        bodyName: '_csrf',
        saltLength : 8,
        secretLength: 18,
    }
}
```

## 参数说明

| 字段 | 类型 | 必填 |说明 |
| ------ | ------ |------ | ------ |
| enable | `boolean` | 否 | 是否开启 |
| match | `string[]` | 否 | 需要开启csrf规则的url列表，命中规则为`indexOf`, 值为空则命中所有路由 |
| ignore | `string[]` | 否 | 需要忽略csrf规则的url列表，命中规则为`indexOf` |
| ignoreMethods | `string[]` | 否 | 需要忽略csrf规则的请求类型，命中规则为`includes` |
| keyName | `string` | 否 | 获取验证`touken`值的`header key`名或`cookie key`名 |
| bodyName | `string` | 否 | 如果token通过参数传值时，定义的key名称 |
| saltLength | `number` | 否 | 盐值长度（一般默认即可） |
| secretLength | `number` | 否 | 加密密钥长度（一般默认即可） |

### 客户端

* 客户端在`进入页面`或者`表单提交`时调用 `/csrf/token` 接口去获得 token。

```js
// 获取token地址
/csrf/token

// 例如 bff-example 项目的接口地址为
http://127.0.0.1:3000/csrf/token
```

备注：
>
> * 调用 api 成功之后，会默认的向页面注入 key 为 `csrf.keyName` 的 cookie 字段。
> * 调用 api 成功之后，在body中也会返回 token 字段。

## 注意事项

> * 每次页面刷新时需要重新调用接口刷新 token
> * 切换用户时需要重新调用接口刷新 token
