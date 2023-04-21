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

## 前置条件

参数透传依赖 `currentContext` 能力。需要确保 `currentContext` 已启用，[安装并启用currentContext插件](./context#使用)。

## 使用

### 透传 Api

透传支持以下 Api

```ts
import { metadata } from '@yunflyjs/yunfly-plugin-current-context'

// 获取单个字段
metadata.get('xxx'); => any[]

// 获取所有 metadata 信息
metadata.getMap('xxx'); => {[props:string]: any}

// 设置某个字段的值
metadata.set('xxx','xxx'); => void

// 给某个字段push值
metadata.add('xxx','xxx'); => void

// 删除metadat字段
metadata.remove('xxx','xxx'); => void
```

### 参数透传案例

#### Controller 中透传

```ts filename="src/controller/SomeController.ts" {10-20}
import { Get } from '@yunflyjs/yunfly'
import { metadata } from '@yunflyjs/yunfly-plugin-current-context'

// 案例：Controller中使用
class SomeController {

  Get('/user')
  async getUser() {
    // 通过 metadata.add 添加
    metadata.add('name','zhang'); 
    console.log(metadata.get('name')); // ['zhang']

    metadata.add('name','san'); 
    console.log(metadata.get('name')); // ['zane','san']

    metadata.set('name','lisi'); 
    console.log(metadata.get('name')); // ['lisi']

    metadata.remove('name'); 
    console.log(metadata.get('name')); // undefined

    return true;
  }
}
```

#### Middleware 中透传

```ts filename="src/middleware/ExampleMiddleware.ts" {9}
import { KoaMiddlewareInterface, Context } from "@yunflyjs/yunfly";
import { metadata } from '@yunflyjs/yunfly-plugin-current-context'

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

```ts filename="src/middleware/ExampleMiddleware.ts" {5}
import { metadata } from '@yunflyjs/yunfly-plugin-current-context'

export function AddMetadata () {
  const { appid } = getMetadataFromService();
  metadata.add('appid',appid);
}
```
