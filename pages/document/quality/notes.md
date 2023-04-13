---
sidebar_position: 5
---

# Notes

代码注释规范

> 好的代码本身就具备自描述，有意义的命名，合理的代码结构，和良好的注释同样重要！

## 注释概述

### 背景

1. 当第一次接触某段代码，但又被要求在极短的时间内有效地分析这段代码，我们需要什么样的注释信息？
2. 怎样避免冗长的注释
3. 在多人协同开发、维护的过程中，需要什么样的注释提高团队的合作效率

### 优点

- 核心逻辑注释，易于理解业务流程实现，提高代码的可读性
- 减少团队之间不必要的沟通，提高开发效率
- 提高项目代码的可维护性
- 代码智能提示
- 根据注释生成文档

### 分类

类别|含义|重要性
---|---|---
描述性注释|描述程序功能和程序个组成部分相互关系的高级注释|重要
解释性注释|逐行解释程序如何工作的低级注释|不重要
提示性注释|在某处进行提示的注释|一般

### 原则

- 注释风格统一
- 用简洁的语言清晰描述  
  - 专业词语
  - 准确反应设计思想和代码逻辑
  - 描述业务含义
- 注释和代码的一致性
  - 建议先写注释，再写代码
- 删除无用注释

### 场景

- 难于理解的代码段
- 可能存在错误、具有潜在风险的代码段
- 浏览器特殊的HACK代码
- 想吐槽的产品逻辑
- 业务逻辑强相关的代码
- 模块间相互关系
- 循环和逻辑分支

## 注释风格

### 行内注释

一般用于变量名注释

```js
let name = 'tom'; // 姓名
```

### 单行注释

注释单独在一行

```js
// 执行一个函数
say();
```

### 多行注释

> js的多行注释以`/*`开头，以`*/`结尾，其中的字符都是注释。所以中间有没有`*`都可以，但一般建议换行的时候带上一个`*`

```js
/**
* 第一行注释
* 第二行注释
*/
say();
```

### 文档化注释

```js
/**
 * 向某人打招呼
 * @param {string} name
 */
function say(name: string) {
  console.log(`hi ${name}`);
}
```

### 常量

行内注释

```js
const PI = 3.14; // 定义圆周率
```

单独注释

```js
// 定义圆周率
const PI = 3.14;
```

### 枚举

```ts
/**
 * @description 登录状态
 * @enum {number}
 */
enum LoginStatus {
    // 成功
    Success = 1, 
    // 失败
    Fail = 0, 
    // 未知
    Unknown = -1 
}
```

### 函数

```js
/**
 * @description 向某人打招呼
 * @param {string} name
 * @return {boolean} 
 */
function say(name) {
  console.log(`hi ${name}`);
  return true;
}
```

可选参数

```ts
/**
 * @description 向某人打招呼
 * @param {string} [name]
 * @return {boolean}
 */
function say(name?:string): boolean {
  console.log(`hi ${name}`);
  return true;
}
```

默认参数

```ts
/**
 * @description 向某人打招呼
 * @param {string} [name='']
 * @return {boolean}
 */
function say(name:string = ''): boolean {
  console.log(`hi ${name}`);
  return true;
}
```

### 类、属性、方法

```ts
/**
 * @description 动物类
 * @class Animal
 */
class Animal {
  // 名称
  public name: string;

  constructor(name: string) {
      this.name = name;
  }

  /**
   * @description 打招呼
   * @return {string} 
   * @memberof Animal
   */
  sayHi() {
      return `My name is ${this.name}`;
  }
}
```

### 文件注释

```js
/**
 * @file 用户信息
 */
```

## 工具

### jsdoc

### Document This

扩展配置

```js
 "todohighlight.keywords": [
    {
      "text": "NOTE:",
      "color": "white",
      "backgroundColor": "#6a8aff",
    },
    {
      "text": "DEBUG:",
      "color": "white",
      "backgroundColor": "#8a4af3",
    },
  ],
```
