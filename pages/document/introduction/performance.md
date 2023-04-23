# 性能

yunfly 框架底层 web 库为 koa, 路由开发模型库为 routing-controllers, 路由命中库为 find-my-way。

koa 对于写业务来说性能是足够优异的，routing-controllers 使用装饰器的方式来进行路由的开发，对于开发者来说是很提效的。

框架剔除了低效的 koa-router 更换为高效的 find-my-way。框架未内插件，开发者可以根据自己的需求定制插件。

## 性能压测

以下性能测试为同一台机器同样的容器场景下压测3分钟得出的结果。

## 容器环境

1G1核 Docker 容器

## hello world 场景

| web框架 | qps | 备注 |
| ------ | ------ |------ |
| yunfly | **6400** | 使用 koa 为底层库  |
| eggjs | 3950 | 使用 koa 为底层库 |
| nestjs | 2900 | 使用 express 为底层库 |
| nestjs | **7200** | 使用 fastify 为底层库 |

## 1000 个路由场景

| web框架 | qps | 备注 |
| ------ | ------ |------ |
| yunfly | **6100** | 使用 koa 为底层库 |
| eggjs | 1680 | 使用 koa 为底层库 |
| nestjs | 2050 | 使用 express为底层库 |
| nestjs | **6550** | 使用 fastify为底层库 |
