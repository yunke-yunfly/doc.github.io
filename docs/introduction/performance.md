---
sidebar_position: 4
---

# 性能

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
