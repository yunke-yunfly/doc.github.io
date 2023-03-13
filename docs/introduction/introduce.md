---
sidebar_position: 1
---

# 介绍

`Yunfly` 一款 Node.js WEB 框架, 使用 `Typescript` 构建我们的应用。
使用 `Koa2` 做为 HTTP 底层框架, 使用 `routing-controllers` 、 `typedi` 来高效构建我们的 Node 应用。

Yunfly 在 Koa 框架之上提升了一个抽象级别, 但仍然支持 Koa 中间件。在此基础之上, 提供了一套强大的插件系统, 给开发者提供更强大更灵活的能力。

## Yunfly 与 Koa2

`Node.js` 是一个异步的世界, 官方 API 支持的都是 callback 形式的异步编程模型, 这会带来许多问题, 因此社区提供了各种异步的解决方案, 最终胜出的是 Promise。

`async function` 是语言层面提供的语法糖, 在 async function 中, 我们可以通过 await 关键字来等待一个 Promise 被 resolve（或者 reject, 此时会抛出异常）,  Node.js 现在的 LTS 版本（8.x）已原生支持。

```js
const fn = async function() {
  const user = await getUser();
  const posts = await fetchPosts(user.id);
  return { user, posts };
};
fn().then(res => console.log(res)).catch(err => console.error(err.stack));
```

## Koa2

`Koa2` 是一个新的 web 框架，由 Express 幕后的原班人马打造， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。

## Yunfly

`Koa` 是一个非常优秀的框架，然而对于企业级应用来说，它还比较基础。`Yunfly` 使用 `Koa` 做为底层 HTTP 框架, 在其基础上提升了一个抽象级别, 提供了更多的能力与约束规范。

## 框架技术栈

> - `Koa2` node.js http 框架, async await异步编程 [参考文档](https://koa.bootcss.com/)
> - `typescript` 微软开发的自由和开源的编程语言, 它是JavaScript的一个超集, 添加了可选的静态类型和基于类的面向对象编程 [参考文档](https://www.tslang.cn/docs/home.html)
> - `routing-controllers`  使用装饰器的方式来进行koa-router的开发 [参考文档](https://github.com/typestack/routing-controllers#readme)
> - `typedi`: 依赖注入插件工具  [参考文档](https://github.com/typestack/typedi)
> - `grpc`: 一个高性能、开源和通用的 RPC 框架  [参考文档](https://grpc.github.io/grpc/node/index.html)
> - `log4js`: javascript 的 log 日志插件 [参考文档](https://github.com/log4js-node/log4js-node)
