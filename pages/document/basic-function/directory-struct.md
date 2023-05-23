# 目录结构

```txt
├── package.json
├── README.md
├── tsconfig.json  
├── .gitignore
├── src
│    ├── config
│    │  └── config.default.ts
│    │  └── config.local.ts (可选)
│    │  └── config.test.ts  (可选)
│    │  └── config.release.ts (可选)
│    │  └── config.prod.ts (可选)
│    │  └── config.middleware.ts (可选)
│    ├── controller
│    │  └── ExampleController.ts
│    ├── middleware
│    │  └── ExampleMIddleware.ts
│    ├── service
│    │  └── ExampleService.ts
│    ├── alone
│    │  └── alone1.ts
│    │  └── alone2.ts 
│    ├── schedule
│    │  └── task1.ts
│    │  └── task2.ts
│    ├── plugin
│    │   └── yunfly-plugin-email
│    │       ├── src
│    │       │   ├── config
│    │       │   │   └── config.default.ts
│    │       │   └── app.ts
│    │       ├── tsconfig.json
│    │       ├── README.md
│    │       └── package.json
│    └── app.ts
```

> * `tsconfig.json` Ts规则配置项  [详细配置参考](https://www.tslang.cn/docs/handbook/tsconfig-json.html)
> * `controller` BFF controller 层
> * `middleware` 中间件
> * `service` BFF service 层
> * `alone` alone 进程执行文件
> * `schedule` 定时任务文件 （一个文件表示一个定时任务）
> * `config` BFF 配置器
> * `app.ts` 可配置服务启动文件

## 备注

* 为保持代码规范一致性 `controller`、`service` 文件尽量以大写字母开头，分别以 `Controller`、`Service` 后缀结尾。
* 根据自身业务的复杂度来决定 `controller` 和 `service` 下是否再拆分文件夹。
