# Socket

若想启用socket服务，需要做以下几步操作：

## 服务端

### 配置

- 1. 安装依赖

```js
yarn add @yunflyjs/yunfly-plugin-socket
```

- 2. `config.plugin.ts` 中声明插件

```ts filename="src/config/config.plugin.ts"
const plugins: { [key: string]: string }[] = [
  {
    name: 'socket',
    package: '@yunflyjs/yunfly-plugin-socket',
    lifeHook: 'afterStart'
  },
];
export default plugins;
```

- 3. `config.default.ts` 中启用 socket

```ts filename="src/config/config.default.ts"
// socket
config.socket = {
  enable: true,
  type: 'worker',  // 可选值 worker: 随机选择一个worker执行， all: 所有worker都执行, 默认为worker
  path: '/socket.io'
}
```

### 使用

* 根目录src下新增socket文件夹

* socket 文件夹下可新建 `controller`、`middleware` 两个文件夹
* `middleware` 可建多个，执行时没有固定的先后顺序，代码案例如下：

```ts filename="src/socket/middleware/socketMiddleware.ts"
export default function socketMiddleware (socket: any) {
  return socket.use((socket: any, next: (err?: any) => Promise<any>) => {

    // middleware. do something

    return next();
  });
}
```

* controller 文件夹下固定 `MainController.ts` 为socket接收入口, `MainController` 中代码固定如下：

```ts filename="src/socket/controller/MainController.ts"
export default function main (socket: any) {
  // 向客户端发送数据案例
  socket.emit('hello', (data: any) => {
    console.log(data); 
  });
  // 服务端就收数据案例
  socket.on('message', (...args: any[]) => {
    console.log(args)
  });
}
```

## 客户端

由于服务端 `socket.io` 为2.x版本, 客户端也相应的需要使用 2.x 版本

### 安装依赖

```ts
yarn add socket.io-client@2
```

### 基础使用

```ts
import io from 'socket.io-client';

const socket = io('http://127.0.0.1:3000/', {
  path: '/socket.io', // 此处需要跟服务端path保持一致
  transports: ['websocket'],
})

// 接受数据案例
socket.on('hello', (...args: any[]) => {
  console.log(args)
});

// 定时发送数据案例
setInterval(() => {
  socket.emit('message', 'hello world!')
}, 2000)
```

> socket.io 使用文档： https://socket.io/docs/v2/client-api/ 



