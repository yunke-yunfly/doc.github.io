# @yunke/yunfly-plugin-v8-profiler

- 实时获取 `cpuprofile` 插件, 用于性能瓶颈分析。

> 1. 实时在线生成 cpuprofile，支持10s, 30s, 1m, 2m, 5m 数据
> 2. 支持界面查看生成的 cpuprofile 数据列表
> 3. 支持在线下载
> 4. 支持在线实时分析 cpuprofile 数据
> 5. 支持多进行模型数据采集（cluster）

## 使用

1. 安装

```ts
yarn add @yunke/yunfly-plugin-v8-profiler
```

2. 使用插件

config.plugin.ts 中声明插件

```ts
const plugins: { [key: string]: string }[] = [
  {
    name: 'v8profile',
    package: '@yunke/yunfly-plugin-v8-profiler',
  },
];
export default plugins;
```

## 注意事项

若 src/middleware/* 中存在 `@Middleware({ type: 'before' })` 中间件且未被 `config.routingControllersOptions.middlewares` 加载的中间件时，需要剔除`@Middleware({ type: 'before' })`标识，否则有可能会被当成全局插件加载。

## 界面 demo

生成 cpuprofile
![cpuprofile](https://github.com/yunke-yunfly/yunfly-plugin-v8-profiler/blob/master/img/1672737934692-image.png?raw=true)

在线分析
![在线分析](https://github.com/yunke-yunfly/yunfly-plugin-v8-profiler/blob/master/img/1672738014201-image.png?raw=true)

## 操作指引

1. 界面网址

- 开发环境

```ts
// 开发环境为本地服务+端口+固定路由
// 例如：BFF服务端口号为3000
http://127.0.0.1:3000/v8-profiler/view
```

