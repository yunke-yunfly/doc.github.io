# 生命周期

`yunfly` 提供了4个生命周期钩子，便于开发者可以在 `应用开始前`、 `配置加载完后`、 `服务初始化后`、`应用启动后` 这些关键生命时刻进行操作。

## 生命周期事件说明

| 字段 | 类型 | 说明 |
| ------ | ------ |------ |
| beforeStart | `function` | BFF应用开始前执行的内容，此处可做一些日志打印标识 |
| configDidReady | `function` | Config配置文件加载完成，此处可以对Config配置进行更改 |
| appDidReady | `function` | 单线程：此处表示初始化koa服务完成。 多线程：此处表示alone进程与所有worker进程初始化koa服务完成。此处可以做一些初始化操作，例如redis初始化。 |
| afterStart | `function` | BFF应用启动完毕之后执行，此处可做一些日志打印标识 |

## 使用

根目录 `src` 下新建 `app.ts` 文件，文件内容如下：

```ts filename="src/app.ts"
import { Config } from '@yunflyjs/yunfly'

/**
 * BFF 生命周期
 *
 * @export
 * @class AppLifeHook
 */
export default class AppLifeHook {
  constructor() { }

  // app 启动之前执行 
  beforeStart() {
    console.log('---------beforeStart----------')
  }

  // config 配置加载完成之后执行
  configDidReady(config: Config) {
    // config.name = 'zane'
  }

  // 多线程时：当 alone 进程和 worker 进程执行完成之后执行
  // 多线程时，此处的代码将会在 worker 中执行
  appDidReady(config: Config, app: any) {

  }

  // app 启动之后执行
  afterStart(config: Config) {
    console.log('---------afterStart----------')
  }

}
```

> 加载插件时，也可以指定在不同生命周期进行加载。[详情请看lifeHook参数](./plugin.md#插件配置参数说明)
