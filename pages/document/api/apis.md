# Api

## 辅助方法

### isProduction

判断是否是生产环境, 通过 NODE_ENV 来判断, NODE_ENV 只有 dev 和 production 两个值

```ts
import { isProduction } from '@yunflyjs/yunfly'

const isprod = isProduction();
```

### deepMerge

深度合并两个对象，可以合并 object 与 array

```ts
import { deepMerge } from '@yunflyjs/yunfly'

const x = {
    foo: { bar: 3 },
    array: [{
        does: 'work',
        too: [ 1, 2, 3 ]
    }]
}
 
const y = {
    foo: { baz: 4 },
    quux: 5,
    array: [{
        does: 'work',
        too: [ 4, 5, 6 ]
    }, {
        really: 'yes'
    }]
}
 
const output = {
    foo: {
        bar: 3,
        baz: 4
    },
    array: [{
        does: 'work',
        too: [ 1, 2, 3 ]
    }, {
        does: 'work',
        too: [ 4, 5, 6 ]
    }, {
        really: 'yes'
    }],
    quux: 5
}
 
deepMerge(x, y) // => output
```

### getPackageJson

获得项目 package.json 信息

```ts
import { getPackageJson } from '@yunflyjs/yunfly'

const projectName = getPackageJson().name;
```

### getCpusLength

获得容器下的 cpu 个数，测试环境下默认 4 个

```ts
import { getCpusLength } from '@yunflyjs/yunfly'

cosnt cpuLength = getCpusLength();
```

### randomString

获得一个随机数

```ts
import { randomString } from '@yunflyjs/yunfly'

// 获得一个12位数的随机字符串
const randomStr = randomString(12);
```

### firstWordToUpperCase

第一个单词大写

```ts
import { firstWordToUpperCase } from '@yunflyjs/yunfly'

firstWordToUpperCase('abCd') // => Abcd
```

### getDirPaths

获得某个目录下的文件列表，排除 .d. 文件

```ts
import { getDirPaths } from '@yunflyjs/yunfly'
import * as path from 'path'

getDirPaths(path.join(__dirname, './controllers'))
```

## routing-controllers apis

`yunfly` 默认导出了所有 routing-controllers 的 api, 因此所有 routing-controllers 的 api 都可以从 yunfly 中导入

```ts filename="ExampleController.ts"
import { Get, JsonController, QueryParam } from '@yunflyjs/yunfly';

@JsonController('/example')
export default class ExampleController {
    @Get('/test')
    async test(
        @QueryParam("name") name: string,
        @QueryParam("orgcode") orgcode: string
    ): Promise<types.example.Response | undefined> {
        return {
            name,
            orgcode
        };
    }
}
```

> 更多 routing-controllers api 请参考：<https://www.npmjs.com/package/routing-controllers>

## typedi apis

`yunfly` 默认导出了所有 typedi 的 api, 因此所有 typedi 的 api 都可以从 yunfly 中导入

```ts filename="ExampleController.ts"
import { Get, JsonController, QueryParam, Inject } from '@yunflyjs/yunfly';
import Example from "../service/Example";

@JsonController('/example')
export default class ExampleController {
    @Inject() private example: Example;

    @Get('/test')
    async test(
        @QueryParam("name") name: string,
        @QueryParam("orgcode") orgcode: string
    ): Promise<types.example.Response | undefined> {
       return await this.example.doSomething(name, orgcode);
    }
}
```

> 更多 typedi api 请参考： <https://docs.typestack.community/typedi/>

## errors api

### BadRequestError

参数错误, HTTP 状态码:400

```ts
import { BadRequestError } from '@yunflyjs/yunfly';

throw BadRequestError()
```

### UnauthorizedError

用户未登录, HTTP 状态码: 401

### ForbiddenError

用户无权限, HTTP 状态码: 403

### NotFoundError

用户无权限, HTTP 状态码: 404

### MethodNotAllowedError

方法不允许, HTTP 状态码: 405

### TooManyRequestsError

过多请求, HTTP 状态码: 429

### InternalServerError

代码不严谨导致的服务器错误, HTTP 状态码: 500

### BadGatewayError

网关错误, HTTP 状态码: 502

### ServiceUnavailableError

服务不可用, HTTP 状态码: 503

### GatewayTimeoutError

网关超时, HTTP 状态码: 504

### RpcError

RPC 错误, HTTP 状态码: 500 , code 码：code 由 go 返回的决定，默认值是 -1

### YunflyError

yunfly 框架自身异常, HTTP 状态码: 500 , code 码：10000 ~ 1099

### ApolloError

Apollo 错误 , HTTP 状态码: 500 , code 码：10100 ~ 10199

### RedisError

Redis 错误 , HTTP 状态码: 500 , code 码：10200 ~ 10299

### EctdError

ECTD 错误 , HTTP 状态码: 500 , code 码：10300 ~ 10399

### MysqlError

 Mysql 错误 , HTTP 状态码: 500 , code 码：10400 ~ 10499

### MongoDBError

MongoDB 错误 , HTTP 状态码: 500 , code 码：10500 ~ 10599
