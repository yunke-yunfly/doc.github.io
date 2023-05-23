# CSP

## 说明

> HTTP 响应头Content-Security-Policy允许站点管理者控制用户代理能够为指定的页面加载哪些资源。除了少数例外情况，设置的政策主要涉及指定服务器的源和脚本结束点。这将帮助防止跨站脚本攻击（Cross-Site Script）.

## 语法

```js
Content-Security-Policy: <policy-directive>; <policy-directive>
```

## 指令

| 指令名称  |说明 |
| ------ | ------ |
| child-src | 为 web workers 和其他内嵌浏览器内容（例如用`<frame>`和`<iframe>`加载到页面的内容）定义合法的源地址。|
| connect-src  | 限制能通过脚本接口加载的URL。|
| default-src  | 为其他取指令提供备用服务fetch directives。|
| font-src  | 设置允许通过@font-face加载的字体源地址。|
| frame-src  | 设置允许通过类似`<frame>`和`<iframe>`标签加载的内嵌内容的源地址。|
| img-src  |限制图片和图标的源地址 |
| media-src  |限制通过`<audio>`、`<video>`或`<track>`标签加载的媒体文件的源地址。 |
| script-src  | 限制JavaScript的源地址。 |
| style-src  | 限制层叠样式表文件源。 |

## 使用

- 安装依赖

```shell
yarn add @yunflyjs/yunfly-plugin-security
```

- 新增安全配置 `security.csp`

```js filename="src/config/config.default.ts" {3-12}
config.security = {
    enable: true,
    csp: {
      enable: false,
      reportOnly: false,
      directives:{
        'connect-src': ['http://127.0.0.1:3000','https://baidu.com'],
        'default-src': ['self','http://example.com'] 
      },
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
| reportOnly | `boolean` | 否 | 使用 Content-Security-Policy-Report-Only 指令  |
| directives | `DirectivesConfig` | 否 | 指令规则 (值为`key->value`对象类型，value是`string[]`类型) |

备注：
>
> - csp 相对于来说配置比较繁杂，规则也比较严格。
> - 在云客现有BFF的使用场景下，它的适用度不高，它的主要使用场景是加载页面时使用，如果只是使用于常规的接口请求并不需要进行配置。

更多指令请参考：<https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy>
