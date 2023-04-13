# Reids

## 使用

### 1. 安装 npm 包

```js
yarn add @yunflyjs/yunfly-plugin-redis
```

### 2. config.plugin.ts 中配置插件

```ts filename="src/config/config.plugin.ts"
const plugins: {[key:string]: string}[] = [
  {
    name: 'redis',
    package: '@yunflyjs/yunfly-plugin-redis'
  }
];
export default plugins;
```

### 3. 新增 config.redis 配置

- 自定义配置参数

```js filename="src/config/config.default.ts"
config.redis = {
  enable: true,
  host: '127.0.0.1',
  port: 6379,
}
```

- 函数配置

```js filename="src/config/config.default.ts"
config.redis = (apolloConfig:{[key:string]: any}) => {
  return {
    enable: true, 
    host: '127.0.0.1',
    password: 123456, 
    port: 6379,
  }
};
```

- cluster 模式

```js filename="src/config/config.default.ts"
config.redis = {
  enable: true, 
  startupNodes:[
    {
      port: 6379,
      host: '127.0.0.1',
    },
    {
      port: 6379,
      host: '127.0.0.2',
    },
  ],
  options:{

  }
}
```

## API 调用

```ts
import { getRedis, cacheRedis as redis } from '@yunflyjs/yunfly-plugin-redis'
// 
class RedisController {
  // 
  @Post('/redis')
  async redisTest(): Promise<boolean> {
    // 使用 getRedis 函数，redis对象不存在时会自动报错
    getRedis().set('name', 'zane', 'EX', 10);
    // 
    // 使用redis缓存对象，自定义错误判断
    redis && redis.set('name', 'zane', 'EX', 10);
    // 
    return true;
  }
}
```

## Config 参数说明

### 1. 自定义 redis 配置项

| 方法名 | 类型 | 必填 | 说明 |
| ------ | ------ |------ |------ |
| enable |  boolean | 是 | 是否开启redis能力 |
| host |  string | 是 | host配置 |
| port |  number | 是 | port配置 |

> - 自定义自己的redis配置，此处需要显示的`把redis账号密码配置到BFF中`（`不推荐此种方式`）

### 2. apollo 中获取配置项

| 方法名 | 类型 | 必填 | 说明 |
| ------ | ------ |------ |------ |
| enable |  boolean | 是 | 是否开启redis能力 |
| host |  string | 是 | host配置 |
| port |  number | 是 | port配置 |
| password |  string | 是 | 鉴权密码 |

> - 从 `apollo 配置中获取`redis配置项目 （`自定义推荐配置方式`）
> - 需要`配合apollo服务`
> - `config.redis` 配置项是函数

- 其他通用配置项

| 方法名 | 类型 | 必填 | 说明 |
| ------ | ------ |------ |------ |
| username |  string | 否 | 鉴权用户 |
| password |  string | 否 | 鉴权密码 |
| db |  number | 是 | 默认数据库（默认为0） |
| keepAlive |  number | 否 | 持久链接时间 |
| ...... |  any | 否 | 其他参数 |

- `options` 完整参数ts类型如下：

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
  tls?:AnyOptionConfig;
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

### cluster模式 配置参数说明

| 方法名 | 类型 | 必填 | 说明 |
| ------ | ------ |------ |------ |
| enable |  boolean | 是 | 是否开启 |
| startupNodes |  Object[] | 是 | redis单机节点 |
| startupNodes.host | string | 是 | 链接地址 |
| startupNodes.port | number | 是 | 端口 |
| options |  Object | 否 | 其他参数 |

- `options` 详细参数ts类如下：

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

## 字符串(string)

> - 如果 key 已经存储其他值， SET 就覆写旧值，且无视类型。

### set

- 将键key设定为指定的“字符串”值。

返回值：

- 如果SET命令正常执行那么回返回OK，否则如果加了NX 或者 XX选项，但是没有设置条件。那么会返回null。

```js
// 设置key：'key1' 的值为'bff-example'，并且 10 秒之后过期。
await redis.set('key1','bff-example', 'EX', 10); // return "OK"
```

备注：

> - key 尽量带上 `团队名`或者`空间名前缀`
> - value值是字符串，如果是对象，请做好数据转换处理。
> - 尽量`设置过期时间`， 单位为 `【秒】`。

### get

- 返回key的value。如果key不存在，返回特殊值null。如果key的value不是string，就返回错误，因为GET只处理string类型的values。

返回值：

- key对应的value，或者null（key不存在时）

```js
redis.set('key1','bff-example', 'EX', 10);

await redis.get('key1'); // return bff-example
await redis.get('key2'); // return null
```

### del

- 删除字段信息

```js
redis.set('key1','bff-example', 'EX', 10);

await redis.del('key1'); // retrun 'OK'

// 删除多个key
await redis.del('key1','key2','key3');
```

### mget

- 返回所有指定的key的value。对于每个不对应string或者不存在的key，都返回特殊值nil。正因为此，这个操作从来不会失败。

返回值：

- 指定的key对应的values的list

```js
redis.set('key1','hello');
redis.set('key2','world');
redis.set('key3','world');

await redis.mget('key1','key2') // return ["hello","world","world"]
```

### mset

- 对应给定的keys到他们相应的values上。MSET会用新的value替换已经存在的value

返回值：

- 总是OK，因为MSET不会失败。

```js
await redis.mset('key1','hello','key2','world'); // return 'OK'

await redis.get('key1') // return "hello"
await redis.mget('key1','key2')  // return "hello","world"
```

- 更多命令请参考： <http://www.redis.cn/commands/set.html>

<br/>
<br/>
<br/>

## 集合 (Sets)

> - 不重复且无序的字符串元素的集合;
> - Redis Set 是 String 的无序排列。SADD 指令把新的元素添加到 set 中。对 set 也可做一些其他的操作，比如测试一个给定的元素是否存在，对不同 set 取交集，并集或差，等等。

### sadd

> - 添加一个或多个指定的member元素到集合的 key中.指定的一个或者多个元素member 如果已经在集合key中存在则忽略.如果集合key 不存在，则新建集合key,并添加member元素到集合key中.

返回值：

- 返回新成功添加到集合里元素的数量，不包括已经存在于集合中的元素.

```js
// 以下两种方式等价
await redis.sadd('myset', 'hello', 'world')  // return 'OK'
await redis.sadd('myset', ['hello', 'world'])  // return 'OK'
```

### scard

> - 返回集合存储的key的基数 (集合元素的数量)。

返回值：

- 集合的基数(元素的数量),如果key不存在,则返回 0.

```js
redis.sadd('myset', 'hello', 'world')
await redis.scard('myset')  // return 2
await redis.scard('myset1') // return 0
```

### srem

> - 在key集合中移除指定的元素. 如果指定的元素不是key集合中的元素则忽略 如果key集合不存在则被视为一个空的集合，该命令返回0

返回值：

- 从集合中移除元素的个数，不包括不存在的成员.

```js
redis.sadd('myset', 'hello', 'world')
await redis.srem('myset','hello')  // return 1
```

### sunion

> - 返回给定的多个集合的并集中的所有成员 【集合并集】

返回值：

- 并集的成员列表

```js
redis.sadd('myset', 'hello', 'world')
redis.sadd('myset1', 'world', '!')

await redis.sunion('myset','myset1')  // return ["hello","!","world"]
await redis.sunion('myset3','myset4') // return []
```

- 更多集合请参考： <http://www.redis.cn/commands/sadd.html>

<br/>
<br/>
<br/>

## 列表 (Lists)

- Redis列表是简单的字符串列表，按照插入顺序排序。你可以添加一个元素到列表的头部（左边）或者尾部（右边）, 他们基本上就是链表;

### lpush

- 将所有指定的值插入到存于 key 的列表的头部。如果 key 不存在，那么在进行 push 操作前会创建一个空列表。 如果 key 对应的值不是一个 list 的话，那么会返回一个错误。

返回值：

- 在 push 操作后的 list 长度。

```js
redis.lpush('mylist','!')
redis.lpush('mylist','world')
redis.lpush('mylist','hello')

await redis.lrange('mylist', 0, 1) // return ['hello','world']
```

### lrange

- 返回存储在 key 的列表里指定范围内的元素。 start 和 end 偏移量都是基于0的下标，即list的第一个元素下标是0（list的表头），第二个元素下标是1，以此类推。
- 偏移量也可以是负数，表示偏移量是从list尾部开始计数。 例如， -1 表示列表的最后一个元素，-2 是倒数第二个，以此类推。

返回值：

- 指定范围里的列表元素。

```js
redis.lpush('mylist','!')
redis.lpush('mylist','world')
redis.lpush('mylist','hello')

await redis.lrange('mylist', 0, 0) // return ['hello']
await redis.lrange('mylist', 0, 1) // return ['hello','world']
await redis.lrange('mylist', -2, -1) // return ["world","!"]
```

### lpop

- 移除并且返回 key 对应的 list 的第一个元素。

返回值：

- 返回第一个元素的值，或者当 key 不存在时返回 null

```js
redis.lpush('mylist','hello','world')
await redis.lpop('mylist') // return 'world' // 从第一项开始删除
await redis.lpop('mylist') // return 'world'
await redis.lpop('mylist') // return null
```

### lset

- 设置 index 位置的list元素的值为 value, 当index超出范围时会返回一个error。

```js
redis.lpush('mylist','hello','world')

await redis.lset('mylist', 0, 'zane')  // return 'OK'   // 替换第一项
await redis.lrange('mylist', 0, 10) // return [ 'zane', 'hello' ]
```

> - rpop、rpush 等同理

- 更多列表操作请参考： <http://www.redis.cn/commands/lset.html>

<br/>
<br/>
<br/>

## 哈希（Hashes）

> - 由field和关联的value组成的map。field和value都是字符串的

### hset

- 设置 key 指定的哈希集中指定字段的值。
- 如果 key 指定的哈希集不存在，会创建一个新的哈希集并与 key 关联。
- 如果字段在哈希集中存在，它将被重写。

返回值：

- 1如果field是一个新的字段
- 0如果field原来在map里面已经存在

```js
redis.hset('myhash','key1','hello');
redis.hset('myhash','key2','world');

await redis.hget('myhash','key1');  // return 'hello'
await redis.hget('myhash','key2');  // return 'world'
```

### hget

- 返回 key 指定的哈希集中该字段所关联的值

返回值：

- 该字段所关联的值。当字段不存在或者 key 不存在时返回null。

```js
redis.hset('myhash','key1','hello');
redis.hset('myhash','key2','world');

await redis.hget('myhash','key1');  // return 'hello'
await redis.hget('myhash','key');  // return null
```

### hdel

- 从 key 指定的哈希集中移除指定的域。在哈希集中不存在的域将被忽略。

返回值：

- 返回从哈希集中成功移除的域的数量，不包括指出但不存在的那些域
- 如果 key 指定的哈希集不存在，它将被认为是一个空的哈希集，该命令将返回0。

```js
redis.hset('myhash','key1','hello');
redis.hset('myhash','key2','world');

await redis.hdel('myhash','key1');  // return 1
await redis.hdel('myhash','key');  // return 0
```

### hlen

- 返回 key 指定的哈希集包含的字段的数量

返回值：

- 哈希集中字段的数量，当 key 指定的哈希集不存在时返回 0

```js
redis.hset('myhash','key1','hello');
redis.hset('myhash','key2','world');

await redis.hlen('myhash')   //return 2
await redis.hlen('myhash1')  // return 0
```

### hkeys

- 返回 key 指定的哈希集中所有字段的名字。

返回值：

- 哈希集中的字段列表，当 key 指定的哈希集不存在时返回空列表。

```js
redis.hset('myhash','key1','hello');
redis.hset('myhash','key2','world');

await redis.hkeys('myhash')   // return ['hello','world']
await redis.hkeys('myhash1')  // return []
```

### hgetall

- 返回 key 指定的哈希集中所有的字段和值。返回值中，每个字段名的下一个是它的值，所以返回值的长度是哈希集大小的两倍

返回值：

- 哈希集中字段和值的列表。当 key 指定的哈希集不存在时返回空列表。

```js
redis.hset('myhash','key1','hello');
redis.hset('myhash','key2','world');

await redis.hgetall('myhash')   // return { key2: 'world', key1: 'hello' }
await redis.hgetall('myhash1')  // return {}
```

- 更多哈希操作请参考： <http://www.redis.cn/commands/hget.html>

## 其他说明

> - redis 还有其他数据类型， 例如 `Sorted sets`,`Bit arrays`,`HyperLogLogs`。 由于前端不常用到，再这里暂时不做文档补充。 若有团队需要请联系BFF开发人员，这边来补充相应的文档。
> - redis 还可用于`消费队列`，`订阅发布消费`等场景，由于前端接触和使用较少，这里暂时不做文档补充，后期有需要请联系BFF开发人员进行文档的补充。

### 备注
>
> 1. BFF有默认的多环境redis服务，redis服务配置为 1G，能够`满足平常的开发需求`，`当业务方需求量`，redis性能要求较高时请联系运维或者BFF开发人员进行`redis服务的扩容`
> 2. 在开发时，每个团队 `redis key 都需要加上本团队的前缀`，以防key混乱 【重要】
> 3. 任何redis字段，`请加上过期时间`，【重要】
