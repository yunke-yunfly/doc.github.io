---
sidebar_position: 4
---

# Prometheus

## 介绍

Node应用错误信息，接口请求次数，RPC性能，HTTP请求性能数据分析与统计，实时查看当前服务QPS,容器运行状况，Node使用资源情况等。 并能自定义各种指标，从而进行监控告警。

> 1. 支持多进程 cluster 模型
> 2. 支持自定义指标

## 使用

1. 安装依赖

```shell
yarn add @yunflyjs/yunfly-plugin-prometheus
```

2. `config.plugin.ts` 中声明插件

```ts filename="src/config/config.plugin.ts"
const plugins: {[key:string]: string}[] = [
  {
    name: 'prometheus',
    package: '@yunflyjs/yunfly-plugin-prometheus'
  }
];
export default plugins;
```

3. `config.default.ts` 中启用插件

```js filename="src/config/config.default.ts"
config.prometheus = {
    enable: true,
}
```

4. 打开 `metrics` 接口即可查看指标内容

```js
open:  http://127.0.0.1:3000/metrics
```

## 自定义指标

例如自定义一个 test Counter 类指标

```ts
import client from '@yunflyjs/yunfly-plugin-prometheus';

// 自定义的test Counter 类指标
const ClientTestCounter = new client.Counter({
  name: 'yunfly_test',
  help: 'Counter for test',
  labelNames: ['path', 'method'],
})

// 使用 test Conter 指标
ClientTestCounter.inc({ path:'xxx', method:'xxx' }, 1);
```

## prometheus 内置指标

此次为常用查询语句，请根据你可以根据自己的需要来定制化你的图表语句。

### 指标名称说明

| 指标名称                                  | 含义                |
| ----------------------------------------- | ------------------- |
| 1. yunfly_client_request_total            | BFF Client请求数量记录 (BFF QPS)  (lable: ['path', 'method', 'status', 'code', 'orgcode']) |
| 3. yunfly_third_request_total             | BFF HTTP请求数量记录 (HTTP QPS)  (lable: ['path',  'method', 'status', 'code']) |
| 4. yunfly_http_request_total              | BFF http请求数量记录 (HTTP QPS)  (lable: ['path',  'method', 'status']) |
| 5. yunfly_error_total                     | 错误日志的记录次数 (lable: ['type', 'code'], type值类型: ['default'/'rejection'/'exception'])   |
| 7. yunfly_third_error_total               | BFF http请求错误记录次数 (lable: ['code'])  |
| 8. yunfly_http_error_total                | BFF 第三方http接口错误记录次数 (lable: ['path', 'method', 'status'])  |
| 9. yunfly_process_exit_total              | 工作进程致命错误退出记录 (lable:  ['type']，type值类型：['worker'/'alone']) |
| 10. yunfly_res_tracing_h_total            | 完整的client请求耗时 lable: ['path', 'method', 'status', 'code'] |
| 12. yunfly_third_tracing_h_total          | BFF http请求耗时 (lable: ['path', 'method', 'status', 'code'])  |
| 13. yunfly_http_tracing_h_total           | BFF http请求耗时 （ labelNames: ['path', 'method', 'status']） |

### K8S集群环境下一个完整的指标数据案例

```js
yunfly_client_request_total{
    app = "example-nodejs",
    code = "0",
    instance = "xx.xx.xx.xx:xx",
    job = "xxx",
    kubernetes_namespace = "xxx",
    kubernetes_pod_name = "xxx",
    method = "GET", 
    path = "/test/jest",
    pod_template_hash = "7d564d4bc6",
    status = "200"
}
```

## prometheus查询语句教学

### yunfly_client_request_total

客户端请求QPS[5m][按app分类]

```js
sum(rate(yunfly_client_request_total[5m]))  by (app)

// 指定BFF名称
sum(rate(yunfly_client_request_total{app="bff-example"}[5m]))

// 指定租户号
sum(rate(yunfly_client_request_total{orgcode="gzminjieadmin_test"}[5m]))  by (app)

// 指定path地址
sum(rate(yunfly_client_request_total{path="/test/api"}[5m]))  by (app)
```

负载最高的前10条接口[5m][按app,path分类]

```js
sum(topk(10,increase(yunfly_client_request_total{}[5m]))) by (app, path)

// 指定BFF名称
sum(topk(10, increase(yunfly_client_request_total{app="bff-example"}[5m]))) by (path)
```

> - 可根据`path`, `method`, `status`, `code`, `orgcode` 进行条件限制

| Lable字段        | 类型       |    描述    |
| ---------- | ---------- | ---------- |
|    path    |     `string`  |  api地址  |
|    method  |   `string` |  请求方式[GET/POST]  |
|    status  |   `number`  |  http请求返回状态码，成功：200  |
|    code    |   `string/number`  |  api请求body对象中返回的code值 [此参数由于是body中返回的字段，因此取决于业务方返回是否定义此字段]  |
|    orgcode  |   `string`  |  租户号 [租户号取`header头或者cookie信息中的orgcode字段`，若业务方未带则为空]  |

### yunfly_res_tracing_h_total

接口平均耗时[5m][按app分类]

```js
sum(increase(yunfly_res_tracing_h_total_sum[1m])) by (app) / sum(increase(yunfly_res_tracing_h_total_count[1m])) by (app)

// 指定BFF名称
sum(increase(yunfly_res_tracing_h_total_sum{app="bff-example"}[1m])) / sum(increase(yunfly_res_tracing_h_total_count{app="bff-example"}[1m]))
```

95%百分位耗时[5m][按app分类]

```js
histogram_quantile(0.95, sum(rate(yunfly_res_tracing_h_total_bucket[5m])) by (le,app))

// 指定BFF名称
histogram_quantile(0.95, sum(rate(yunfly_res_tracing_h_total_bucket{app="bff-example"}[5m])) by (le))
```

一段时间内平均请求耗时最高的前10条API地址

```js
topk(10,sum(rate(yunfly_res_tracing_h_total_sum{app="bff-yunke-performance"}[1m])) by (path) / sum(rate(yunfly_res_tracing_h_total_count{app="bff-yunke-performance"}[1m])) by (path))
```

> - 可根据`path`, `method`, `status`, `code` 进行条件限制

### yunfly_third_request_total

Node 应用内部发起的 HTTP 请求总数

HTTP请求QPS[5m][按app分类]

```js
sum(rate(yunfly_third_request_total[5m]))  by (app)
```

负载最高的前10条RPC请求[5m][按app,path分类]

```js
sum(topk(10, rate(yunfly_third_request_total{}[5m]))) by (app,path)
```

| 字段        | 类型       |    描述    |
| ---------- | ---------- | ---------- |
|    path    |    `string`  |  BFF请求第三方api完整path地址  |
|    method  |   `string` |  请求方式[GET/POST]  |
|    status  |   `number`  |  http请求返回状态码，成功：200  |
|    code    |   `string/number`  |  api请求body对象中返回的code值 [此参数由于是body中返回的字段，因此取决于业务方返回是否定义此字段]  |

### yunfly_third_tracing_h_total_sum

Node 应用内部发起的 HTTP 请求性能。

HTTP接口平均耗时[5m][按app分类]

```js
sum(increase(yunfly_third_tracing_h_total_sum[1m])) by (app) / sum(increase(yunfly_third_tracing_h_total_count[1m])) by (app)
```

HTTP 95%百分位耗时[5m][按app分类]

```js
histogram_quantile(0.95, sum(rate(yunfly_third_tracing_h_total_bucket[5m])) by (le,app))
```

### yunfly_http_request_total

HTTP请求QPS[5m][按app分类]

```js
sum(rate(yunfly_http_request_total[5m]))  by (app)
```

负载最高的前10条RPC请求[5m][按app,path分类]

```js
sum(topk(10, rate(yunfly_http_request_total{}[5m]))) by (app,path)
```

| 字段        | 类型       |    描述    |
| ---------- | ---------- | ---------- |
|    path    |    `string`  |  BFF请求第三方api完整path地址  |
|    method  |   `string` |  请求方式[GET/POST]  |
|    status  |   `number`  |  http请求返回状态码，成功：200  |

### yunfly_http_tracing_h_total_sum

HTTP接口平均耗时[5m][按app分类]

```js
sum(increase(yunfly_http_tracing_h_total_sum[1m])) by (app) / sum(increase(yunfly_http_tracing_h_total_count[1m])) by (app)
```

HTTP 95%百分位耗时[5m][按app分类]

```js
histogram_quantile(0.95, sum(rate(yunfly_http_tracing_h_total_bucket[5m])) by (le,app))
```

### yunfly_error_total

Node.js 应用错误请求数

错误数量[5m][按app分类]

```js
sum(increase(yunfly_error_total{}[5m])) by (app)

// 指定BFF
sum(increase(yunfly_error_total{app="bff-example"}[5m]))

// 指定错误类型
sum(increase(yunfly_error_total{app="bff-example", type="rejection"}[5m])) 
```

错误频率[5m][按app分类]

```js
sum(rate(yunfly_error_total{}[5m])) by (app)
```

| 字段        | 类型       |    描述    |
| ---------- | ---------- | ---------- |
|    type    |    `default`/`rejection`/`exception`  |  错误类型，`rejection`：为未捕获的`Promise`错误, `exception`：为未捕获的异常错误 |
|    code  |   `string/number` |  错误code码  |

### yunfly_third_error_total

BFF第三方HTTP接口请求错误

HTTP错误数量[5m][按app分类]

```js
sum(increase(yunfly_third_error_total{}[5m])) by (app)

// 指定BFF
sum(increase(yunfly_third_error_total{app="bff-example"}[5m]))
```

PRC错误频率[5m][按app分类]

```js
sum(rate(yunfly_third_error_total{}[5m])) by (app)
```

| 字段        | 类型       |    描述    |
| ---------- | ---------- | ---------- |
|    code    |   `string/number`  |  api请求body对象中返回的code值 [此参数由于是body中返回的字段，因此取决于业务方返回是否定义此字段]  |

HTTP错误数量[5m][按app分类]

```js
sum(increase(yunfly_http_error_total{}[5m])) by (app)

// 指定BFF
sum(increase(yunfly_http_error_total{app="bff-example"}[5m]))
```

PRC错误频率[5m][按app分类]

```js
sum(rate(yunfly_http_error_total{}[5m])) by (app)
```

| 字段        | 类型       |    描述    |
| ---------- | ---------- | ---------- |
|    code    |   `string/number`  |  api请求body对象中返回的code值 [此参数由于是body中返回的字段，因此取决于业务方返回是否定义此字段]  |

### yunfly_process_exit_total

Worker进程重启次数[5m][按app分类]

```js
sum(increase(yunfly_process_exit_total{type="worker"}[5m])) by (app)

// 指定BFF
sum(increase(yunfly_process_exit_total{type="worker",app="bff-example"}[5m]))
```

Alone进程重启次数[5m][按app分类]

```js
sum(increase(yunfly_process_exit_total{type="alone"}[5m])) by (app)
```

| 字段        | 类型       |    描述    |
| ---------- | ---------- | ---------- |
|    type    |   `worker`/`alone`  |  进程类型  |

## 指标告警规则使用说明教学

### `yunfly_client_request_total`

BFF Client请求数量记录

> - 告警指标需要业务方根据自己的情况进行定制

- 案例：

```js
// 1分钟内平均QPS大于1000
sum(rate(yunfly_client_request_total{}[1m])) by (app) > 1000

// 加上条件限制
// 1分钟内平均QPS大于1000并且 [orgcode=gzminjieadmin_test] 的租户
sum(rate(yunfly_client_request_total{orgcode="gzminjieadmin_test"}[1m])) by (app) > 1000 

// 1分钟内平均QPS大于1000并且 [path='/test/getname'] 的api
sum(rate(yunfly_client_request_total{path="/test/getname"}[1m])) by (app) > 1000 
```

> - 根据自身情况来进行告警条件配置
> - 告警可配置项[`时间`/`并发量`/`条件限制`]
> - 可根据`path`, `method`, `status`, `code`, `orgcode` 进行条件限制

| Lab字段        | 类型       |    描述    |
| ---------- | ---------- | ---------- |
|    path    |     `string`  |  api地址  |
|    method  |   `string` |  请求方式[GET/POST]  |
|    status  |   `number`  |  http请求返回状态码，成功：200  |
|    code    |   `string/number`  |  api请求body对象中返回的code值 [此参数由于是body中返回的字段，因此取决于业务方返回是否定义此字段]  |
|    orgcode  |   `string`  |  租户号 [租户号取`header头或者cookie信息中的orgcode字段`，若业务方未带则为空]  |

### `yunfly_res_tracing_h_total`

完整的client请求耗时记录

> - 告警指标需要业务方根据自己的情况进行定制

- 案例：

```js
// 1分钟内 HTTP 调用时间（P99）持续大于 10 秒 [按pord分类]
histogram_quantile(0.99, sum(rate(yunfly_res_tracing_h_total_bucket{}[1m])) by (app, kubernetes_pod_name, le)) > 10000

// 1分钟内 HTTP 调用时间（P95）持续大于 5 秒 [按pord分类]
histogram_quantile(0.95, sum(rate(yunfly_res_tracing_h_total_bucket{}[1m])) by (app, kubernetes_pod_name, le)) > 5000

// 1分钟内 HTTP 调用时间（P90）持续大于 3 秒 [按pord分类]
histogram_quantile(0.90, sum(rate(yunfly_res_tracing_h_total_bucket{}[1m])) by (app, kubernetes_pod_name, le)) > 3000

// 1分钟内 HTTP 调用时间 平均值 持续大于 1 秒 [按pord分类]
sum(increase(yunfly_res_tracing_h_total_sum{}[1m])) by (app, kubernetes_pod_name) / sum(increase(yunfly_res_tracing_h_total_count{}[1m])) by (app, kubernetes_pod_name) > 1000
// 或
sum(rate(yunfly_res_tracing_h_total_sum{}[1m])) by (app,kubernetes_pod_name) / sum(rate(yunfly_res_tracing_h_total_count{}[1m])) by (app,kubernetes_pod_name) > 1000

```

> - 根据自身情况来进行告警条件配置
> - 告警可配置项[`时间`/`阈值`/`条件限制`]
> - 可根据`path`, `method`, `status`, `code` 进行条件限制

### `yunfly_third_request_total`

BFF内 HTTP请求数量记录

> - 告警配置请参考 [`yunfly_client_request_total`](#yunfly_client_request_total-指标-（bff-client请求数量记录）)
> - 可根据 `path`, `method`, `status`, `code` 进行条件限制

| 字段        | 类型       |    描述    |
| ---------- | ---------- | ---------- |
|    path    |    `string`  |  BFF请求第三方api完整path地址  |
|    method  |   `string` |  请求方式[GET/POST]  |
|    status  |   `number`  |  http请求返回状态码，成功：200  |
|    code    |   `string/number`  |  api请求body对象中返回的code值 [此参数由于是body中返回的字段，因此取决于业务方返回是否定义此字段]  |

### `yunfly_third_tracing_h_total`

指标 （BFF内 HTTP请求耗时记录）

BFF --- THIRD HTTP 调用时间（P99）持续大于 10 秒

```js
histogram_quantile(0.99, sum(rate(yunfly_third_tracing_h_total_bucket{}[5m])) by (app, kubernetes_pod_name, le)) > 10000
```

> - 告警配置请参考 [`yunfly_res_tracing_h_total`](#yunfly_res_tracing_h_total-指标-（完整的client请求耗时记录）)
> - 可根据 `path`, `method`, `status`, `code` 进行条件限制

### `yunfly_error_total`

错误日志的记录次数

> - 告警指标需要业务方根据自己的情况进行定制

- 案例

```js
// 5分钟内错误量超过阀值1000
sum(increase(yunfly_error_total{}[5m])) by (app) > 1000

// 加上条件限制
// 5分钟内错误量超过阀值1000并且 [type='rejection'] 类型的错误
sum(increase(yunfly_error_total{type="rejection"}[5m])) by (app) > 1000
```

> - 根据自身情况来进行告警条件配置
> - 告警可配置项[`时间`/`阈值`/`条件限制`]
> - 可根据`type`, `code` 进行条件限制, 其中`type`的值为 [`default`/`rejection`/`exception`]

| 字段        | 类型       |    描述    |
| ---------- | ---------- | ---------- |
|    type    |    `default`/`rejection`/`exception`  |  错误类型，`rejection`：为未捕获的`Promise`错误, `exception`：为未捕获的异常错误 |
|    code  |   `string/number` |  错误code码  |

### `yunfly_third_error_total`

BFF HTTP请求错误记录次数

> - 告警配置请参考 `yunfly_error_total`
> - 可根据 `code` 进行条件限制

| 字段        | 类型       |    描述    |
| ---------- | ---------- | ---------- |
|    code    |   `string/number`  |  api请求body对象中返回的code值 [此参数由于是body中返回的字段，因此取决于业务方返回是否定义此字段]  |

### `yunfly_process_exit_total`

- 工作进程致命错误退出记录, 此指标只有在BFF开启了多进程之后才有效

```js
// 5分钟内单个pord worker 进程重启次数超过5次预警
sum(increase(yunfly_process_exit_total{type="worker"}[5m])) by (app, kubernetes_pod_name) > 5


// 1小时内单个pord alone 进程重启次数超过1次预警
sum(increase(yunfly_process_exit_total{type="alone"}[1h])) by (app, kubernetes_pod_name) > 1
```

> - 根据自身情况来进行告警条件配置
> - 告警可配置项[`时间`/`阈值`/`条件限制`]
> - 可根据`type` 进行条件限制, 其中`type`的值为 [`worker`/`alone`]

| 字段        | 类型       |    描述    |
| ---------- | ---------- | ---------- |
|    type    |   `worker`/`alone`  |  进程类型  |

