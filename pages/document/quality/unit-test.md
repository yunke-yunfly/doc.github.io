# 单元测试

## 说明
>
> * 使用jest测试框架 [文档地址](https://jestjs.io/docs/en/getting-started);
> * 使用supertest进行接口模拟请求 [文档地址](https://github.com/ladjs/supertest#readme);
> * 单元测试目录为 `根目录/src/__test__`，单元测试文件为 `.test.ts` （可进行自定义配置）;
> * `@yunflyjs/yunfly-unit-test` 只支持 yunfly 的项目;

## 使用

1. 安装依赖

```bash
yarn add @yunflyjs/yunfly-unit-test --dev
```

2. 项目根目录下新增`jest.config.js`文件,内容如下：

```ts filename="jest.config.js"
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ["<rootDir>/src/__test__"],
  verbose: true,
};
```

* 3. `package.json` 新增 `test` 脚本命令

```json filename="package.json"
"scripts": {
  "test": "jest -runInBand --forceExit --colors"
}
```

## 测试案例

### 简单案例

```ts filename="src/example.ts"
// example.ts
export function sum(a:any, b:any) {
  return a + b;
}
```

- 单词用例

```ts filename="src/__test__/http.simple.ts"
// src/__test__/http.simple.ts
import { sum } from '../example.ts';

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

> 更多能力请参考 [jest](https://jestjs.io/docs/en/getting-started)。

### 测试接口案例

- controller

```ts filename="src/controller/ExampleController.ts"
import { Get, JsonController, BodyParam, Post, QueryParam } from '@yunflyjs/yunfly';

@JsonController('/example')
export default class ExampleController {

  @Get('/simple/get')
  async simple(
    @QueryParam('name') name: string,
  ): Promise<any> {
    return {
      name:name || 'success'
    };
  }
  
  @Post('/simple/post')
  simple1(
    @BodyParam('name') name: string,
  ): any {
    return {
      name:name || 'success'
    };
  }
}
```

- 单测用例

- get

```ts filename="src/__test__/http.get.ts"
// src/__test__/http.get.ts
import { request } from '@yunflyjs/yunfly-unit-test'

test('GET /example/simple/get', async () => {
  const res = await request.get('/example/simple/get');
  expect(res.body).toEqual({ "name": "success" });
});
```

- post

```ts filename="src/__test__/http.post.ts"
// src/__test__/http.test.ts
import { request } from '@yunflyjs/yunfly-unit-test'

describe('POST /example/simple/post', function() {
  test('test default response', async () => {
    const res = await request
      .post('/example/simple/post')
      .set('Accept', 'application/json');
      expect(res.body.name).toEqual('success');
  });

  test('test request params', async () => {
    const res = await request
      .post('/example/simple/post')
      .send({name: 'john'})
      .set('Accept', 'application/json');
  
      expect(res.status).toEqual(200);
      expect(res.body.name).toEqual('john');
  });
})
```

> request api 请参考 [supertest](https://github.com/ladjs/supertest#readme)。




