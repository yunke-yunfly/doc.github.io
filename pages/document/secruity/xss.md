# XSS

* XSS（cross-site scripting跨域脚本攻击）攻击是最常见的 Web 攻击。

XSS 攻击一般分为两类：

> * Reflected XSS（反射型的 XSS 攻击）
> * Stored XSS（存储型的 XSS 攻击）

* 反射型

反射型的 XSS 攻击，主要是由于服务端接收到客户端的不安全输入，在客户端触发执行从而发起 Web 攻击。比如：在某购物网站搜索物品，搜索结果会显示搜索的关键词。搜索关键词填入`<script>alert('handsome boy')</script>`, 点击搜索。页面没有对关键词进行过滤，这段代码就会直接在页面上执行，弹出 alert。

* 存储型

基于存储的 XSS 攻击，是通过提交带有恶意脚本的内容存储在服务器上，当其他人看到这些内容时发起 Web 攻击。一般提交的内容都是通过一些富文本编辑器编辑的，很容易插入危险代码。

## 防范

* 防止表单输入的异常，过滤异常信息字段
* 渲染阶段过滤异常信息字段

### 1. 客户端处理

1. 客户端可使用 `js-xss` 进行防范

`js-xss`它有很多辅助函数供我们使用, 这里不做详解, 参考地址： <https://github.com/leizongmin/js-xss>

### 2. 服务端处理

* 安装依赖

```shell
yarn add @yunflyjs/yunfly-plugin-security
```

* 新增安全配置 `security.xss`

* 备注:

> config.xss 是设置的 `X-XSS-Protection` 头信息，HTTP `X-XSS-Protection` 响应头是 `Internet Explorer`，`Chrome` 和 `Safari` 的一个特性，当检测到跨站脚本攻击 `(XSS (en-US))`时，浏览器将停止加载页面
> 它并不能够替代手动的输入输出过滤

```js filename="src/config/config.default.ts" {3-8}
config.security = {
    enable: true,
    xss: {
      enable: true,
      match: [],
      ignore: [],
      value: '1',
    }
}
```

| 字段 | 类型 | 必填 |说明 |
| ------ | ------ |------ | ------ |
| enable | `boolean` | 否 | 是否开启 |
| match | `string[]` | 否 | 需要开启csrf规则的url列表，命中规则为`indexOf`, 值为空则命中所有路由 |
| ignore | `string[]` | 否 | 需要忽略csrf规则的url列表，命中规则为`indexOf` |
| value | `'0' | '1' \| '1;mode=block'` | 否 | xss保护类型 |

参考地址： <https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-XSS-Protection>
