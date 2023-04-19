# 参数透传

## 概念

通常场景下，当我们的应用有发起 `RPC` 或 `HTTP` 请求时，请求参数会从 `Middleware` -> `Controller` -> `Service` -> `HTTP` | `RPC` 逐层传递。

**参数透传概念**：参数的传递直接忽略某几层的传递，直达最终的 `RPC` 或者 `HTTP`层。而不用中间一层一层传递。

```ts
// 从 controller 直达 grpc
Controller -> GRPC

// 从 middleware 直达 grpc
Middleware -> GRPC
```

## 使用

### 前提

参数透传依赖 `currentContext` 能力。需要确保 `currentContext` 配置已启用。

```ts filename="src/config/config.default.ts" {2}
config.currentContext = {
    enable: true // 默认值：false
};
```

### 透传方式

当前模式下支持以下1种透传模型：

- 局部透传

在 `Controller、Service、middleware、util` 等位置注入 `metadata`，可通过 `@yunflyjs/yunfly` 暴露的 `metadata` 对象添加透传参数。

#### Controller 中透传

```ts filename="src/controller/SomeController.ts"
import { Get, metadata } from '@yunflyjs/yunfly'

// 案例：Controller中使用
class SomeController {

  Get('/user')
  async getUser() {
    // 通过 metadata.add 添加
    // highlight-start
    metadata.add('name','zane');
    // highlight-end
    // 
    return true;
  }
}
```

#### Middleware 中透传

```ts filename="src/middleware/ExampleMiddleware.ts"
import { KoaMiddlewareInterface, Context, metadata } from "@yunflyjs/yunfly";

export class MyMiddleware implements KoaMiddlewareInterface {
    async use(context: Context, next: (err?: any) => Promise<any>): Promise<any> {
        // 从 JWT 中获取 appid 参数
        const { appid } = context.state.payload || {};
        // 添加 metadata
        metadata.add('addid',appid);
        await next()
    }
}
```

#### Util 函数中透传

```ts filename="src/middleware/ExampleMiddleware.ts"
import { metadata } from "@yunflyjs/yunfly";

export function AddMetadata () {
  const { appid } = getMetadataFromService();
  metadata.add('appid',appid);
}
```
