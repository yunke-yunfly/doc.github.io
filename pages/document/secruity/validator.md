# Validator

`yunfly` 底层用的是 `routing-controllers`，因为 `routing-controllers` 本身很好地集成 `class-validator`，所以可以直接使用`class-validator`进行参数校验。

- 推荐结合 @yunflyjs/yunfly-plugin-error 插件一起使用，更好的展示错误信息, [参考地址](https://yunke-yunfly.github.io/doc.github.io/document/basic-function/catch-error#%E4%BD%BF%E7%94%A8)


## 使用

```ts
import { Get, JsonController, QueryParams } from '@yunflyjs/yunfly';
import { IsEmail, MinLength, MaxLength } from 'class-validator';
 
class ParamsVa {
  @IsEmail({
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
    @QueryParams() params: ParamsCheck, // 直接引用 class定义好的ParamsCheck
  ): Promise<void> {
    return undefined;
  }
}
```


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
