# redis 插件

## 使用

- 1. 安装依赖

```js
yarn add @yunflyjs/yunfly-plugin-redis
```

- 2. `config.plugin.ts` 中声明插件

```ts title="src/config/config.plugin.ts"
const plugins: { [key: string]: string }[] = [
  {
    name: 'redis',
    package: '@yunflyjs/yunfly-plugin-redis',
  },
];
export default plugins;
```

- 3. `config.default.ts` 中启用插件

- 对象

```js
config.redis = {
  enable: true,
  host: '127.0.0.1',
  port: 6379,
};
```

- 函数

```js
config.redis = () => {
  const host = apolloConfig['EXAMPLE-REDIS-HOST'];
  const password = apolloConfig['EXAMPLE-REDIS-PASSWORD'];
  const port = apolloConfig['EXAMPLE-REDIS-PORT'];
  return {
    enable: true,
    host,
    password,
    port,
  };
};
```

- cluster 模式

```js
config.redis = {
  enable: true,
  startupNodes: [
    {
      port: 6379,
      host: '127.0.0.1',
    },
    {
      port: 6379,
      host: '127.0.0.2',
    },
  ],
  options: {},
};
```

4. 框架中使用

```ts
import { redis } from @yunflyjs/yunfly-plugin-redis

redis.set('key','example');
redis.get('key');
```

## 参数说明

| 字段 | 类型    | 必填 | 说明                |
| ------ | ------- | ---- | ------------------- |
| enable | boolean | 是   | 是否开启 redis 能力 |
| host   | string  | 是   | host 配置           |
| port   | number  | 是   | port 配置           |

- 其他通用配置项

| 方法名    | 类型   | 必填 | 说明                   |
| --------- | ------ | ---- | ---------------------- |
| username  | string | 否   | 鉴权用户               |
| password  | string | 否   | 鉴权密码               |
| db        | number | 是   | 默认数据库（默认为 0） |
| keepAlive | number | 否   | 持久链接时间           |
| ......    | any    | 否   | 其他参数               |

- `options` 完整参数 interface：

```ts
interface RedisCommonConfig {
  username?: string;
  password?: string;
  db?: number;
  keepAlive?: number;
  family?: number;
  noDelay?: boolean;
  connectionName?: string;
  dropBufferSupport?: boolean;
  enableReadyCheck?: boolean;
  enableOfflineQueue?: boolean;
  connectTimeout?: number;
  disconnectTimeout?: number;
  commandTimeout?: number;
  autoResubscribe?: number;
  autoResendUnfulfilledCommands?: number;
  lazyConnect?: number;
  tls?: AnyOptionConfig;
  keyPrefix?: string;
  retryStrategy?: Function;
  maxRetriesPerRequest?: number;
  reconnectOnError?: Function;
  readOnly?: boolean;
  stringNumbers?: boolean;
  enableAutoPipelining?: boolean;
  autoPipeliningIgnoredCommands?: string[];
  maxScriptsCachingTime?: number;
}
```

### cluster 模式 配置参数说明

| 方法名            | 类型     | 必填 | 说明           |
| ----------------- | -------- | ---- | -------------- |
| enable            | boolean  | 是   | 是否开启       |
| startupNodes      | Object[] | 是   | redis 单机节点 |
| startupNodes.host | string   | 是   | 链接地址       |
| startupNodes.port | number   | 是   | 端口           |
| options           | Object   | 否   | 其他参数       |

- `options` 详细参数 ts 类如下：

```ts
interface RedisClusterCommonConfig {
  clusterRetryStrategy?: Function;
  dnsLookup?: any;
  enableOfflineQueue: boolean;
  enableReadyCheck?: boolean;
  scaleReads?: string;
  maxRedirections?: number;
  retryDelayOnFailover?: number;
  retryDelayOnClusterDown?: number;
  retryDelayOnTryAgain?: number;
  slotsRefreshTimeout?: number;
  slotsRefreshInterval?: number;
  redisOptions?: AnyOptionConfig;
}
interface StartupNodesConfig {
  port: number;
  host: string;
}
interface RedisClusterConfig {
  enable: boolean;
  startupNodes: StartupNodesConfig[];
  options?: RedisClusterCommonConfig;
}
```

- 配置参数含义请参考`ioredis`： <https://www.npmjs.com/package/ioredis>

## Redis 常见使用案例

### 字符串 (string)

> - 如果 key 已经存储其他值， SET 就覆写旧值，且无视类型。

### set

- 将键 key 设定为指定的“字符串”值。

返回值：

- 如果 SET 命令正常执行那么回返回 OK，否则如果加了 NX 或者 XX 选项，但是没有设置条件。那么会返回 null。

```js
// 设置key：'key1' 的值为'bff-example'，并且 10 秒之后过期。
await redis.set('key1', 'bff-example', 'EX', 10); // return "OK"
```

备注：

> - key 尽量带上 `团队名`或者`空间名前缀`
> - value 值是字符串，如果是对象，请做好数据转换处理。
> - 尽量`设置过期时间`， 单位为 `【秒】`。

### get

- 返回 key 的 value。如果 key 不存在，返回特殊值 null。如果 key 的 value 不是 string，就返回错误，因为 GET 只处理 string 类型的 values。

返回值：

- key 对应的 value，或者 null（key 不存在时）

```js
redis.set('key1', 'bff-example', 'EX', 10);

await redis.get('key1'); // return bff-example
await redis.get('key2'); // return null
```

### del

- 删除字段信息

```js
redis.set('key1', 'bff-example', 'EX', 10);

await redis.del('key1'); // return 'OK'

// 删除多个key
await redis.del('key1', 'key2', 'key3');
```

### mget

- 返回所有指定的 key 的 value。对于每个不对应 string 或者不存在的 key，都返回特殊值 nil。正因为此，这个操作从来不会失败。

返回值：

- 指定的 key 对应的 values 的 list

```js
redis.set('key1', 'hello');
redis.set('key2', 'world');
redis.set('key3', 'world');

await redis.mget('key1', 'key2'); // return ["hello","world","world"]
```

### mset

- 对应给定的 keys 到他们相应的 values 上。MSET 会用新的 value 替换已经存在的 value

返回值：

- 总是 OK，因为 MSET 不会失败。

```js
await redis.mset('key1', 'hello', 'key2', 'world'); // return 'OK'

await redis.get('key1'); // return "hello"
await redis.mget('key1', 'key2'); // return "hello","world"
```

- 更多命令请参考： <http://www.redis.cn/commands/set.html>

### 集合 (Sets)

> - 不重复且无序的字符串元素的集合;
> - Redis Set 是 String 的无序排列。SADD 指令把新的元素添加到 set 中。对 set 也可做一些其他的操作，比如测试一个给定的元素是否存在，对不同 set 取交集，并集或差，等等。

### sadd

> - 添加一个或多个指定的 member 元素到集合的 key 中.指定的一个或者多个元素 member 如果已经在集合 key 中存在则忽略.如果集合 key 不存在，则新建集合 key,并添加 member 元素到集合 key 中.

返回值：

- 返回新成功添加到集合里元素的数量，不包括已经存在于集合中的元素.

```js
// 以下两种方式等价
await redis.sadd('myset', 'hello', 'world'); // return 'OK'
await redis.sadd('myset', ['hello', 'world']); // return 'OK'
```

### scard

> - 返回集合存储的 key 的基数 (集合元素的数量)。

返回值：

- 集合的基数(元素的数量),如果 key 不存在,则返回 0.

```js
redis.sadd('myset', 'hello', 'world');
await redis.scard('myset'); // return 2
await redis.scard('myset1'); // return 0
```

### srem

> - 在 key 集合中移除指定的元素. 如果指定的元素不是 key 集合中的元素则忽略 如果 key 集合不存在则被视为一个空的集合，该命令返回 0

返回值：

- 从集合中移除元素的个数，不包括不存在的成员.

```js
redis.sadd('myset', 'hello', 'world');
await redis.srem('myset', 'hello'); // return 1
```

### sunion

> - 返回给定的多个集合的并集中的所有成员 【集合并集】

返回值：

- 并集的成员列表

```js
redis.sadd('myset', 'hello', 'world');
redis.sadd('myset1', 'world', '!');

await redis.sunion('myset', 'myset1'); // return ["hello","!","world"]
await redis.sunion('myset3', 'myset4'); // return []
```

- 更多集合请参考： <http://www.redis.cn/commands/sadd.html>

### 列表 (Lists)

- Redis 列表是简单的字符串列表，按照插入顺序排序。你可以添加一个元素到列表的头部（左边）或者尾部（右边）, 他们基本上就是链表;

### lpush

- 将所有指定的值插入到存于 key 的列表的头部。如果 key 不存在，那么在进行 push 操作前会创建一个空列表。 如果 key 对应的值不是一个 list 的话，那么会返回一个错误。

返回值：

- 在 push 操作后的 list 长度。

```js
redis.lpush('mylist', '!');
redis.lpush('mylist', 'world');
redis.lpush('mylist', 'hello');

await redis.lrange('mylist', 0, 1); // return ['hello','world']
```

### lrange

- 返回存储在 key 的列表里指定范围内的元素。 start 和 end 偏移量都是基于 0 的下标，即 list 的第一个元素下标是 0（list 的表头），第二个元素下标是 1，以此类推。
- 偏移量也可以是负数，表示偏移量是从 list 尾部开始计数。 例如， -1 表示列表的最后一个元素，-2 是倒数第二个，以此类推。

返回值：

- 指定范围里的列表元素。

```js
redis.lpush('mylist', '!');
redis.lpush('mylist', 'world');
redis.lpush('mylist', 'hello');

await redis.lrange('mylist', 0, 0); // return ['hello']
await redis.lrange('mylist', 0, 1); // return ['hello','world']
await redis.lrange('mylist', -2, -1); // return ["world","!"]
```

### lpop

- 移除并且返回 key 对应的 list 的第一个元素。

返回值：

- 返回第一个元素的值，或者当 key 不存在时返回 null

```js
redis.lpush('mylist', 'hello', 'world');
await redis.lpop('mylist'); // return 'world' // 从第一项开始删除
await redis.lpop('mylist'); // return 'world'
await redis.lpop('mylist'); // return null
```

### lset

- 设置 index 位置的 list 元素的值为 value, 当 index 超出范围时会返回一个 error。

```js
redis.lpush('mylist', 'hello', 'world');

await redis.lset('mylist', 0, 'zane'); // return 'OK'   // 替换第一项
await redis.lrange('mylist', 0, 10); // return [ 'zane', 'hello' ]
```

> - rpop、rpush 等同理

- 更多列表操作请参考： <http://www.redis.cn/commands/lset.html>

### 哈希（Hashes）

> - 由 field 和关联的 value 组成的 map。field 和 value 都是字符串的

### hset

- 设置 key 指定的哈希集中指定字段的值。
- 如果 key 指定的哈希集不存在，会创建一个新的哈希集并与 key 关联。
- 如果字段在哈希集中存在，它将被重写。

返回值：

- 1 如果 field 是一个新的字段
- 0 如果 field 原来在 map 里面已经存在

```js
redis.hset('myhash', 'key1', 'hello');
redis.hset('myhash', 'key2', 'world');

await redis.hget('myhash', 'key1'); // return 'hello'
await redis.hget('myhash', 'key2'); // return 'world'
```

### hget

- 返回 key 指定的哈希集中该字段所关联的值

返回值：

- 该字段所关联的值。当字段不存在或者 key 不存在时返回 null。

```js
redis.hset('myhash', 'key1', 'hello');
redis.hset('myhash', 'key2', 'world');

await redis.hget('myhash', 'key1'); // return 'hello'
await redis.hget('myhash', 'key'); // return null
```

### hdel

- 从 key 指定的哈希集中移除指定的域。在哈希集中不存在的域将被忽略。

返回值：

- 返回从哈希集中成功移除的域的数量，不包括指出但不存在的那些域
- 如果 key 指定的哈希集不存在，它将被认为是一个空的哈希集，该命令将返回 0。

```js
redis.hset('myhash', 'key1', 'hello');
redis.hset('myhash', 'key2', 'world');

await redis.hdel('myhash', 'key1'); // return 1
await redis.hdel('myhash', 'key'); // return 0
```

### hlen

- 返回 key 指定的哈希集包含的字段的数量

返回值：

- 哈希集中字段的数量，当 key 指定的哈希集不存在时返回 0

```js
redis.hset('myhash', 'key1', 'hello');
redis.hset('myhash', 'key2', 'world');

await redis.hlen('myhash'); //return 2
await redis.hlen('myhash1'); // return 0
```

### hkeys

- 返回 key 指定的哈希集中所有字段的名字。

返回值：

- 哈希集中的字段列表，当 key 指定的哈希集不存在时返回空列表。

```js
redis.hset('myhash', 'key1', 'hello');
redis.hset('myhash', 'key2', 'world');

await redis.hkeys('myhash'); // return ['hello','world']
await redis.hkeys('myhash1'); // return []
```

### hgetall

- 返回 key 指定的哈希集中所有的字段和值。返回值中，每个字段名的下一个是它的值，所以返回值的长度是哈希集大小的两倍

返回值：

- 哈希集中字段和值的列表。当 key 指定的哈希集不存在时返回空列表。

```js
redis.hset('myhash', 'key1', 'hello');
redis.hset('myhash', 'key2', 'world');

await redis.hgetall('myhash'); // return { key2: 'world', key1: 'hello' }
await redis.hgetall('myhash1'); // return {}
```

- 更多哈希操作请参考： <http://www.redis.cn/commands/hget.html>

### 其他说明

> - redis 还有其他数据类型， 例如 `Sorted sets`,`Bit arrays`,`HyperLogLogs`。 由于前端不常用到，再这里暂时不做文档补充。 若有团队需要请联系 BFF 开发人员，这边来补充相应的文档。
> - redis 还可用于`消费队列`，`订阅发布消费`等场景。


