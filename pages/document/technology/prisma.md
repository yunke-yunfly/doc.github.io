# prisma

- 新一代 `orm` 工具, 支持 `MySql` `SQLite` `SQL Server` `MongoDB` `PostgreSQL`

## 安装

- 1. 安装依赖

```ts
yarn add @yunflyjs/yunfly-plugin-prisma
```

- 2. 申明插件

```ts filename="src/config/config.plugin.ts" {}
const plugins: {[key:string]: string}[] = [
  {
    name: 'prisma',
    package: '@yunflyjs/yunfly-plugin-prisma'
  }
];
export default plugins;
```

- 3. 启用插件

```ts filename="src/config/config.default.ts"
config.prisma = {
  enable: true,
  db: {
    url: 'mysql://user:password@localhost:3306/mydb'
  }
};
```

`config.prisma` 配置: [详细说明](#configprisma-配置说明)

- 4. 初始化 prisma

```ts
npx prisma init
```

> 备注：这个命令创建了一个名为 `prisma` 的新目录，其中包含一个名为 `schema.prisma` 的文件和一个位于项目根目录中的 `.env` 文件 `schema.prisma` 包含`prisma` 模式以及数据库连接和 `prisma` 客户端生成器。

- 5. 统一初始化配置

```ts
npx prisma-init --dev
```

备注：

> prisma-init 指令说明 [参考地址](#prisma-init-命令行参数)。
> 这个命令会更新 `.env` 和 `schema.prisma` 文件, 保持配置的一致性。支持 `apollo` 管理配置。

- 6. 生成 `Prisma Client` 类型文件

```ts
npx prisma generate
```

- 重要提示:

> - 第一次初始化时，`schema.prisma` 中需要有 `models` 配置。
> - 每次对 `Prisma schema` 进行更改后，你都需要重新运行命令 `prisma generate` 去更新生成的 `Prisma Client` 代码。

## 使用

在 `Service` 中使用 `prisma` 进行数据的增删改查

```ts
import { prisma } from '@yunflyjs/yunfly-plugin-prisma';

@Service()
export default class UserService {

  async createUser () {
    const newUser = await prisma.user.create({
      data: {
        name: 'Alice',
        email: 'alice@prisma.io',
      },
    });
    return newUser;
  }

  async getUserList () {
    const users = await prisma.user.findMany();
    return users;
  }

}
```

> 提示： `prisma` 包含所有自定义 `modules` 的 `Typescript` 类型提示, 若 `VS CODE` 中没有类型提示时，可直接打开一次 `node_modules/.prisma/index.d.ts` 文件即可

## config.prisma 配置说明

|  字段  | 类型 | 必填 | 说明 |
|  ---- | ---- | ---- | ---- |
|  enable | boolean  | 是  | 是否开启插件 |
|  db | DbConfig \| ((apolloConfig: ApolloConfig) => DbConfig)  | 否  | 数据库配置 |
|  client | Object  | 否  | prisma client 客户端配置项 |

### db 配置说明

```ts
// interface 类型
interface PrismaConfig {
  db?: DbConfig | ((apolloConfig: ApolloConfig) => DbConfig);
  ...
}

interface DbConfig {
  url: string;
  databaseUrlKey?: string;
}
```

- url: 连接数据库 `url` 地址，详细请参考：<https://prisma.yoga/concepts/database-connectors/mysql#%E8%BF%9E%E6%8E%A5-url>
- databaseUrlKey: 数据库环境变量名称，默认值为：`DATABASE_URL`

## config.client 配置说明

- interface 类型说明

```ts
interface PrismaConfig {
  ......
  client?: {
    datasources?: Datasources;
    log?: Array<LogLevel | LogDefinition>;
    errorFormat?: ErrorFormat;
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation;
  }
}
```

|  字段  | 类型 |  说明 |
|  ---- | ---- | ---- |
|  datasources | Datasources  |  数据源 [参考地址](https://prisma.yoga/reference/api-reference/prisma-client-reference#%E6%95%B0%E6%8D%AE%E6%BA%90datasource) |
|  log| Array\<LogLevel \| LogDefinition\>  |  确定日志类型和级别 [参考地址](https://prisma.yoga/reference/api-reference/prisma-client-reference#log) |
|  errorFormat | ErrorFormat  |  确定 Prisma 返回的错误级别和格式 [参考地址](https://prisma.yoga/reference/api-reference/prisma-client-reference#%E9%94%99%E8%AF%AF%E6%A0%BC%E5%BC%8F%E5%8C%96) |
|  rejectOnNotFound| RejectOnNotFound \| RejectPerOperation  |  抛错说明 [参考地址](https://prisma.yoga/reference/api-reference/prisma-client-reference#rejectonnotfound) |

## prisma-init 命令行参数

`prisma-init` 命令行支持：`--dev`, `--prod`, `--debug` 三个指令

```ts
// 设置环境变量 NODE_ENV = dev，适合于开发环境
npx prisma-init --dev
```

```ts
// 设置环境变量 NODE_ENV =production
npx prisma-init --prod
```

```ts
// 设置环境变量 DEBUG = prisma-plugin 显示调试信息
npx prisma-init --dev --debug
```

## Prisma cli 命令行参数说明

### prisma init

初始化 `prisma`, 用于项目的第一次初始化操作, 它只需要执行一次, 它会在项目中创建一个 `.env` `prisma/schema.prisma` 的案例文件。当项目中已存在相关文件时，它会提示文件已存在。

```ts
// 默认初始化
npx prisma init

// 指定数据库初始化
npx prisma init --datasource-provider mysql

// 指定url进行初始化。 备注：它会检测数据库是否能链接成功
npx prisma init --url 'mysql://user:password@localhost:3306/mydb'
```

### prisma generate

初始化 prisma 客户端代码, 它的核心能力是生成 `Typescript` 类型, 初始化 prisma 服务。 会在 `node_modules/.prisma` 下自动生成所有 `modules` 的类型文件, 方便开发人员开发, 提升开发效率。

```ts
// 默认初始化客户端代码，当modules有变动时需要重新执行此命令
npx prisma generate

// watch 模式生成客户端代码，当 prisma/schema.prisma 文件有改动时，会自动生成客户端代码
npx prisma generate --watch
```

## prisma studio

图形化管理数据库数据，可以增删改查，不推荐使用，功能不够强大，推荐本地数据库管理工具，例如：`Navicat`

```ts
npx prisma studio
```

## prisma migrate

从`Prisma`模型创建迁移，将其应用于数据库, 它会同步 `schema.prisma` 中定义的 `model` 到数据库。

```ts
// 同步 model 到数据库，会创建 migrations 用于储存同步记录
npx prisma migrate dev

// 为当前迁移命名
npx prisma migrate dev --name=init

// 根据本地 migrations 文件下迁移记录充值 数据库
prisma migrate reset

// 为生产环境做数据同步
prisma migrate deploy
```

备注:

1. 可以增加 `--name=init` 参数为当前迁移命名
2. 当 `model` 没有变化时，不会生成新的迁移
3. 当删除本地 `migrations` 中迁移记录时，运行 `reset` 命令会删除数据库相关系信息，请慎重执行。

## prisma db pull

从现有数据库中提取模式，更新Prisma模型

```ts
// 通过数据库表生成 schema.prisma 模型
npx prisma db pull

// 只在控制台打印生成的 schema.prisma
npx prisma db pull --print

// 强制覆盖本地定义的 model
npx prisma db pull --force
```

## prisma db push

将Prisma模型状态推送到数据库

```ts
// 直接同步本地 model 到数据库中 （慎重操作：没有迁移记录，推荐使用 prisma migrate）
npx prisma db push
```

- 命令行万能发 --help

```ts
npx prisma --help
npx prisma generate --help
npx prisma db pull --help
```

prisma 指令：[参考文档](https://prisma.yoga/reference/api-reference/command-reference)
