---
id: webpack1
title: Webpack 初探（一）
slug: /fe-engineering/
---

## 创建 Demo（使用 lerna）

这里使用 `lerna` 创建一个 `Monorepo`，不了解 `Monorepo` 和 `lerna` 的同学可以看一下这篇文章：[大型前端项目管理 - Monorepo](https://www.jianshu.com/p/1caeeb409bff)。

执行以下命令：

```bash
yarn global add lerna
mkdir demo && cd demo
lerna init
```

得到一个 `Monorepo` 的项目，目录结构是这样的：

```
.
├── lerna.json
├── package.json
└── packages
```

然后在 `packages` 目录下创建一个 `basic` 文件夹，意味着这是一个基础 Demo。

在 `packages/basic` 目录下创建三个文件：`index.html`、`index.js`、`func.js`。

```html title="index.html" {10-11}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>basic webpack demo</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="./bundle.js"></script>
  </body>
</html>
```

```js title="func.js"
function show(content) {
  document.querySelector('#app').innerHTML = `Hello, ${content}!`;
}

module.exports = show;
```

```js title="index.js"
const show = require('./func');

show('Webpack');
```

这个时候还没有 `bundle.js` 这个文件，所以这个时候网页还不能正常显示内容。

稍后需要使用 `Webpack` 对 `index.js` 和 `func.js` 打包，生成最终需要的 `bundle.js`。

执行以下命令：

```bash
cd packages/basic
yarn init
yarn add webpack webpack-cli --dev
```

初始化 `basic`，并安装好 `Webpack`，接下来需要对 `Webpack` 进行配置并打包生成最终需要的 `bundle.js`。

在 `basic` 中创建 `Webpack` 的配置文件 `webpack.config.js`。

```js title="webpack.config.js"
const path = require('path');

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
};
```

然后打开 `package.json`，添加一条 `npm scripts`。

```json title="package.json" {8-10}
{
  "name": "basic",
  "version": "1.0.0",
  "main": "index.js",
  "repository": "https://github.com/wjq990112/Learning-Webpack",
  "author": "wjq990112",
  "license": "MIT",
  "scripts": {
    "build": "webpack"
  },
  "devDependencies": {
    "webpack": "^5.19.0",
    "webpack-cli": "^4.4.0"
  }
}
```

执行以下命令：

```bash
yarn build
```

使用 `Webpack` 对 `index.js` 和 `func.js` 进行打包。

打包完成后 `basic` 中就会多生成一个 `bundle.js`。这个时候再使用浏览器打开 `index.html`，这个时候网页就显示出 `Hello, Webpack!`。

## 美化 Demo（使用 loader）

基本的 Demo 已经创建好了，接下来对这个网页做一下美化，让 `Hello, Webpack!` 这段文字水平居中。

`Webpack` 拥有 `loader` 机制，可以使用 `loader` 将非 `JavaScript` 的文件转换为可以在 `JavaScript` 使用的代码。

在 `basic` 创建一个样式文件 `index.css`：

```css title="index.css"
#app {
  text-align: center;
}
```

在 `index.js` 中引入：

```js title="index.js" {1}
require('./index.css');

const show = require('./func');

show('Webpack');
```

这个时候执行 `yarn build` 会报错，因为 `Webpack` 原生不支持 `CSS`，需要使用对应的 `loader` 对 `CSS` 做转换。

执行以下脚本：

```bash
yarn add style-loader css-loader --dev
```

然后修改 `webpack.config.js`：

```js title="webpack.config.js" {16-24}
const path = require('path');

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
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

这里通过正则匹配了所有后缀名为 `.css` 的文件，将 `CSS` 文件交给 `css-loader` 和 `style-loader` 进行处理。

- `use` 的执行顺序是**从后向前**执行
- `loader` 支持传入参数，有两种方式：
  1. `UrlSearchParams`
  2. `Options Object`

所以这里的应该是先将 `.css` 结尾的文件交由 `css-loader` 进行处理，再交由 `style-loader` 将其注入到 `bundle.js` 中，通过 `DOM` 操作在 `<head></head>` 标签中注入样式。

执行以下命令：

```bash
yarn build
```

现在进行打包就不会报错了，打开 `bundle.js` 会发现其中有一段非常长的处理样式的代码，将样式代码以 `<style></style>` 标签的形式注入到了 `<head></head>` 标签中。

回到页面，`Hello, Webpack!` 实现了水平居中。打开控制台，可以看到 `<head></head>` 标签中多了一个 `<style></style>` 标签，其中的内容就是 `index.css` 当中的内容。

核心代码：

```js
function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce = true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error(
        "Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.",
      );
    }

    target.appendChild(style);
  }

  return style;
}
```

但是使用这样的方式将样式代码注入到 `HTML` 中有两个问题：

1. 增加了 `DOM` 操作
2. `bundle.js` 代码体积增大

既然有这样的问题，能不能将 `CSS` 文件单独抽取出来，不将其打包至 `bundle.js` 中呢？

## 优化 Demo（使用 plugin）

这个时候就需要对 `bundle.js` 做一些优化，将 `CSS` 文件与 `bundle.js` 分离，然后可以单独引入 `CSS` 样式文件。

`Webpack` 拥有 `plugin` 机制，可以使用 `plugin` 在打包过程中的某个阶段对代码进行处理。

要分离样式文件，就需要使用到一个 `plugin`：`MiniCssExtractPlugin`。

执行以下命令：

```bash
yarn add mini-css-extract-plugin --dev
```

安装 `MiniCssExtractPlugin`，然后再对 `webpack.config.js` 做一些修改：

```js title="webpack.config.js" {2,22,26}
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
};
```

再执行 `yarn build`，会发现在当前目录下多了一个 `main.css`。

回到 `index.html` 中，将分离出来的 `main.css` 单独引入：

```html title="index.html" {8}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>basic webpack demo</title>
    <link rel="stylesheet" href="./main.css" />
  </head>
  <body>
    <div id="app"></div>
    <script src="./bundle.js"></script>
  </body>
</html>
```

再回到页面中，`Hello, Webpack!` 也实现了水平居中。打开控制台，可以看到样式 `main.css` 被正确引入了。
