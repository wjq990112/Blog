---
id: lodash1
title: Lodash 源码解读（一）
---

## 前言

近期比较提升一下自己的代码功底，看到知乎有关注的大佬每天分析一个 `npm` 包的源码，想到自己的项目里用到 `Lodash` 的地方比较多，于是决定阅读一下 `Lodash` 的源码，看一看这种大型的开源工具函数库有哪些细节值得学习。

## .internal

### addMapEntry

```js title=".internal/addMapEntry.js"
/**
 * 向 map 中添加键值对
 *
 * @private
 * @param {Object} map 需要修改的 map
 * @param {Array} pair 需要添加至 map 中的键值对
 * @returns {Object} 返回修改后的 map
 */
function addMapEntry(map, pair) {
  // 不能返回 map.set 因为它在 IE 11 中是不能被链式调用的
  map.set(pair[0], pair[1]);
  return map;
}

export default addMapEntry;
```

### addSetEntry

```js title=".internal/addSetEntry.js"
/**
 * 向 set 中添加值
 *
 * @private
 * @param {Object} set 需要修改的 set
 * @param {*} value 需要添加至 set 中的值
 * @returns {Object} 返回修改后的 set
 */
function addSetEntry(set, value) {
  // 不能返回 set.add 因为它在 IE 11 中是不能被链式调用的
  set.add(value);
  return set;
}

export default addSetEntry;
```

### arrayEach

```js title=".internal/arrayEach.js"
/**
 * 数组 forEach 函数的专用版本
 *
 * @private
 * @param {Array} [array] 需要遍历的数组
 * @param {Function} iteratee 每次迭代调用的函数
 * @returns {Array} 返回遍历后的数组
 */
function arrayEach(array, iteratee) {
  let index = -1;
  const length = array.length;

  while (++index < length) {
    // 迭代调用的函数返回 false 时跳出
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

export default arrayEach;
```

### arrayEachRight

```js title=".internal/arrayEachRight.js"
/**
 * 数组 forEachRight 函数的专用版本
 *
 * @private
 * @param {Array} [array] 需要遍历的数组
 * @param {Function} iteratee 每次迭代调用的函数
 * @returns {Array} 返回遍历后的数组
 */
function arrayEachRight(array, iteratee) {
  let length = array == null ? 0 : array.length;

  while (length--) {
    // 迭代调用的函数返回 false 时跳出
    if (iteratee(array[length], length, array) === false) {
      break;
    }
  }
  return array;
}

export default arrayEachRight;
```

### arrayIncludes

```js title=".internal/arrayIncludes.js"
import baseIndexOf from './baseIndexOf.js';

/**
 * 数组 includes 的特殊版本
 * 不支持指定索引
 *
 * @private
 * @param {Array} [array] 需要查找的数组
 * @param {*} target 需要搜索的值
 * @returns {boolean} 如果 target 被找到则返回 true 否则返回 false
 */
function arrayIncludes(array, value) {
  // 利用了 JavaScript 在 == 时会自动进行类型转换的特性
  // 过滤了 undefined 和 null
  const length = array == null ? 0 : array.length;
  // 利用了 JavaScript 在 ! 时会自动进行类型转换的特性
  // 将 length 由 number 转换为 boolean
  return !!length && baseIndexOf(array, value, 0) > -1;
}

export default arrayIncludes;
```

这个函数引入了 `baseIndexOf` 函数，所以这个函数的实现也需要了解一下。

```js title=".internal/baseIndexOf.js"
import baseFindIndex from './baseFindIndex.js';
import baseIsNaN from './baseIsNaN.js';
import strictIndexOf from './strictIndexOf.js';

/**
 * indexOf 的基本实现
 * 不支持 fromIndex 的边界检查
 *
 * @private
 * @param {Array} array 需要查找的数组
 * @param {*} value 需要搜索的值
 * @param {number} fromIndex 查找起始索引
 * @returns {number} 如果查找到匹配的值则返回其索引 否则返回 -1
 */
function baseIndexOf(array, value, fromIndex) {
  // 利用了 JavaScript 的 NaN 不等于 NaN 本身的特性
  // 区分了 NaN 与非 NaN
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

export default baseIndexOf;
```

同样，`baseIndexOf` 函数引入了 `baseFindIndex`、`baseIsNaN`、`strictIndexOf` 函数，所以这些函数的实现也需要了解一下。

```js title=".internal/strictIndexOf.js"
/**
 * indexOf 的特殊版本
 * 会对值进行严格相等比较 即 ===
 *
 * @private
 * @param {Array} array 需要查找的数组
 * @param {*} value 需要搜索的值
 * @param {number} fromIndex 查找起始索引
 * @returns {number} 如果查找到匹配的值则返回其索引 否则返回 -1
 */
function strictIndexOf(array, value, fromIndex) {
  let index = fromIndex - 1;
  const {length} = array;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

export default strictIndexOf;
```

```js title=".internal/baseIsNaN.js"
/**
 * isNaN 的基本实现
 * 不支持 Number 对象
 *
 * @private
 * @param {*} value 需要判断的值
 * @returns {boolean} 如果值为 NaN 则返回 true 否则返回 false
 */
function baseIsNaN(value) {
  // 利用了 JavaScript 的 NaN 不等于 NaN 本身的特性
  // 区分了 NaN 与非 NaN
  return value !== value;
}

export default baseIsNaN;
```

```js title=".internal/baseFindIndex.js"
/**
 * findIndex 和 findLastIndex 的基本实现
 *
 * @private
 * @param {Array} array 需要查找的数组
 * @param {Function} predicate 每次迭代调用的函数
 * @param {number} fromIndex 查找起始索引
 * @param {boolean} [fromRight] 指定查找方向从右向左
 * @returns {number} 如果查找到匹配的值则返回其索引 否则返回 -1
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  const {length} = array;
  let index = fromIndex + (fromRight ? 1 : -1);

  while (fromRight ? index-- : ++index < length) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

export default baseFindIndex;
```
