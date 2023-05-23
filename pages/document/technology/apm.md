# elastic-apm

## 概念

`ElasticAPM` 是基于Elastic Stack构建的应用程序性能监视系统，它可以嵌入应用进程内部，实时采集各种运行指标并传输到 [elasticsearch](https://www.elastic.co/cn/) 平台进行聚合统计，通过 [kibana](https://www.elastic.co/guide/cn/kibana/current/production.html#production) 界面端展示应用系统性能处理能力。`node.js` 的官方库为 [elastic-apm-node](https://www.npmjs.com/package/elastic-apm-node), 它提供以下的一些能力：

1. http 请求响应耗时
2. rpc 请求耗时
3. 函数间调用耗时
4. 程序异常抛出
5. 进程CPU，内存使用情况
6. 拦截 http rpc 请求进行参数透传

apm 会对收集到的数据进行图形化展示，把出现性能瓶颈的地方标记出来 ，开发人员定位这些性能问题可以非常便捷，不用再像传统形式那样通过日志记录耗时来一步一步排查。

## 使用

- 安装依赖

```shell
yarn add @yunflyjs/yunfly-plugin-apm
```

增加配置

```js filename="config.default.ts"
config.apm = {
    active: process.env.NODE_ENV === 'production',
    // logLevel: 'fatal',
};
```

> 更多配置参数请参考：<https://www.elastic.co/guide/en/apm/agent/nodejs/current/configuration.html>

## 参数透传

### 参数透传概念

当BFF发起 `RPC` 或 `HTTP` 请求时，某些参数不用一层一层的传递，而是 `BFF` 在直接发起请求时直接使用。

### config 参数透传

可以在 `config` 中配置需要透传的参数，请参考以下案例：

```ts filename="config.default.ts"
import { Context } from '@yunflyjs/yunfly';

config.translate = (ctx: Context, metadata: any) => {
    const cookies = cookie.parse(ctx.headers.cookie || '');
    const orgcode = cookies.orgcode || ctx.headers['orgcode'];
    const appid = cookies.appid || ctx.headers['appid'];

    if (orgcode) { metadata.add('orgcode', orgcode as string); }
    if (appid) { metadata.add('appid', appid as string); }
};
```

### 使用 metadata 函数透传

可以在客户端请求进入之后的任意位置调用 metadata 函数来进行参数透传，请参考以下案例：

- 中间件中透传

```ts filename="middleware/LoggerMiddleware.ts"
import { metadata } from '@yunflyjs/yunfly'

export default class LoggerMiddleware implements KoaMiddlewareInterface {
    async use(context: Context, next: (err?: any) => Promise<any>): Promise<any> {
        // 中间件中使用参数透传能力
        metadata.add('orgcode', 'test-orgcode')
        next();
    }
}
```

- controller 中使用参数透传

```ts filename="controller/TextController.ts"
import { metadata, JsonController, QueryParams, Get } from '@yunflyjs/yunfly'

@JsonController("/test")
export default class TestController {

    @Get("/apm-translate")
    async APMTranslate(
    @QueryParams() orgcode: string 
    ): Promise<string> {
        // 路由中使用参数透传能力
        metadata.add('orgcode', orgcode)
        return 'xxxxxx'
    }
}
```

> apm 还有更多的能力，你可以在使用过程中去挖掘
