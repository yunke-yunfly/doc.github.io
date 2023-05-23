# 插件配置

`config` 用于配置插件启动时所需要的配置项, `plugin` 用来做插件的定义, 它决定项目可以使用那些插件。
`src/config` 文件目录下新增 `config.plugin.ts` 文件用来管理项目的插件。

## 完整的插件案例

```ts {7-24}
/**
 * yunfly 插件
 * 数组顺序就是插件的加载顺序
 */
import * as path from 'path'
// 
const plugins: {[key:string]: string}[] = [
  /**
   * hello 插件
   * 使用path模式
   */
  {
    name: 'hello',
    path: path.join(__dirname, '../plugin/yunfly-plugin-hello'),
  },
  /**
   * redis 插件
   * 使用npm包模式
   */
  {
    name: 'redis',
    package: '@yunflyjs/yunfly-plugin-redis'
  }
];
// 
export default plugins;
```

## 插件类型

```ts
export interface PluginConfig {
  name: string;
  path?: string;
  package?: string;
  async?: boolean;
  lifeHook?: 'beforeStart' | 'appDidReady' | 'afterStart';
  priority?: number;
}
```

## 参数说明

| 字段 | 类型 | 必选 | 说明 |
| ------ | ------ |------ |------ |
| name | `string` | 是 | 当前插件配置的唯一标识 `name`, 跟 `config.default.ts` 中字段保持一致, `name` 字段很有用，它用来标识**是否有重复插件**和**插件覆盖**的能力 |
| package | `string` | 否 | npm包插件名，例如: `@yunflyjs/yunfly-plugin-redis`。 (备注：`package` 与 `path` 必须有一个字段为真)|
| path | `string` | 否 | `本地开发` 插件目录地址 (备注：`package` 与`path` 必须有一个字段为真)|
| async | `boolean` | 否 | 若为 `false`，表示同步加载插件，加载完才会加载下一个插件；否则为异步加载，不阻塞其他插件加载（默认值为： true）。|
| lifeHook | `string` | 否 | 可选值：`beforeStart`、`configDidReady`、`appDidReady`、`afterStart`，表示在哪个生命周期进行加载。默认在 `appDidReady` 周期下加载插件。想进一步了解生命周期[可看](./lifehook.md) |
| priority | `number` | 否 | 插件自定义执行顺序, 数字越小约先执行，默认值：50 |
