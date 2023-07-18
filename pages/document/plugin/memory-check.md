# @yunke/yunfly-plugin-memory-check

- 内存检查插件，当内存持续一段时间大于某个阈值时重启服务

## 安装

- 1. 安装依赖

```ts
yarn add @yunke/yunfly-plugin-memory-check
```

- 2. 申明插件

```ts filename="src/config/config.plugin.ts"
// `src/config/config.plugin.ts` 中申明插件
const plugins: {[key:string]: string}[] = [
  {
    name: 'memoryCheck',
    package: '@yunke/yunfly-plugin-memory-check'
  }
];
export default plugins;
```

- 3. 启用插件

```ts filename="src/config/config.default.ts"
// `src/config/config.default.ts` 中启用插件。
config.memoryCheck = {
  enable: true,
  triggerThreshold: 0.9, // 内存使用达到90%
  intervalTime: 300000, // 5分钟
  cron: '*/10 * * * * *' // 每10秒检查一次
};
```

## config.memoryCheck 配置说明

|  字段  | 类型 | 必填 | 说明 |
|  ---- | ---- | ---- | ---- |
|  enable | boolean  | 是  | 是否开启插件 |
|  triggerThreshold | number  | 否  | 浮点数类型值，当内存使用率超过当阈值时触发计数 |
|  intervalTime |  number | 否  | 内存使用率超过阈值持续时间则重启（单位ms） |
|  cron |  string | 否  | 检查频率 [Cron表达式范例参考](../basic-function/timing-task.md#cron-表达式范例) |

## 说明

当服务已使用内存长时间较大时,应用性能会直线下降, 需要关注是否是有内存泄漏, 或者是容器本身内存不足等问题。

重启服务是为了释放内存, 让服务短时间内能正常运行。




