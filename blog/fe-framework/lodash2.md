---
id: lodash2
title: Lodash 源码解读（二）
---

## 前言

书接上文：[Lodash 源码解读（一）](https://blog.jack-wjq.cn/blog/fe-framework/lodash1)

## .internal

### arrayIncludesWith

```js title=".internal/arrayIncludesWith.js"
/**
 * 类似 arrayIncludes 的函数
 * 不同之处在于可以传入一个比较函数
 *
 * @private
 * @param {Array} [array] 需要查找的数组
 * @param {*} target 需要搜索的值
 * @param {Function} comparator 对每个元素调用的比较函数
 * @returns {boolean} 如果 target 被找到则返回 true 否则返回 false
 */
function arrayIncludesWith(array, target, comparator) {
  // 利用了 JavaScript 在 == 时会自动进行类型转换的特性
  // 过滤了 undefined 和 null
  if (array == null) {
    return false;
  }

  for (const value of array) {
    if (comparator(target, value)) {
      return true;
    }
  }
  return false;
}

export default arrayIncludesWith;
```

### arrayLikeKeys

```js title=".internal/arrayLikeKeys.js"
import isArguments from '../isArguments.js';
import isBuffer from '../isBuffer.js';
import isIndex from './isIndex.js';
import isTypedArray from '../isTypedArray.js';

/** 从 Object 的 prototype 上取 hasOwnProperty 用于检测对象本身的属性 */
const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * 为 array-like 的值创建可枚举属性名的数组
 *
 * @private
 * @param {*} value 需要查询的值
 * @param {boolean} inherited 指定返回继承（原型上）的属性名
 * @returns {Array} 返回可枚举属性名的数组
 */
function arrayLikeKeys(value, inherited) {
  // 判断是否为 array 或 array-like
  const isArr = Array.isArray(value);
  const isArg = !isArr && isArguments(value);
  const isBuff = !isArr && !isArg && isBuffer(value);
  const isType = !isArr && !isArg && !isBuff && isTypedArray(value);
  // 如果 value 是 array 或 array-like 则需要收集 index
  const skipIndexes = isArr || isArg || isBuff || isType;
  const length = value.length;
  // 实例化一个新数组 长度为 value.length 相同或为 0
  // 新数组长度取决于 value 是否为 array 或 array-like
  const result = new Array(skipIndexes ? length : 0);
  let index = skipIndexes ? -1 : length;
  // 收集 index
  while (++index < length) {
    result[index] = `${index}`;
  }
  for (const key in value) {
    if (
      // 如果 inherited 为 true 则允许遍历继承（原型上）的属性名
      // 否则只允许遍历自身的属性名
      (inherited || hasOwnProperty.call(value, key)) &&
      // 如果 value 是 array 或 array-like
      // 且当前属性名为 length 或当前属性为 index
      // 则跳过当前属性名
      !(
        skipIndexes &&
        // Safari 9 在严格模式下 arguments.length 是可枚举的
        (key === 'length' ||
          // 跳过 index
          isIndex(key, length))
      )
    ) {
      result.push(key);
    }
  }
  return result;
}

export default arrayLikeKeys;
```

`arrayLikeKeys` 函数的作用比较难直接通过阅读源码来理解，所以需要逐行解析一下。

```js
const isArr = Array.isArray(value);
const isArg = !isArr && isArguments(value);
const isBuff = !isArr && !isArg && isBuffer(value);
const isType = !isArr && !isArg && !isBuff && isTypedArray(value);
const skipIndexes = isArr || isArg || isBuff || isType;
```

一连串的或且非运算，为了判断 `value` 是否为 `array/array-like`，如果是则需要收集 `index` 至 `result` 中，否则不需要。

```js
const length = value.length;
const result = new Array(skipIndexes ? length : 0);
```

如果需要收集 `index` 则实例化一个与 `value` 等长的数组，否则实例化一个长度为 `0` 的数组。

```js
let index = skipIndexes ? -1 : length;
while (++index < length) {
  result[index] = `${index}`;
}
```

同理，如果需要收集 `index`，则需要将 `index` 初始化为 `-1`，从左向右遍历，否则跳过收集 `index` 的过程（遍历）。

但是可以看到后面使用了 `for...in` 遍历 `value` 的 `key`，`index` 应该也是会被遍历出来的，为什么还是使用了一个 `while` 循环来遍历 `index` 呢？

这里涉及到了一个比较深入的知识点：

```js
const arr = new Array(100);
arr[0] = 0;
arr[50] = 50;
arr[99] = 99;
for (const index in arr) {
  console.log(index);
}
// => 0
// => 50
// => 99
```

在数组为稀疏数组时，`for...in` 不会遍历所有 `index`。

```js
for (const key in value) {
  if (
    (inherited || hasOwnProperty.call(value, key)) &&
    !(skipIndexes && (key === 'length' || isIndex(key, length)))
  ) {
    result.push(key);
  }
}
```

`value` 上的其他属性需要用 `for...in` 遍历，由于 `for...in` 还会遍历 `value` 原型上的属性，所以还需要对属性做一层判断。

```js
inherited || hasOwnProperty.call(value, key);
```

`inherited` 为 `true` 时允许遍历原型上的属性,否则只允许遍历自身属性.

```js
!(skipIndexes && (key === 'length' || isIndex(key, length)));
```

当 `value` 为 `array/array-like` 时，`index` 已经被遍历过，所以在这里要跳过。

但是 `Safari 9` 在严格模式下 `arguments.length` 是可枚举的，所以会被遍历到，需要剔除。

最终所有符合条件的属性名都会被 `push` 到 `result` 中并返回。

`arrayLikeKeys` 函数引入了 `isArguments`、`isBuffer`、`isIndex`、`isTypedArray` 函数，所以这些函数的实现也需要了解一下。

```js title="isArguments.js"
import getTag from './.internal/getTag.js';
import isObjectLike from './isObjectLike.js';

/**
 * 检测 value 是否为 arguments 对象
 *
 * @since 0.1.0
 * @category Lang
 * @param {*} value 需要检测的值
 * @returns {boolean} 如果 value 为 arguments 对象则返回 true 否则返回 false
 * @example
 *
 * isArguments(function() { return arguments }())
 * // => true
 *
 * isArguments([1, 2, 3])
 * // => false
 */
function isArguments(value) {
  return isObjectLike(value) && getTag(value) == '[object Arguments]';
}

export default isArguments;
```

`isArguments` 函数又引入了 `isObjectLike` 和 `getTag` 函数，所以这些函数的实现也需要了解一下。

```js title="isObjectLike.js"
/**
 * 检测 value 是否为 object-like
 * object-like 的 value 不为 null 且 typeof 的结果为 "object"
 *
 * @since 4.0.0
 * @category Lang
 * @param {*} value 需要检测的值
 * @returns {boolean} 如果 value 为 object-like 则返回 true 否则返回 false
 * @example
 *
 * isObjectLike({})
 * // => true
 *
 * isObjectLike([1, 2, 3])
 * // => true
 *
 * isObjectLike(Function)
 * // => false
 *
 * isObjectLike(null)
 * // => false
 */
function isObjectLike(value) {
  // JavaScript 历史遗留问题
  // typeof null === "object"
  // 在最初的 JavaScript 中 值是以 32 位为一个内存单元存储的
  // 每个内存单元包含 1~3 位类型标记和值的实际数据内容
  // 类型标记为 000 的值为 object 实际数据内容为对象的引用
  // null 表示空值 即 32 位全为 0
  return typeof value === 'object' && value !== null;
}

export default isObjectLike;
```

```js title=".internal/getTag.js"
/* 从 Object 的 prototype 上取 toString 用于获取类型标记 */
const toString = Object.prototype.toString;

/**
 * 获取 value 的 toStringTag
 *
 * @private
 * @param {*} value 需要检测的值
 * @returns {string} 返回 toStringTag
 */
function getTag(value) {
  // 利用了 JavaScript 在 == 时会自动进行类型转换的特性
  // 过滤了 undefined 和 null
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]';
  }
  return toString.call(value);
}

export default getTag;
```

鉴于 `isBuffer`、`isIndex`、`isTypedArray` 函数较为复杂，请看下回分解。
