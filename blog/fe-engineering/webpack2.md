---
id: webpack2
title: Webpack 初探（二）
---

## 升级 Demo（使用 DevServer）

前面的内容只是使用 `Webpack` 提供的打包构建能力，实现打包构建的需求，但是在开发的过程中可能不仅仅需要打包构建的能力，同时还需要开发调试的能力，这个时候就需要使用 `DevServer` 了。

执行以下命令：

```bash
yarn add webpack-dev-server --dev
```

安装 `webpack-dev-server`，然后修改 `webpack.config.js`：

```js title="webpack.config.js" {27-34}
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // 开发者工具 不需要开发调试
  devtool: false,
  // 开发模式 不进行代码压缩
  mode: 'development',
  // 入口文件
  entry: './index.js',
  output: {
    // 输出文件名称
    filename: 'bundle.js',
    // 输出文件路径
    path: path.join(__dirname, './'),
  },
  module: {
    rules: [
      {
        // 正则匹配后缀名为 .css 的文件
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
  devServer: {
    // DevServer 根目录
    contentBase: './',
    // DevServer 端口
    port: 8080,
    // 打开浏览器
    open: true,
  },
};
```

修改 `package.json`，添加一条新的 `npm scripts`：

```json title="package.json" {9}
{
  "name": "basic",
  "version": "1.0.0",
  "main": "index.js",
  "repository": "https://github.com/wjq990112/Learning-Webpack",
  "author": "wjq990112",
  "license": "MIT",
  "scripts": {
    "start": "webpack serve",
    "build": "webpack"
  },
  "devDependencies": {
    "css-loader": "^5.0.1",
    "mini-css-extract-plugin": "^1.3.5",
    "style-loader": "^2.0.0",
    "webpack": "^5.19.0",
    "webpack-cli": "^4.4.0",
    "webpack-dev-server": "^3.11.2"
  }
}
```

接下来就能通过 `yarn start` 启动 `DevServer` 了，启动之后会自动打开浏览器，`Hello, Webpack!` 显示在页面顶部正中间。

现在修改一下 `index.js` 中的代码，在调用 `show` 的时候不传入 `Webpack`，改成传入 `Jack`，保存一下。

回到浏览器，会发现显示的文字变成了 `Hello, Jack!`。
