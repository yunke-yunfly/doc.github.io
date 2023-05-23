# 本地开发

为了提升开发者体验，框架提供了便捷的方式在本地进行开发、调试、单元测试等。

## 脚本命令

- 开发模式下支持代码热更新命令。

`package.json` 文件 `scripts` 中添加命令：

```ts filename="package.json"
{
  "scripts" : {
    "dev": "cross-env NODE_ENV=dev yunfly",
    "watch:dev": "cross-env NODE_ENV=dev yunfly --watch",
  }
}
```

## 环境配置【可选】

开发模式下优先读取 `src/config/config.local.ts` 配置。

配置优先级：`local` > `defalut`

```ts filename="src/cofig/config.local.ts"
// 可删除此文件、内容也可为空
// 本地环境时读取，此配置项
import { Config } from '@yunflyjs/yunfly';

const config = () => {
    const config: Config = {};
    // 案例：开发模式下关闭 cluster
    config.cluster = {
        enable: false
    };
    return config;
};
export default config;
```

## 环境变量

### NODE_ENV

`Node_ENV` 只有 `dev`, `production` 两个值，开发环境下使用 `dev`。

### RUNTIME_ENV

`RUNTIME_ENV` 环境变量默认为 `local`

### PORT

可以传递 `PORT` 环境变量来启动相应的端口号。

```ts
"dev": "cross-env NODE_ENV=dev PORT=3000 yunfly",
```
