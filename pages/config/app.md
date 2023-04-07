# 应用配置详情

## entry

`object | string | string[]`

可用于修改、拓展 Webpack 的 enrty 选项，配置项参考 [官方文档](https://webpack.js.org/configuration/entry-context/#entry)。

```js
module.exports = {
  // ...
  entry: {
    home: './home.js',
    about: ['./about.js'],
    contact: ['./contact.js']
  }
}
```


