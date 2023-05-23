---
sidebar_position: 3
---

# Methods

BFF 允许的请求 methods, 过滤掉不允许的请求类型

## 使用

- 安装依赖

```shell
yarn add @yunflyjs/yunfly-plugin-security
```

- 新增安全配置 `security.methods`

```js filename="src/config/config.default.ts" {3-6}
config.security = {
    enable: true,
    methods: {
        enable: true,
        values: ['GET','POST','OPTIONS'],
    }
}
```

## 参数说明

| 字段 | 类型 | 必填 |说明 |
| ------ | ------ |------ | ------ |
| enable | `boolean` | 否 | 是否开启 |
| values | `Array<'CONNECT'\|'DELETE'\|'GET'\|'HEAD'\|'OPTIONS'\|'PATCH'\|'POST'\|'PUT'\|'TRACE'>` | 否 | 允许的methods类型 （默认值：['GET','POST','OPTIONS']）|
