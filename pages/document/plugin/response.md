# @yunflyjs/yunfly-plugin-response

统一返回数据处理插件中间件

## 使用

1. 安装依赖

```bash
yarn add @yunflyjs/yunfly-plugin-response
```

2. **config/config.plugin.ts** 中申明插件

```ts
/**
 * yunfly plugin
 */
const plugins: {[key:string]: string}[] = [
  {
    name: 'response',
    package: '@yunflyjs/yunfly-plugin-response'
  }
];
// 
export default plugins;
```

3. **config/config.default.ts** 中启用插件

```js
config.response = {
  enable: true,
  succCode: 0, // 请求成功时返回code (默认0)
}
```

## 返回数据格式说明

### JSON

当 content-type 为 text/plain 或 application/json 时返回 JSON 数据


```ts
// controller 
@Post('/response/json')
test(
    @BodyParam('name') name: string,
): string {
    return name || 'success';
}
```

```json
// response
{
    "code": 0,
    "data": "success!"
}
```


### Html

返回数据中需要增加 `response_type=html` 的参数

```ts
// controller 
@Post('/response/html')
test(
    @BodyParam('name') name: string,
): string {
    return {
        data: `
            <html>
                <body>00000</body>
            </html>
        `
        response_type: 'html',
    }
}
```

```html
<!-- response -->
<html>
    <body>00000</body>
</html>
```

### Txt

返回数据中需要增加 `response_type=txt` 的参数

```ts
// controller 
@Post('/response/txt')
test(
    @BodyParam('name') name: string,
): string {
    return {
        data: `txt response!`
        response_type: 'txt',
    }
}
```

```txt
<!-- response -->
txt response!
```

### Xml

返回数据中需要增加 `response_type=xml` 的参数

```ts
// controller 
@Post('/response/xml')
test(
    @BodyParam('name') name: string,
): string {
    return {
        data: `
            <note>
            <to>George</to>
            <from>John</from>
            <heading>Reminder</heading>
            <body>Don't forget the meeting!</body>
            </note>
        `
        response_type: 'html',
    }
}
```

```xml
<!-- response -->
<note>
<to>George</to>
<from>John</from>
<heading>Reminder</heading>
<body>Don't forget the meeting!</body>
</note>
```

### Xlsx

返回数据中需要增加 `response_type=xlsx` 的参数

```ts
// controller 
@Post('/response/xlsx')
test(
    @BodyParam('name') name: string,
): string {
    return {
        data: 'xxx',
        fileName: 'xxx.xlsx',
        response_type: 'xlsx',
    }
}
```

