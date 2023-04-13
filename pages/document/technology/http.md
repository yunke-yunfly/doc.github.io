# http

在框架内发起一个 `HTTP` 请求很简单, 我们只需要安装 `axios` 即可运行。

- 安装 `axios`

```ts
yarn add axios
```

- 请求

```ts
const url = 'http://xxx.com/api/get-msg';

// promise
axios.get(url).then((res)=>{ 
    console.log(res)
})

// async await
async function getData () {
    const result = await axios.get(url);
}
```

`axios` 更多用法请参考：<http://www.axios-js.com/zh-cn/docs/>

## 参数透传

当 BFF 应用发起 HTTP 请求时，也可以统一向 `header` 头中传入头信息。

具体使用方式请参考：[参数透传](../high-function/param-trans.md)

## TS 类型文件

### OpenAPI gen Typescript

当我们的后端使用的是 `JAVA` 技术栈时, 后端可以生成完整的 `OpenAPI` 数据, BFF 或 前端 可以使用 `yundoc` 把 openapi 生成 ts 代码。

详细请参考文档： [OpenAPI gen Typescript](../openapi/openapiGenTs.md)

### Proto gen Typescript

当我们后端使用的是 `proto` 来做接口描述时, BFF 或 前端 可以使用 `yungen` 把 proto 生成 ts 代码

详细参考文档：[Proto gen Typescript](./grpc.md)
