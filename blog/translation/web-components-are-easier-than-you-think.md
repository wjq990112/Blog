---
id: web-components-are-easier-than-you-think
title: 「译」Web Components 并没有你想象中的那么复杂
slug: /translation/
---

> 原文地址：[Web Components Are Easier Than You Think](https://css-tricks.com/web-components-are-easier-than-you-think/)
>
> 作者：[John Rhea](https://css-tricks.com/author/johnrhea/)
>
> 翻译：[炽翎同学](https://juejin.cn/user/3122268753634541)

## 前言

我参加了一个技术交流大会，看到一些大佬演示 Web Components，感觉它非常漂亮，但是好像有点复杂过头了 —— 用近千行的 JavaScript 代码来表示个位数行数的 HTML 代码。大佬们总是不可避免地掩盖 Web Components 需要大量的 JavaScript 代码才能正常运行的这个问题，或者深入一些看起来无关紧要的细节。到了这个环节我的目光就开始变得呆滞，开始发呆。

但是在最近的一个[作为参考文献的项目](https://undead.institute/zombie-reference/)中，为了让学习 HTML 变得更容易，作为一个完美主义者的我决定我必须涵盖规范中的每一个 HTML 标签。除了那些会议展示的内容，这是我第一次介绍 `<slot>` 和 `<template>` 标签。为了写出即准确又有趣的内容，我不得不深入研究它们。

在这个过程中，我总结出了一些经验 —— **Web Components 并没有我们记忆中的那么复杂。**

自从上次在技术交流大会上发呆到现在，Web Components 已经取得了长足进步，或许是我最初对它的恐惧阻碍了我进一步了解它（也可能是发呆和恐惧两者都有？）。

我将会用这篇文章告诉你：**是的，你可以创建一个 Web Component！**

不要发呆，不要恐惧，就是现在，一起尝试一下。

## 从 `<template>` 开始

`<template>` 是一个 HTML 标签，可以用它来创建一个 Web Component 的 HTML 模板。模板不一定需要大量的 HTML 代码，它可以非常简单：

```html
<template>
  <p>The Zombies are coming!</p>
</template>
```

`<template>` 标签非常重要，因为必须使用它作为根元素将所有的 HTML 模板结合在一起。就像是高楼大厦的地基，它是构建 Web Component 的基础。接下来将使用这段代码作为 `<apocalyptic-warning>` 这个 Web Component 的 HTML 模板，作为僵尸末日来临时的警告。

## 接着是 `<slot>`

`<slot>` 跟 `<template>` 一样也是一个 HTML 标签。在这里，`<slot>` 用于包裹 `<template>` 将要渲染到页面上的内容。

```html
<template>
  <p>The <slot>Zombies</slot> are coming!</p>
</template>
```

这里在 HTML 模板的 `<slot>` 标签中添加了 "Zombies" 这个词。如果不对这个 `<slot>` 标签做任何处理，就会默认展示 `<slot>` 标签中的内容。在这个例子中将会默认展示 "Zombies" 这个词。

使用 `<slot>` 标签更像是一个占位符，我们可以直接使用占位符，也可以定义一些其他内容来替换它，通常使用 `name` 属性来实现精确替换的能力。

```html
<template>
  <p>The <slot name="whats-coming">Zombies</slot> are coming!</p>
</template>
```

`name` 属性告诉 Web Component 哪些内容应该在模板的哪个位置。现在已经有了一个 `name` 为 `whats-coming` 的 `<slot>` 标签。除了 "Zombies"，`<slot>` 标签的部分可以灵活地放置其他内容，假设 "Zombies" 是最高级别的警告，它还可以被替换为 "Robots"、"Werewolves"，甚至是 "Web Components"。

## 使用 Web Component

从技术上讲，前面已经完成了 Web Component 的编写工作，可以把它放到任何我们想要使用它的地方。

```html
<apocalyptic-warning>
  <span slot="whats-coming">Halitosis Laden Undead Minions</span>
</apocalyptic-warning>

<template>
  <p>The <slot name="whats-coming">Zombies</slot> are coming!</p>
</template>
```

在这里将 `<apocalyptic-warning>` 这个 Web Component 放在了页面上，就像使用其他 HTML 标签一样。但是在它中间还放置了一个 `<span>` 标签，这个 `<span>` 标签引用了 `<slot>` 标签的 `name` 属性。在这个 `<span>` 标签中的内容就是在组件渲染的时候用来替换 "Zombies" 的内容。

> 这里有一点必须提一下：自定义标签的名称中必须带有连字符，这么做是为了防止与 HTML 发布的新标签发生冲突。

为了使 `<slot>` 能够被替换，还有一些工作要做，接下来就是编写 JavaScript 代码的时候了。

## 注册 Web Component

就像我说的那样，确实需要一些 JavaScript 代码才能上面的这些代码能够正常工作，不过并没有我想象中的那么复杂 —— 数千行、深入细节的 JavaScript 代码。希望我也能通过这段 JavaScript 代码说服你学习 Web Components。

你需要一个构造函数来注册自定义标签，如果不注册它的话，这个 Web Component 就像一尊石像一样，一动不动且没有生命力。

这就是即将使用的构造函数：

```js
// 用一个合适的名字定义这个自定义标签 在这里是 <apocalyptic-warning>
customElements.define(
  'apocalyptic-warning',

  // 确保这个自定义标签拥有内置 HTML 标签的所有默认属性和方法（继承 HTMLElement）
  class extends HTMLElement {
    // 构造函数 创建新的自定义标签的时候会被调用
    constructor() {
      // 调用父类的构造函数 即 HTMLElement 的构造函数 保证与创建内置 HTML 标签的行为完全相同
      super();

      // 获取 <template> 并将其保存在 warning 中
      const warning = document.getElementById('warningtemplate');

      // 获取 warning 的内容并将其保存在 mywarning 中
      const mywarning = warning.content;

      const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(
        mywarning.cloneNode(true),
      );
    }
  },
);
```

我在上面的代码中每一行都留下了详细的注释，除了最后一行：

```js
const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(
  mywarning.cloneNode(true),
);
```

这一行代码做了很多事情：首先要使用自定义标签并创建一个 Shadow DOM，`{ mode: 'open' }` 意味着 `:root` 外部的 JavaScript 代码可以访问和操作这个 Shadow DOM，可以理解为设置 Web Component 的后门。

在这里创建了一个 Shadow DOM，并向其添加了一个节点，这个节点是前面 HTML 模板的深拷贝，包括模板的所有标签和文本内容。将模板添加到自定义标签的 Shadow DOM 上后，`<slot>` 的位置会被 `name` 属性匹配的内容接管。

现在来看看效果，这里防止了两个相同的组件实例，只需要修改一个标签就能呈现不同的内容。

<iframe height="265" style={{ width: '100%' }} scrolling="no" title="The ______ Are Coming!" src="https://codepen.io/undeadinstitute/embed/qBavGXX?height=265&theme-id=dark&default-tab=html,result" frameBorder="no" loading="lazy" allowtransparency="true" allowFullScreen={true}>
  See the Pen <a href='https://codepen.io/undeadinstitute/pen/qBavGXX'>The ______ Are Coming!</a> by Undead Institute
  (<a href='https://codepen.io/undeadinstitute'>@undeadinstitute</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## 为 Web Component 添加样式

你可能已经出注意到 Demo 中的样式了，如你所料，我们绝对有能力使用 CSS 为 Web Component 设置样式。事实上我们可以在 `<template>` 中包含一个 `<style>` 元素。

```html
<template id="warningtemplate">
  <style>
    p {
      background-color: pink;
      padding: 0.5em;
      border: 1px solid red;
    }
  </style>

  <p>The <slot name="whats-coming">Zombies</slot> are coming!</p>
</template>
```

像这样，由于 Shadow DOM，样式直接作用于当前 Web Component，并没有造成全局样式污染。

现在在我的意识当中，会认为自定义标签是一个 `<template>` 的副本，然后将我添加的内容插入到 `<template>` 中，再使用 Shadow DOM 将其注入到页面当中。但是这只是你在前端看到的样子，事实上它在 DOM 中并不是这样工作的。自定义标签中的内容会出现在它原本的位置，而 Shadow DOM 更像是一个蒙版，被放置在自定义标签的顶部。

![Element](http://cdn.jack-wjq.cn/PicGo/image-20210309200921512.png)

在技术层面上，插入其中的内容是处于 `<template>` 之外的，因此写在 `<template>` 中的 `<style>` 标签里的任何后代选择器和 `class` 都无法对插入其中的内容产生影响，这个特性导致我们不能像期望的那样完全封装一个 Web Component。但是自定义的标签也是一个 HTML 标签，我们可以在任何 CSS 文件当中使用标签选择器选中它，包括主样式表。而且，尽管插入其中的内容在技术层面上不在 `<template>` 中，但是在自定义标签中，CSS 后代选择器仍将起作用。

```css
apocalyptic-warning span {
  color: blue;
}
```

<iframe height="265" style={{ width: '100%' }} scrolling="no" title="The ______ Are Coming and They're Blue..." src="https://codepen.io/undeadinstitute/embed/wvodjjY?height=265&theme-id=dark&default-tab=html,result" frameBorder="no" loading="lazy" allowtransparency="true" allowFullScreen={true}>
  See the Pen <a href='https://codepen.io/undeadinstitute/pen/wvodjjY'>The ______ Are Coming and They're Blue...</a> by Undead Institute
  (<a href='https://codepen.io/undeadinstitute'>@undeadinstitute</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

但是要当心！CSS 文件中的样式无法访问 `<template>` 和 Shadow DOM 中的标签。

## 把他们合在一起

让我们来看一个例子，做一个僵尸资料卡，就像僵尸末日之后你可能需要的个人资料一样。为了能够对默认的内容和任何插入其中的内容进行样式设置，我们即需要 `<template>` 中的 `<style>` 标签，又需要 CSS 文件中的样式。

现在除了我们使用的 Web Component 名称是 `<zombie-profile>`，与之前的不同之外，其他的 JavaScript 代码完全一致。

```js
customElements.define(
  'zombie-profile',
  class extends HTMLElement {
    constructor() {
      super();
      const profile = document.getElementById('zprofiletemplate');
      const myprofile = profile.content;
      const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(
        myprofile.cloneNode(true),
      );
    }
  },
);
```

这是 HTML 模板，包括封装的 CSS：

```html
<template id="zprofiletemplate">
  <style>
    img {
      width: 100%;
      max-width: 300px;
      height: auto;
      margin: 0 1em 0 0;
    }
    h2 {
      font-size: 3em;
      margin: 0 0 0.25em 0;
      line-height: 0.8;
    }
    h3 {
      margin: 0.5em 0 0 0;
      font-weight: normal;
    }
    .age,
    .infection-date {
      display: block;
    }
    span {
      line-height: 1.4;
    }
    .label {
      color: #555;
    }
    li,
    ul {
      display: inline;
      padding: 0;
    }
    li::after {
      content: ', ';
    }
    li:last-child::after {
      content: '';
    }
    li:last-child::before {
      content: ' and ';
    }
  </style>

  <div class="profilepic">
    <slot name="profile-image"
      ><img src="https://assets.codepen.io/1804713/default.png" alt=""
    /></slot>
  </div>

  <div class="info">
    <h2><slot name="zombie-name" part="zname">Zombie Bob</slot></h2>

    <span class="age"
      ><span class="label">Age:</span> <slot name="z-age">37</slot></span
    >
    <span class="infection-date"
      ><span class="label">Infection Date:</span>
      <slot name="idate">September 12, 2025</slot></span
    >

    <div class="interests">
      <span class="label">Interests: </span>
      <slot name="z-interests">
        <ul>
          <li>Long Walks on Beach</li>
          <li>brains</li>
          <li>defeating humanity</li>
        </ul>
      </slot>
    </div>

    <span class="z-statement"
      ><span class="label">Apocalyptic Statement: </span>
      <slot name="statement">Moooooooan!</slot></span
    >
  </div>
</template>
```

这是在我们的主 CSS 文件中对 `<zombie-profile>` 标签及其后代设置的 CSS 样式。注意这里重复的部分，它们是用来确保替换的标签和模板中的标签样式是相同的。

```css
zombie-profile {
  width: calc(50% - 1em);
  border: 1px solid red;
  padding: 1em;
  margin-bottom: 2em;
  display: grid;
  grid-template-columns: 2fr 4fr;
  column-gap: 20px;
}
zombie-profile img {
  width: 100%;
  max-width: 300px;
  height: auto;
  margin: 0 1em 0 0;
}
zombie-profile li,
zombie-profile ul {
  display: inline;
  padding: 0;
}
zombie-profile li::after {
  content: ', ';
}
zombie-profile li:last-child::after {
  content: '';
}
zombie-profile li:last-child::before {
  content: ' and ';
}
```

现在都合在一起了！

<iframe height="265" style={{ width: '100%' }} scrolling="no" title="Zombie Profiles" src="https://codepen.io/undeadinstitute/embed/zYoxeXL?height=265&theme-id=dark&default-tab=result" frameBorder="no" loading="lazy" allowtransparency="true" allowFullScreen={true}>
  See the Pen <a href='https://codepen.io/undeadinstitute/pen/zYoxeXL'>Zombie Profiles</a> by Undead Institute
  (<a href='https://codepen.io/undeadinstitute'>@undeadinstitute</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

虽然还有一些问题和其他的细微差别，但我希望你现在比几分钟前更加了解 Web Components 并能够更加熟练地上手。就像我们在这里一样，先试一下。也许你可以在你的工作中到处添加自定义组件，找到 Web Components 的感觉和意义。

现在你更恐惧什么？是 Web Components 还是僵尸末日？在几分钟之前我可能会说我更恐惧 Web Components，但是现在我可以骄傲地说，僵尸末日是我担心的唯一一件事情。

> 其他值得学习参考的教程：[阮一峰：Web Components 入门实例教程](http://www.ruanyifeng.com/blog/2019/08/web_components.html)
>
> —— 译者注
