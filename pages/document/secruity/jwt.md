# JWT

## JWT是什么

`JSON Web Token (JWT)`是一个开放标准(RFC 7519)，它定义了一种紧凑的、自包含的方式，用于作为JSON对象在各方之间安全地传输信息。该信息可以被验证和信任，因为它是数字签名的。

## 什么时候你应该用JWT

* Authorization (授权) : 这是使用JWT的最常见场景。一旦用户登录，后续每个请求都将包含JWT，允许用户访问该令牌允许的路由、服务和资源。单点登录是现在广泛使用的JWT的一个特性，因为它的开销很小，并且可以轻松地跨域使用。

* Information Exchange (信息交换) : 对于安全的在各方之间传输信息而言，JSON Web Tokens无疑是一种很好的方式。因为JWT可以被签名，例如，用公钥/私钥对，你可以确定发送人就是它们所说的那个人。另外，由于签名是使用头和有效负载计算的，您还可以验证内容没有被篡改。

## 使用

> 若需要使用 JWT , 需要自行安装 `@yunflyjs/yunfly-plugin-jwt` 插件

```js filename="src/config/config.default.ts"
config.jwt = {
  enable: true,
  expiredPassThrough: true,
  secret:'EXAMPLE_TOKEN_V1',
  expire: '1h',
  token: { 
    type: 'cookie', 
    key: 'Authorization', 
    httpOnly: true, 
    domain:'127.0.0.1', 
    path:'/',
    // 20分钟后过期
    expires: () => { return new Date(Date.now() + 60 * 1000 * 20) }, 
  },
  // token: { type:'header', key: 'Authorization' },
  rsSign: {
    enable: false,
    interval: 15,
  },
  unless: ['/favicon.ico'],
  global: true,
  passThrough: false,
}
```

* `jwt.config` 还可以是一个函数

```ts filename="src/config/config.default.ts"
type JWTConfig = JWTOptions | ((ctx: Context) => JWTOptions)

config.jwt = (ctx: Context) => {
  return {
    nable: true,
    expiredPassThrough: true,
    secret:'EXAMPLE_TOKEN_V1',
    expire: '1h',
    ......
  }
}
```

## 配置说明

| 参数 | 类型 | 默认值 |必填 | 说明 |
| ------ | ------ | ------ | ------ | ------ |
| enable | `boolean` |  `true`  | 是 | 是否启用 JWT 校验 |
| secret | `string` |  `EXAMPLE_TOKEN_V1` | 是 | JWT 盐值 |
| expiredPassThrough | `boolean` |  `true`  | 否 | 当`JWT`过期时是`自动重签`还是向外`抛出过期错误`。自动重签会一直不过期，抛出过期错误需要自定义错误处理逻辑 |
| expire | `string \| number`| `3h` |  否  | 过期时间 Eg: 60, "2 days", "10h", "7d".  ("120" is equal to "120ms"). |
| token | `JWTTokenOptions` |  `{ type:'header', key: 'Authorization' }` |  否  | token配置项 (重要参数，请关注下面说明。)|
| rsSign | `RsSignOptions` |  `{ enable: false, interval: 15 }` |  否  |自动续签,`interval`单位为分，默认为15分钟。若开启，当判断过期时间是否快超过`interval`分钟， 如果快超过就重新生成JWT秘钥。若`expire`小于等于`interval`则不处理|
| global | `boolean` | `true` | 否 |   是否全局启用 JWT 校验 (重要参数，请关注下面说明。) |
| unless | `string[]` | `['/favicon.ico']` | 否  | { gobbal:true }时，此参数可用，需要排除 JWT 验证的接口 |
| passThrough | `boolean` | `false`| 否  | { gobbal:true }时，此参数可用，校验不通过时是否继续执行 |

## token 参数说明

token 表示 JWT 参数传递方式，目前有两种方式进行传递

* 1、 通过 `header` 头进行校验
* 2、 通过 `cookie` 进行校验

| 参数 | 类型 | 必填 | 说明 |
| ------ | ------ | ------ | ------ |
| type | `header | cookie` | 是 | 参数传递方式 |
| key | `string` | 是 | JWT 校验的 key 值 |
| httpOnly | `boolean` | 否 | type:cookie 时有效 |
| domain | `boolean` | 否 | type:cookie 时有效 |
| path | `string[]` | 否 | type:cookie 时有效 |
| maxAge | `number` | 否 | type:cookie 时有效, 一个数字, 表示从 Date.now() 得到的毫秒数 |
| expires | `Date \| ()=>Date` | 否 | type:cookie 时有效, 一个 Date 对象, 表示 cookie 的到期日期 (默认情况下在会话结束时过期) 或者[函数，返回一个Data对象] |
| secure | `boolean` | 否 | type:cookie 时有效, 一个布尔值, 表示 cookie 是否仅通过 HTTPS 发送 (HTTP 下默认为 false, HTTPS 下默认为 true) |
| sameSite | `boolean  \|  string` | 否 | type:cookie 时有效, 一个布尔值或字符串, 表示该 cookie 是否为 "相同站点" cookie (默认为 false). 可以设置为 'strict', 'lax', 'none', 或 true (映射为 'strict') |
| signed | `boolean` | 否 | type:cookie 时有效, 一个布尔值, 表示是否要对 cookie 进行签名 (默认为 false). 如果为 true, 则还会发送另一个后缀为 .sig 的同名 cookie, 使用一个 27-byte url-safe base64 SHA1 值来表示针对第一个 Keygrip 键的 cookie-name=cookie-value 的哈希值. 此签名密钥用于检测下次接收 cookie 时的篡改 |
| overwrite | `boolean` | 否 | type:cookie 时有效, 一个布尔值, 表示是否覆盖以前设置的同名的 cookie (默认是 false). 如果是 true, 在同一个请求中设置相同名称的所有 Cookie（无论路径或域）是否在设置此Cookie 时从 Set-Cookie 消息头中过滤掉 |

## global 参数说明

`golbal` 是一个比较重要的参数，参数类型为 `boolean`

* `global = true`
当`global`值为`true`时，则表示当前`node服务`所有`controller接口`都进行`jwt校验`。 `global`参数通常跟 `unless`一起配合使用。`unless`参数表示需要排除jwt校验的controller接口。

* `global = false`
当`global`值为`false`时, 则表示不进行全局使用，此时我们就需要手动进行引入使用。

* 手动使用

```ts filename="src/controller/JWTController.ts" {5,10}
import { Post, UseBefore } from "@yunflyjs/yunfly";
import { JWTMiddleware, JWTPassThroughMiddleware } from '@yunflyjs/yunfly/build/middleware/JWTMiddleware'

@JsonController('/user')
@UseBefore(JWTMiddleware)  //controller手动使用jwt
export default class JWTController {
  @Inject()  private userService: UserService;
  // 
  @Post('/get-user-info')
  @UseBefore(JWTMiddleware) //具体方法手动使用jwt
  async getUserMsg()Promise<any> {
    return {}
  }
}
```

## passThrough 参数说明

* `passThrough = false`

当 JWT 校验不通过时，直接抛出错误，并阻止后面的程序运行。

* 等同于手动方式的 `JWTMiddleware`

```ts filename="src/controller/JWTController.ts" {4,8}
import { Post, UseBefore } from "@yunflyjs/yunfly";
import { JWTMiddleware } from '@yunflyjs/yunfly/build/middleware/JWTMiddleware'
@JsonController('/user')
@UseBefore(JWTMiddleware)  //controller手动使用jwt
export default class JWTController {
  // 
  @Post('/get-user-info')
  @UseBefore(JWTMiddleware) //具体方法手动使用jwt
  async getUserMsg()Promise<any> {
    return {}
  }
}
```

* `passThrough = true`

当 JWT 校验不通过时，继续执行后面的逻辑, 不阻塞流程。

* 等同于手动方式的 `JWTPassThroughMiddleware`

```ts filename="src/controller/JWTController.ts" {4,8}
import { Post, UseBefore } from "@yunflyjs/yunfly";
import { JWTPassThroughMiddleware } from '@yunflyjs/yunfly/build/middleware/JWTMiddleware'
@JsonController('/user')
@UseBefore(JWTPassThroughMiddleware)  //controller手动使用jwt
export default class JWTController {
  // 
  @Post('/get-user-info')
  @UseBefore(JWTPassThroughMiddleware) //具体方法手动使用jwt
  async getUserMsg()Promise<any> {
    return {}
  }
}
```

## JWT暴露接口说明

* JWT暴露出如下的一些方法 `generateToken`,`verifyToken`,`decodeToken`,`injectToken`,`JWTMiddleware`,`JWTPassThroughMiddleware`

| 方法名 | 说明 |
| ------ | ------ |
| `generateToken`|  根据自定义参数生成jwt秘钥, 例如用户登录时生成秘钥操作 |
| `verifyToken` |  校验jwt秘钥是否有效，自带过期重签功能 |
| `decodeToken` |  解码jwt秘钥，不校验秘钥是否过期，此方法一般不用（慎用） |
| `injectToken` |  生成的jwt秘钥如何处理，可以设置到header头或者cookie中，具体以`config.jwt.token` 配置项为准 |
| `JWTMiddleware` | (config.jwt.global=false) 时使用，手动使用JWT中间件方式，当JWT校验失败是直接抛出错误信息，并中断执行 |
| `JWTPassThroughMiddleware` | (config.jwt.global=true) 时使用，手动使用JWT中间件方式，当JWT校验失败时继续执行 |

* 使用

```ts filename="src/controller/JWTController.ts" {10-17,25}
import { JsonController, Get } from "@yunflyjs/yunfly";
import { generateToken, verifyToken } from '@yunflyjs/yunfly/build/middleware/JWTMiddleware'
//  
@JsonController('/jwt')
export default class JWTController {
  @Get('/gen-token')
  async genToken(
    @Ctx() ctx:Context,
  ): Promise<AnyOptions> {
    const token = generateToken({
      ctx,
      data : {
        name:'zane',
        age: 25,
        hobby:['游泳','爬山']
      },
    })
    return { token }
  }
  //
  @Get('/verify-token')
  async verifyToken(
    @Ctx() ctx: Context,
  ): Promise<AnyOptions> {
    return await verifyToken({ ctx })
  }
}
// verify-token 返回值
// {
//   name:'zane',
//   age: 25,
//   hobby:['游泳','爬山']
// }
```

## 通过 CurrentUser 获得 JWT 数据

```ts filename="src/controller/JWTController.ts" {8,10}
import { JsonController, Get, CurrentUser, UseBefore } from "@yunflyjs/yunfly";
//  
@JsonController('/jwt')
export default class JWTController {
  // 
  @Get('/get-jwt-data')
  async getJWTdata(
    @CurrentUser() user: AnyOptions,
  ): Promise<AnyOptions> {
    const { name, age, hobby } = user || {}
    return { name, age, hobby }
  }
}
// 解码返回值
// {
//   name:'zane',
//   age: 25,
//   hobby:['游泳','爬山']
// }
```

## JWT重签机制 expiredPassThrough

* 值为 `true`, 当 JWT 过期时，会自动重签，也就是说 JWT 不会过期，JWT 仅用来做参数校验。
* 值为 `false`, 当 JWT 过期时，会向外抛出 401 错误，此时 JWT 可用来做 登录态校验 + 参数校验。

### 自动重签规则

> 为了保证服务的正常，当jwt过期时，会拿着过期的密钥进行数据解码，不会阻断当前的request请求（对客户端无影响），但JWT内部会进行过期日志打印和token重签。

* 使用新的token

> * JWT 当前支持 `header头` 和 `cookie` 两种方式
> * 当我们的处理方式为`cookie`类型时，过期会自动重签并设置新的cookie信息（无需做额外处理）。
> * 当我们的处理方式为`header`类型时，过期重签需要进行手动处理。

当 JWT 需要签名或者重签时，请求的`Header头`会返回一个`特殊的重签头标识`: `Set-${key}`, 默认标识为`Set-Authorization`（此处标识取决于你`config.jwt.token.key`字段）,因此我们需要`在客户端统一拦截接口的Header返回头标识`，当发现有`Set-${key}`返回头标识时，取值并`覆盖客户端过期的token即可`。

* 下面以axios为例

### 全局拦截

```js
// ---------------------全局拦截---------------------
// 新增一个全局拦截器
axios.interceptors.response.use(function (response) {
  // 如果返回token为真时，重新替换本地token
  const authorization = response.headers['set-authorization'];
  if(authorization) {
    sessionStorage.setItem('token',authorization);
  }
  return response;
}, function (error) {
  return Promise.reject(error);
});

```

### 单接口拦截

```js
// ----------------------单个接口处理---------------------
axios({
  method: 'post',
  url: 'http://xxx.com/api/xxx',
  data: {},
  headers: {'Authorization': 'xxxxxx'},
}).then((response)=>{
  // 如果返回token为真时，重新替换本地token
  const authorization = response.headers['set-authorization'];
  if(authorization) {
    sessionStorage.setItem('token',authorization);
  }
})
```

* 附加： 如果BFF使用`cors`则需要配置允许的header头字段 `exposeHeaders`(允许返回的header头信息);

```js
config.security = { 
    cors: {
        // 运行返回头
        exposeHeaders: ['Set-Authorization'],
    },
}
```
