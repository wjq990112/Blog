---
id: webpack4
title: Webpack 详解（二）
---

## 核心概念

在更加深入之前，需要了解一下 `Webpack` 核心概念。

对于 `Webpack` 而言，一切皆模块。基于模块化编程的思想，开发者将一个完整的应用拆分成多个代码片段，这些代码片段就被称为模块。

每个模块的体积小于完整的应用的体积，这使得每个模块可以较为轻松地进行调试并测试验证。编写良好的模块提供了可靠的抽象和封装边界，因此每个模块在整个应用中都具有一致的设计和明确的目的。

### 哪些是一个 `Webpack` 模块？

- 一个 `ES6` 的 `import` 语句
- 一个 `CommonJS` 的 `require` 方法
- 一个 `AMD` 的 `define` 和 `require` 语句
- 一个 `CSS/Sass/Less` 的 `@import` 语句
- 一个 `CSS` 中的 `url()` 方法或者一个 `HTML` 中的 `<img src=""/>` 标签引用的内容

### 支持的模块类型

- `ES Module`
- `CommonJS Module`
- `AMD Module`
- 静态资源
- `WebAssembly Module`

除此之外，`Webpack` 还可以通过 `loader` 支持一些其他类型的模块，例如：

- `CoffeeScript`
- `TypeScript`
- `ESNext(babel)`
- `Sass`
- `Less`
- `Stylus`
- `Elm`
- ...

## Loader

作为 `Webpack` 的两大核心机制之一，`loader` 为 `Webpack` 提供了多种类型文件（模块）的处理能力。

`loader` 是用于进行模块源代码转换的，在打包构建的过程中，有很多多的文件不能被 `JavaScript` 识别，对于 `JavaScript` 本身，只能识别 `js` 文件或 `json` 文件，除此以外的文件类型，必须经过 `loader` 转换后才能被 `JavaScript` 识别。

`loader` 的机制有点类似其他构建工具（例如：`Gulp`）的 `task`，提供了文件的预处理能力。

以一个简单的计数器为例：

目录结构如下：

```
.
├── index.html
├── package.json
├── src
│   ├── index.module.css
│   └── index.ts
├── tsconfig.json
├── types.d.ts
├── webpack.config.js
└── yarn.lock
```

`Webpack` 配置如下：

```js title="webpack.config.js"
const path = require('path');

module.exports = {
  devtool: false,
  mode: 'development',
  context: path.join(__dirname, './src'),
  entry: './index.ts',
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
      },
    ],
  },
};
```

入口文件 `src/index.ts`：

```js title="src/index.ts"
import styles from './index.module.css';

(function render(element: HTMLElement) {
  const container = document.createElement('div');
  container.className = styles.container;
  container.addEventListener('click', function click(event) {
    const target = event.target as HTMLElement;

    switch (target.id) {
      case 'incButton':
        counter.innerText = String(Number(counter.innerText) + 1);
        return;
      case 'decButton':
        counter.innerText = String(Number(counter.innerText) - 1);
        return;
      default:
        return;
    }
  });

  const title = document.createElement('h1');
  title.innerText = 'Hello, Webpack!';

  const counter = document.createElement('div');
  counter.innerText = '0';

  const incButton = document.createElement('button');
  incButton.id = 'incButton';
  incButton.className = styles.button;
  incButton.innerText = '+';

  const decButton = document.createElement('button');
  decButton.id = 'decButton';
  decButton.className = styles.button;
  decButton.innerText = '-';

  const btnContainer = document.createElement('div');
  btnContainer.append(incButton, decButton);

  container.append(title, counter, btnContainer);

  element.append(container);
})(document.getElementById('app') as HTMLElement);
```

`CSS` 样式文件：

```css title="src/index.module.css"
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.button {
  background-color: lightskyblue;
  width: 32px;
  padding: 2px 4px;
  margin: 2px 4px;
  border-radius: 2px;
}
```

```html title="index.html"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>advance webpack demo</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="./dist/bundle.js"></script>
  </body>
</html>
```

在这个例子中，`Webpack` 本身是无法处理使用 `TypeScript` 编写的模块的。这个时候就需要借用 `loader` 的力量，将 `TypeScript` 编写的模块转换为 `JavaScript`。

同时在模块中还引用了 `CSS` 样式文件，且为 `CSS Module`，也需要借助 `loader` 对其进行处理。

最终的效果是这样的：

<img src="https://cdn.jack-wjq.cn/PicGo/image-20210205183713491.png" alt="Counter Demo" style={{zoom: '67%'}} />

点一下 `+` 计数器 `+1`，点一下 `-` 计数器 `-1`，大功告成。

回到 `loader` 的配置：

```js title="webpack.config.js" {11-30}
const path = require('path');

module.exports = {
  devtool: false,
  mode: 'development',
  context: path.join(__dirname, './src'),
  entry: './index.ts',
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
      },
    ],
  },
};
```

不难发现，可以通过 `test` 选项使用正则表达式对文件后缀进行匹配，使用对应的 `loader` 进行处理。

为了能够精准匹配对应的文件，`Webpack` 提供了三个选项：`test`、`include`、`exclude`，这三个选项都支持传入正则表达式或者正则表达式的数组，用于匹配对应文件。当传入的值为数组时，每一项之间是**或**的关系，命中任何一项就命中该规则。

精准匹配需要使用 `loader` 进行处理的文件后，需要在 `use` 选项中配置对应的 `loader`，`loader` 的加载顺序是从后往前的，可以通过 `enforce` 调整 `loader` 的加载顺序。

回到项目结构，在知道有 `include` 和 `exclude` 两个选项能够缩小匹配文件的范围时，上面的 `webpack.config.js` 可以再优化一下：

```js title="webpack.config.js" {15,28}
const path = require('path');

module.exports = {
  devtool: false,
  mode: 'development',
  context: path.join(__dirname, './src'),
  entry: './index.ts',
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: path.join(__dirname, './src'),
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        include: path.join(__dirname, './src'),
        use: ['ts-loader'],
      },
    ],
  },
};
```

这个 `Demo` 的规模还很小，无法体现出缩小匹配范围带来的构建速度上的提升，当项目规模较大的时候，构建速度上的提升会非常明显。

### Loader 详解

回顾上面的例子，会发现 `css-loader` 传入了一个参数 `module`，用于支持 `CSS Module`。

除了使用 `Object Options` 的方式传入一个参数之外，还能通过 `UrlSearchParams` 的方式传入：

```js title="webpack.config.js" {16}
const path = require('path');

module.exports = {
  devtool: false,
  mode: 'development',
  context: path.join(__dirname, './src'),
  entry: './index.ts',
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: path.join(__dirname, './src'),
        use: ['style-loader', 'css-loader?modules'],
      },
      {
        test: /\.tsx?$/,
        include: path.join(__dirname, './src'),
        use: ['ts-loader'],
      },
    ],
  },
};
```

上面讲解的都是 `loader` 最基础的用法，即使用配置文件 `webpack.config.js` 配置对应的文件使用对应的 `loader`。`Webpack` 还支持在引入对应文件的时候进行配置，以及在命令行配置。

```js
import styles from '!style-loader!css-loader?modules!./index.module.css';
```

或者

```js
import styles from '!style-loader!css-loader?{"modules":true}!./index.module.css';
```

也就是说，参数可以通过两种方式传入：

1. `?key=value&foo=bar`
2. `?{"key":"value","foo":"bar"}`

在引入对应文件的时候配置 `loader` 会覆盖 `webpack.config.js` 中已经配置好的 `loader`，有三种覆盖的方式：

- 以 `!` 开头会覆盖所有普通的 `loader`

```js
import styles from '!style-loader!css-loader?modules!./index.module.css';
```

- 以 `!!` 开头会覆盖所有的 `loader`（包括 `preLoader`、`loader` 和 `postLoader`）

```js
import styles from '!!style-loader!css-loader?modules!./index.module.css';
```

- 以 `-!` 开头会覆盖所有的 `preLoader` 和 `loader`，但不会覆盖 `postLoader`

```js
import styles from '-!style-loader!css-loader?modules!./index.module.css';
```

在命令行配置：

```bash
webpack --module-bind 'ts=ts-loader' --module-bind 'css=style-loader!css-loader'
```
