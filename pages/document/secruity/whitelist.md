---
sidebar_position: 2
---

# Whitelist

BFF 允许的域名白名单, 过滤掉不允许的域名

## 使用

- 安装依赖

```shell
yarn add @yunflyjs/yunfly-plugin-security
```

- 新增安全配置 `security.whitelist`

```js filename="src/config/config.default.ts" {3-6}
config.security = {
  enable: true,
  whitelist: {
    enable: true,
    values: ['www.baidu.com'],
  },
};
```

## 参数说明

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| enable | `boolean` | 否 | 是否开启 |
| values | `string[]` | 否 | 允许通过的 域名  （'*'代表运行所有，'localhost'和'127.0.0.1'不需要添加） |
