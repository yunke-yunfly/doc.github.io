# 生成Typescript代码

> 执行 `yundoc` 时增加 `--push` 参数，可在本地生成 openapi 数据的同时生成前端类型定义和请求代码

## 使用

### 根目录下新增 `yundoc.config.js` 文件

```ts filename="yundoc.config.js" {9-20}
const path = require('path');
module.exports = {
  routePrefix: '/api', // 此处请跟你routing-controllers保持一致
  controllers: [path.join(process.cwd(), "./src/controller/*")],
  ...

  // 是否根据生成结果生成前端请求代码和类型定义
  // 此参数在 --api 下生效
  genApi: {
    // 输出目录，一般指向 bff 对应的前端项目 src/api 这样的目录
    outputDir: path.join(__dirname, './api'),
    // 支持自定义 axios，必须使用 export default 导出 axios 或其实例
    // axiosFilePath: path.join(__dirname, './utils/request'),
    // 是否需要生成 header 相关参数（默认不开启，header 推荐在 axios 拦截器全局处理）
    header: false,
    // 是否需要生成 cookie 相关参数（默认不开启，cookie 推荐在 axios 拦截器全局处理） 
    cookie: false,
    // prettier 配置文件，用于格式化生成结果
    // prettierConfig: path.join(__dirname, '../xxx/.prettierrc')
  },
}

```

- 配置说明

```ts
export interface genApiConfig {
  outputDir: string;
  axiosFilePath?: string;
  header?: boolean;
  cookie:? boolean;
  prettierConfig?: string;
}
```

| 字段 | 类型 | 必填 |说明 |
| ------ | ------ |------ |------ |
| outputDir | `string` | 是 | 输出目录，一般指向 bff 对应的前端项目 src/api 这样的目录，示例 path.join(__dirname, './api'), |
| axiosFilePath | `string` | 否 | 如果不填，则默认是使用 axios 库。支持自定义 axios，必须使用 export default 导出 axios 或其实例，示例 path.join(__dirname, './utils/request') |
| header | `boolean` | 否 | 是否需要生成 header 相关参数（默认不开启，header 推荐在 axios 拦截器全局处理） |
| cookie | `boolean` | 否 | 是否需要生成 cookie 相关参数（默认不开启，cookie 推荐在 axios 拦截器全局处理）|
| prettierConfig | `string` | 否 | prettier 配置文件，用于格式化生成结果，示例 path.join(__dirname, '../xxx/.prettierrc') |

### 执行命令

```bash
yundoc --api
```
