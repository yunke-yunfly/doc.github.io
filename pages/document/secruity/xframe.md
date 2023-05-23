# Xframe

## 原理说明

> * X-Frame-Options HTTP 响应头是用来给浏览器 指示允许一个页面 可否在 `<frame>`, `<iframe>`, `<embed>` 或者 `<object>` 中展现的标记。站点可以通过确保网站没有被嵌入到别人的站点里面，从而避免 clickjacking 攻击。

* X-Frame-Options 有三个可能的值

```js
X-Frame-Options: deny
X-Frame-Options: sameorigin
X-Frame-Options: allow-from https://example.com/
```

| 值  |说明 |
| ------ | ------ |
| deny | 表示该页面不允许在 frame 中展示，即便是在相同域名的页面中嵌套也不允许|
| sameorigin | 表示该页面可以在相同域名页面的 frame 中展示|
| allow-from uri | 表示该页面可以在指定来源的 frame 中展示|

## 使用

* 安装依赖

```shell
yarn add @yunflyjs/yunfly-plugin-security
```

* 新增安全配置 `security.xframe`

```js filename="src/config/config.default.ts" {3-8}
config.security = {
    enable: true,
    xframe: {
      enable: true,
      value: 'sameorigin',
      match: [],
      ignore: [],
    }
  }
```

## 参数说明

| 字段 | 类型 | 必填 |说明 |
| ------ | ------ |------ | ------ |
| enable | `boolean` | 否 | 是否开启 |
| match | `string[]` | 否 | 需要开启csrf规则的url列表，命中规则为`indexOf`, 值为空则命中所有路由 |
| ignore | `string[]` | 否 | 需要忽略csrf规则的url列表，命中规则为`indexOf` |
| value | `string` | 否 | 值为：`deny/sameorigin/allow-from uri` |

参考地址： <https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-Frame-Options>
