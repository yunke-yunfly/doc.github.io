# 定时任务

绝大部分场景下，HTTP 请求相应模型时满足我们的需求的，某些特殊场景下需要定时任务的支持。框架内部集成了定时任务能力。

## 使用

- 1、根目录 `src` 下新增 `schedule` 文件夹
- 2、`schedule` 新增定时任务文件（可任意命名，建议命名规范 如：id-task.ts、source-task.ts）
- 3、按如下固定格式进行代码的编写

```ts filename="src/schedule/task.ts"
import { KoaApp, Config } from '@yunflyjs/yunfly' 

export default function schedule () {
  return {
    schedule: {
      cron: '*/5 * * * * *',
      enable: false,
      type: 'worker'  // 可选值 worker: 随机选择一个worker执行， all: 所有worker都执行, 默认为worker
    },
    task: (config: Config, app?: KoaApp) => {
      console.log('scheduleCronstyle:' + new Date());
    }
  }
}
```

## 说明

- 其中 `schedule` 为配置项
  - `cron` 为定时规则，（通用），使用规则请参考：[node-schedule](https://www.npmjs.com/package/node-schedule)，[node-cron](https://www.npmjs.com/package/node-cron)
  - `enable` 配置项来决定是否启用  true为启用，false为不启用
  - `type` 在 `cluster` 模式下， 值为 `worker` 时，表示随机选择一个 `worker` 执行定时任务， 值为 `all` 时，表示所有 `worker` 都执行定时任务
  - `task` 即为需要实现的定时任务逻辑

## Cron 表达式范例

```js
每隔5秒执行一次：*/5 * * * * *
每隔1分钟执行一次：0 */1 * * * *
每天23点执行一次：0 0 23 * * *
每天凌晨1点执行一次：0 0 1 * * *
每月1号凌晨1点执行一次：0 0 1 1 * *
每月最后一天23点执行一次：0 0 23 L * *
每周星期天凌晨1点实行一次：0 0 1 * * L
在26分、29分、33分执行一次：0 26,29,33 * * * *
每天的0点、13点、18点、21点都执行一次：0 0 0,13,18,21 * * *
```

- 注意点：

1. 由于定时任务服务是针对于单台机器单个服务，因此当我们的服务为集群时（即多个service服务，也就是处理同一件事情有多个定时任务时），需要做好定时任务逻辑的唯一处理原则，防止多个定时任务重复的处理某个逻辑的行为。
2. 建议需要使用定时任务的服务，前期只启动一台server服务
