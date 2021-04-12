---
id: xstate1
title: 状态管理新思路：有限状态机在前端的应用
---

## 前言

对于前端开发者来说，视图和业务逻辑总是绕不开的话题，视图效果越来越绚丽，业务逻辑也越来越复杂。

随着前端应用越来越庞大，对于业务逻辑的修改也会越来越麻烦。对于状态管理而言，往往在各个函数当中去修改状态管理相关的代码。

在实际开发项目的过程中，ETC 原则，即 Easier To Change，易于变更是非常重要的。为什么解耦很好？ 为什么单一职责很有用？ 为什么好的命名很重要？因为这些设计原则让你的代码更容易发生变更。ETC 甚至可以说是其他原则的基石，可以说，我们现在所做的一切都是为了更容易变更。

举一个非常常见的场景：在电商/外卖平台，通常会有一个商品的物流状态展示，一般情况下会是一个流程图，上面显示着一些关键节点，然后当前的物流状态会对应某一个关键节点，视觉效果上看起来就像下面这张图一样：

![流程](http://cdn.jack-wjq.cn/PicGo/image-20210412122634687.png)

对于这样的业务场景，我们通常会使用一个枚举，将每一个关键节点对应状态的某一个值，然后通过修改状态的值来实现状态流转的操作，对应的 Vue 代码可能是这样的：

```vue title="Steps.vue"
<template>
  <van-steps :active="active">
    <van-step>买家下单</van-step>
    <van-step>商家接单</van-step>
    <van-step>买家提货</van-step>
    <van-step>交易完成</van-step>
  </van-steps>
  <van-button @click="nextStep">下一步</van-button>
</template>

<script>
import {ref} from 'vue';

export default {
  setup() {
    const active = ref(1);

    const nextStep = () => {
      active.value = (active.value + 1) % 4;
    };

    return {active, nextStep};
  },
};
</script>
```

`active` 对应当前节点，分别有四种状态，对应 `active` 的值为 `0 1 2 3`，任意时刻只处于一种状态，即 `active` 只有可能是 `0 1 2 3` 四个数字的其中一个值，不可能出现某个时间处于两种状态的情况。

当我们点击下一步的按钮，状态就会开始流转：

![demo](https://cdn.jack-wjq.cn/state-demo.gif)

看起来很正常，但是实际上有个问题，就是当状态流转到最后一个节点的时候，再点击下一步，就会回到第一个节点。

因为我们这里做了一个取模的操作，如果想要限制节点流转到最后一个就不能继续向下流转了，就需要写条件语句来约束。

假如我们这里又加入了一个上一步的操作，那么还需要写一个条件语句来限制状态流转到第一个节点就不能继续向上流转了。

这只是一个非常简单的示例，单纯实现一个这样的状态流转逻辑就已经非常麻烦了，如果我们的应用越来越庞大，相应的状态节点也越来越多，这个组件就会变得越来越复杂，越来越难以维护。

假如在维护的过程中需要加入一个状态节点，可以想象需要修改的地方有多少！

同样的场景很多，例如分步骤的表单、各种各样的营销活动页小游戏等等，这样的场景往往都有一些特点：

- 状态节点有限
- 任意时刻只处于一个状态节点
- 在特定条件下需要进行状态流转

想要轻松、快速、安全地修改状态流转的场景，不仅仅需要我们对于同类型场景开发的经验，也需要一些工具来辅助。

> 关注 **「Hello FE」** 获取更多内容

## 有限状态机（Finite State Machine）

**有限状态机（Finite State Machine, FSM）**是一种用来描述系统行为的数学模型，这个系统在任意时刻只会存在一种状态。

一个完整的有限状态机包含五个部分：

- 有限数量的**状态**（state）
- 有限数量的**事件**（event）
- 一个**初始状态**（initial state）
- 一个**转换函数**（transition function），传入当前状态和事件返回下一个状态
- 具有零个或多个**最终状态**（final state）

看到对于有限状态机的描述，你可能会发现：`Promise` 就是一个有限状态机。

为什么这么说？

因为 `Promise` 完全符合有限状态机的定义：

- 有限数量的**状态**（`pending`，`fulfilled`，`rejected`）
- 有限数量的**事件**（`resolve`，`reject`）
- 一个**初始状态**（`pending`）
- 一个**转换函数**（`executor`）
- 具有零个或多个**最终状态**（`fulfilled`，`rejected`）

拿红绿灯来举例，对于单个红绿灯而言，在任意时刻只有可能是 **红、绿、黄** 三种颜色的任意一种，不可能出现在某个时刻处于两种或两种以上的状态的情况，在某个时刻红绿灯的颜色可能会发生变化，颜色发生变化的这个事件是固定的，只有 **红 => 绿、绿 => 黄、黄 => 红** 三种事件。

用代码来实现可能是这样的：

```js title="light.js"
const light = {
  currentState: 'red',

  transition() {
    switch (this.currentState) {
      case 'red':
        return (this.currentState = 'green');
      case 'green':
        return (this.currentState = 'yellow');
      case 'yellow':
        return (this.currentState = 'red');
      default:
        return;
    }
  },
};
```

状态流转图可能是这样的：

![红绿灯](http://cdn.jack-wjq.cn/PicGo/light.jpg)

有限状态机在游戏开发领域有非常广泛的应用，用这种方式可以使每一个状态都是独立的代码块，与其他不同的状态分开独立运行，这样很容易检测遗漏条件和移除非法状态，减少了耦合，提升了代码的健壮性，使得游戏的调试变得更加方便，同时也更易于增加新的功能。

对于前端而言，有限状态机的应用同样具有非常重要的意义。使用有限状态机对状态进行管理能够实现低耦合的代码，能够有效避免重复点击、重复请求等情况，不仅能够轻松、快速、安全地修改状态流转场景，还非常有利于单元测试，提升开发幸福感。

## `XState` 简介

> XState: JavaScript and TypeScript finite state machines and statecharts for the modern web.

`XState` 是一个服务于现代前端应用的基于 JavaScript 和 TypeScript 的有线状态机和状态图框架。

`XState` 的功能非常强大，官方还提供了[可视化工具](https://xstate.js.org/viz/)，用于预览状态机以及查看状态流转。

在学习如何使用之前，先使用 `npm` 或 `yarn` 安装 `XState`：

```bash
npm install xstate
# 或
yarn add xstate
```

## `XState` 实现 `Promise`

既然 `Promise` 是一个有限状态机，那么使用 `XState` 也能实现一个相似的效果。

首先我们需要定义 `Promise` 的所有状态（`pending`，`fulfilled`，`rejected`）以及设置初始状态为 `pending`：

```js title="promiseMachine.js"
import {Machine} from 'xstate';

const promiseMachine = Machine({
  // SCXML id 必须唯一
  id: 'promise',
  // 初试状态
  initial: 'pending',
  states: {
    // 状态定义
    pending: {},
    fulfilled: {},
    rejected: {},
  },
});
```

其中 [`SCXML`](https://www.oschina.net/action/GoToLink?url=https%3A%2F%2Fwww.w3.org%2FTR%2Fscxml) 是状态图可扩展标记语言， `XState` 遵循该标准，所以需要提供 `id`。当前状态机也可以转换为 `JSON` 或 `SCXML`。

然后我们需要定义状态流转的事件（`RESOLVE`，`REJECT`），同时根据 `Promise` 的定义，将 `fulfilled` 和 `rejected` 的两个状态标记为最终状态，让状态流转到这两个状态时终止状态流转：

```js title="promiseMachine.js"
import {Machine} from 'xstate';

const promiseMachine = Machine({
  // SCXML id 必须唯一
  id: 'promise',
  // 初试状态
  initial: 'pending',
  states: {
    // 状态定义
    pending: {
      on: {
        // resolve 事件
        RESOLVE: 'fulfilled',
        // reject 事件
        REJECT: 'rejected'
      }
    },
    fulfilled: {
      type: 'final'
    },
    rejected: {
      type: 'final'
    }
  }
});
```

现在，我们已经定义好了一个类似 `Promise` 的有限状态机，但是这样我们每次在做状态流转的时候，都需要向 `promiseMachine.transition` 函数传入当前状态和状态流转事件的名称：

```js title="promiseMachine.js"
const state0 = promiseMachine.initialState;
console.log(state0); // 'pending'
const state1 = promiseMachine.transition(state0, 'RESOLVE');
console.log(state1); // 'fulfilled'
```

至于 `transition` 函数为什么需要传入当前的状态和状态流转事件，是因为 `transition` 需要是一个纯函数，它不能更改 `promiseMachine` 的状态，造成不必要的副作用，方便单元测试。

事实上我们在开发的过程中如果每个状态都要我们自己保存并传入 `transition` 函数来进行状态流转是非常麻烦的，所以 `XState` 提供了 `interpret` 函数，可以将一个状态机的实例解释为一个带有状态的 `Service`：

```js title="promiseMachine.js"
import {Machine, interpret} from 'xstate';

const promiseMachine = Machine({
  // ...
});

const promiseService = interpret(promiseMachine)
	// transition 钩子 状态流转时触发
	.onTransition((state) => {
 		// 打印状态流转后的状态
  	console.log(state.value)
});

// 启动状态机
promiseService.start();
// 'pending'

promiseService.send('RESOLVE');
// 'fulfilled'
```

这样一个简单好用、类似 `Promise` 的状态机就实现了。

## `XState` 实现红绿灯

简单的例子往往能够帮助我们初步掌握和理解 `XState` 的用法，现在引入一个稍微复杂一点的例子——红绿灯，将有限状态机部分的红绿灯例子用 `XState` 实现：

```js title="lightMachine.js"
import {Machine, interpret} from 'xstate';

const lightMachine = Machine({
  id: 'light',
  initial: 'red',
  states: {
    red: {
      on: {
        TRANS: 'green',
      },
    },
    green: {
      on: {
        TRANS: 'yellow',
      },
    },
    yellow: {
      on: {
        TRANS: 'red',
      },
    },
  },
});

const lightService = interpret(lightMachine).onTransition((state) => {
  console.log(state.value);
});

// 启动状态机 初始化
lightService.start();

// 发送事件
lightService.send('TRANS'); // 'green'
lightService.send('TRANS'); // 'yellow'
lightService.send('TRANS'); // 'red'

// 批量发送事件
lightService.send(['TRANS', 'TRANS']);

// 终止状态机
lightService.stop();
```

除此之外，`XState` 还提供了与 `React`、`Vue`、`Svelte` 等现代前端框架结合的一些方法：

```jsx title="App.jsx"
import React from 'react';
import {useMachine} from '@xstate/react';
import lightMachine from './lightMachine';

export default function App() {
  const [state, send] = useMachine(lightMachine);

  const onClick = () => {
    send('TRANS');
  };

  return (
    <>
      <div
        style={{
          width: '50px',
          height: '50px',
          background: state.value,
          borderRadius: '100%',
        }}
      />
      <button onClick={onClick}>click</button>
    </>
  );
}
```

点击预览：[React Demo](https://codesandbox.io/s/xstate-react-demo-zsz4v?file=/src/App.js)

```vue title="App.vue"
<template>
  <div class="light" :style="`background: ${state.value};`"></div>
  <button @click="onClick">click</button>
</template>

<script>
import {defineComponent} from 'vue';
import {useMachine} from '@xstate/vue';
import lightMachine from './lightMachine';

export default defineComponent({
  name: 'App',

  setup() {
    const {state, send} = useMachine(lightMachine);

    const onClick = () => {
      send('TRANS');
    };

    return {
      state,
      onClick,
    };
  },
});
</script>

<style>
.light {
  width: 50px;
  height: 50px;
  border-radius: 100%;
}
</style>
```

点击预览：[Vue Demo](https://codesandbox.io/s/xstate-vue-demo-3lxfl?file=/src/App.vue)

```svelte title="App.svelte"
<script>
  import { useMachine } from "@xstate/svelte";
  import lightMachine from "./lightMachine";

  const { state, send } = useMachine(lightMachine);

  const onClick = () => {
    send("TRANS");
  };
</script>

<style>
  .light {
    width: 50px;
    height: 50px;
    border-radius: 100%;
  }
</style>

<main>
	<div class="light" style={`background: ${$state.value};`}></div>
  <button on:click={onClick}>click</button>
</main>
```

点击预览：[Svelte Demo](https://codesandbox.io/s/xstate-svelte-demo-8qu4q?file=/App.svelte)

## `XState` 进阶用法

以上演示的都是非常基础的用法，状态和事件都比较少，实际生产实践中可能出现非常复杂的情况，例如多层状态嵌套、状态流转上下文、异步事件、事件副作用、状态流转保护等等。

更加深入的内容就需要到[官方文档](https://xstate.js.org/docs/)中自行探索了！

## 总结

关于有限状态机的应用，还是之前在淘系用户增长团队实习的时候，组里的师兄做技术分享了解到的。

为什么突然想起来这个内容呢？其实是我最近在代码的过程中遇到了一个带流程的表单场景，用户需要填写两个表单：必填表单和选填表单。只有填完所有的表单后才能跳转至完成页面。用户也能够看到自己所处的表单类型，可以点击流程图里的节点切换表单。

这个场景想了想用简单的方式来实现也很简单，但是代码很不优雅，可拓展性也极差，万一以后流程需要更改，那就是一场灾难了。

回忆起当时实习的时候了解到的有限状态机的概念，以及 `XState` 这个库，就翻了翻文档捡了起来，甚至感觉可以替代 `Redux` 之类的状态管理库？

总体而言，使用有限状态机来管理页面的状态应该是前端状态管理的一个新思路。

## 参考资料

- [利用 XState（有限状态机） 编写易于变更的代码 | OSCHINA](https://my.oschina.net/wsafight/blog/4680571)
- [轻量、可靠的移动端 Vue 组件库 | Vant](https://vant-contrib.gitee.io/vant/v3/#/zh-CN/home)
- [有限状态机 | 维基百科](https://zh.wikipedia.org/wiki/%E6%9C%89%E9%99%90%E7%8A%B6%E6%80%81%E6%9C%BA)
- [XState 新手教學（Finite State Machine）| Jerry Hong](https://blog.jerry-hong.com/posts/xstate-tutorials-state-machine/)
- [Promise | 现代 JavaScript 教程](https://zh.javascript.info/promise-basics)
- [Documentation | XState](https://xstate.js.org/docs/)
- [Promise | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
