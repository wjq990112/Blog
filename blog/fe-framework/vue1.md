---
id: vue1
title: 从 Vue3.0 结合 TSX 进行开发踩过的坑衍生出来的思考
slug: /fe-framework/
---

<iframe style={{ width: '100%' }} frameBorder="no" height="512" title="Vue Template Explorer" src="https://vue-next-template-explorer.netlify.app/#%7B%22src%22%3A%22%3Cinput%20v-model%3D%5C%22inputValue%5C%22%20%2F%3E%22%2C%22ssr%22%3Afalse%2C%22options%22%3A%7B%22mode%22%3A%22module%22%2C%22filename%22%3A%22Foo.vue%22%2C%22prefixIdentifiers%22%3Afalse%2C%22optimizeImports%22%3Afalse%2C%22hoistStatic%22%3Afalse%2C%22cacheHandlers%22%3Afalse%2C%22scopeId%22%3Anull%2C%22inline%22%3Afalse%2C%22ssrCssVars%22%3A%22%7B%20color%20%7D%22%2C%22bindingMetadata%22%3A%7B%22TestComponent%22%3A%22setup-const%22%2C%22setupRef%22%3A%22setup-ref%22%2C%22setupConst%22%3A%22setup-const%22%2C%22setupLet%22%3A%22setup-let%22%2C%22setupMaybeRef%22%3A%22setup-maybe-ref%22%2C%22setupProp%22%3A%22props%22%2C%22vMySetupDir%22%3A%22setup-const%22%7D%7D%7D" />

<iframe style={{ width: '100%' }} frameBorder="no" height="512" title="Vue JSX Explorer" src="https://vue-next-jsx-explorer.netlify.app/#defineComponent(%7B%0A%20%20render(ctx)%20%7B%0A%20%20%20%20const%20%7B%20inputValue%20%7D%20%3D%20ctx%3B%0A%0A%20%20%20%20%3Cinput%20v-model%3D%7BinputValue%7D%20%2F%3E%0A%20%20%7D%0A%7D)" />
