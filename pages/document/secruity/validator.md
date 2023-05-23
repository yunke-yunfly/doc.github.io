# Validator

`yunfly` 底层用的是 `routing-controllers`，因为 `routing-controllers` 本身很好地集成 `class-validator`，所以可以直接使用`class-validator`进行参数校验。

## Demo示例

校验需求:

> 假设该应用启动端口为3000
> 校验 `/example/validator` 接口的 `query` 参数。
> 校验标准：`email`字段必须为邮件格式；`title`字段最小长度为10，最大长度为50.

### 新增 customErrorHandle 配置项

用于重新组装error信息，处理class-validator错误，并且不影响其他错误

#### 使用框架默认错误处理

```ts filename="src/config/config.default.ts" {4}
import { customErrorHandle } from '@yunflyjs/yunfly'

config.error = {
  customErrorHandle
};
```

#### 自定义错误处理逻辑

```ts filename="src/config/config.default.ts" {5-9}
import { customErrorHandle } from '@yunflyjs/yunfly'

// 也可以自定义错误处理逻辑
config.error = {
  customErrorHandle: (err: any, ctx: Context) => {
      if (Array.isArray(err.errors) && err.errors.length && err.errors[0] instanceof ValidationError) {
        // 这里自定义错误处理逻辑, 逻辑处理结果：为 err.messageDetail，err.message 赋值
      }
  },
};
```

### 声明校验类型 ParamsCheck

```ts
import { Get, JsonController, QueryParams, Ctx, Context } from '@yunflyjs/yunfly';
import { IsEmail, MinLength, MaxLength } from 'class-validator';

class ParamsVa {
  @IsEmail({}, {
    message: 'email 字段不符合邮箱规范!'
  })
  email: string;

  @MinLength(10, {
    message: '标题字段太短,最短10个字节',
  })
  title: string;
}

@JsonController('/example')
export default class ExampleController {

  @Get('/validator')
  async validator(
    @Ctx() ctx: Context,
    @QueryParams() params: ParamsCheck, // 直接引用 class定义好的ParamsCheck
  ): Promise<void> {
    return undefined;
  }
}
```

### 调用接口进行验证

```ts
curl http://127.0.0.1:3000/example/validator?email=test&title=test
```

### 返回结果

```json
{
  "code":2,
  "msg":"email 字段不符合邮箱规范!",
  "msg_detail":[
    {
      "property":"email",
      "details":{
        "isEmail":"email 字段不符合邮箱规范!"
      }
    },
    {
      "property":"title",
      "details":{
        "minLength":"标题字段太短,最短10个字节"
      }
    }
  ]
}
```

- 返回字段说明

| 字段 | 类型 | 说明 |
| ------ | ------ | ------ |
| code | `number` | 返回 code 码 |
| msg | `string` | 返回信息，此信息主要是给界面提示用 |
| msg_detail | `any` | 辅助查询信息 |

- 备注：

当一个接口有多个参数校验有误时, `msg` 字段的内容只展示第一个字段的错误信息, 完整的错误信息保存在 `msg_detail` 中。

## 常用校验 API

### @Length

校验字段长度

```ts
// 大于等于两个字节: x >= 2
@Length(2)
// example/validator?name=zhangshan ✅
// example/validator?name=z ❌


// 大于等于2小于等于4个字节： 4 >= x >= 2
@Length(2, 4)
// example/validator?name=zhangshan ❌
// example/validator?name=zs ✅


// 自定义提示信息
@Length(2, 4, {message: '大于等于2小于等于4个字节'})
```

### @Contains

包含某些信息校验

```ts
// 参数需要包含 hello 信息
@Contains('hello')
// example/validator?name=zhangshan ❌
// example/validator?name=hello-world ✅

// 自定义提示信息
@Contains('hello', {message: '必须包含hello信息!'})
```

### @IsInt

判断是否是 `number` 参数类型，【提示】：不适合 `get` 请求方式

```ts
// number 类型
@IsInt()

// 自定义提示信息
@IsInt({ message: '必须是number类型' });
```

### @Min、@Max

- @Min: number类型参数必须大于某值
- @Max: number类型参数必须小于某值

```ts
// x > 1
@Min(1)

// x < 10
@Max(10)

// 自定义提示信息
@Max(10,{ message: '参数值必须小于10' })
```

### @IsEmail

参数是否符合邮件格式

```ts
// 是否符合邮件格式
@IsEmail()

// 自定义提示信息
@IsEmail({}, { message: '参数不符合邮件格式!' })
// example/validator?name=zhangshan ❌
// example/validator?name=752636052@qq.com ✅
```

### @IsString

判断是否是 `string` 类型

```ts
@IsString()

@IsString({ message: '参数必须是 string 类型!' })
```

### @MinLength、@MaxLength

- @MinLength: 大于等于某个字节长度
- @MaxLength: 小于等于某个字节长度

```ts
// 必须大于等于10个字节：x >= 10
@MinLength(10)

// 必须小于等于10个字节：x <= 10
@MaxLength(10)

// 自定义提示信息
@MaxLength(10, { message: '参数小于等于10个字节长度!' })
// example/validator?name=zhangshanwangwu ❌
// example/validator?name=zhansan ✅
```

### @IsNotEmpty

非空判断

```ts
@IsNotEmpty()

@IsNotEmpty({ message: '参数不能为空!' })
// example/validator?name= ❌
// example/validator?name=zhansan ✅
```

更多 API 使用文档请参考: <https://www.npmjs.com/package/class-validator>
