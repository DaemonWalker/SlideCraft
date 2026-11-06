# 多语言

多语言实现位于 `app/src/i18n/index.ts`，当前支持：

| 语言代码 | 语言 |
| --- | --- |
| `zh-CN` | 中文，默认及缺失文案的回退语言 |
| `ja` | 日文 |
| `en` | 英文 |

语言状态是模块级共享响应式状态，界面、课件正文、总览、讲师备注和浏览器标题会随语言切换更新。

## 字典结构

每份字典分为两大命名空间：

```text
app
├─ 工具栏、导航和弹层
├─ 无障碍标签与提示
└─ 快捷键说明

deck
├─ title
├─ subtitle
└─ slides
   └─ <页面 id>
      ├─ title / section / duration / notes
      └─ 页面自己的标题、正文、数组和对象
```

`deck.slides` 下的键必须与课件注册表中的 `SlideDefinition.id` 一致。新增、删除或重命名页面时，应同步修改 `zh-CN`、`ja`、`en` 三份字典。

当前只有一组 `deck`，与 `App.vue` 中启用的一套课件对应。替换课件时通常直接替换这组字典；若要同时保留并动态切换多套课件，需要扩展命名空间和取词逻辑。

## 在组件中读取文案

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../../../i18n'

const { locale, locales, t, tm, setLocale } = useI18n()
const bullets = computed(() => tm<string[]>('deck.slides.canvas.bullets'))
</script>

<template>
  <h2>{{ t('deck.slides.canvas.title') }}</h2>
  <p>{{ t('app.page', { index: 1 }) }}</p>
</template>
```

### `t(path, params?)`

用于读取字符串。支持 `{参数}` 替换：

```ts
t('app.page', { index: 2 })
```

若结果不是字符串，则返回传入的路径。路径在当前语言中不存在时会先尝试中文。

### `tm<T>(path)`

用于读取数组或对象，泛型 `T` 是调用方提供的类型断言，不会在运行时校验字典结构。在 `script setup` 中应包装为 `computed()`：

```ts
const steps = computed(() => tm<{ title: string; description: string }[]>(
  'deck.slides.delivery.steps',
))
```

### `locale`、`locales` 和 `setLocale()`

- `locale`：当前语言的响应式 `ref`。
- `locales`：支持的语言代码常量数组。
- `setLocale(value)`：设置语言，参数类型为 `Locale`。

## 语言持久化

语言选择保存在 `localStorage` 的 `slidecraft-locale` 键中，同时更新 `<html lang>`。

- 首次打开或保存值无效时使用 `zh-CN`。
- 存储被禁用或不可用时，语言切换仍有效，但刷新后不一定保留。
- `http://` 与 `file://` 可能使用不同的存储区域。

## 新增语言

以新增 `ko` 为例：

1. 在 `locales` 数组中加入 `'ko'`，`Locale` 类型会自动更新。
2. 复制一份完整字典并翻译为韩文，例如 `const ko: MessageTree = { ... }`。
3. 将 `ko` 加入 `messages`：`{ 'zh-CN': zhCN, ja, en, ko }`。
4. 在 `app/src/components/LanguagePicker.vue` 的 `labels` 中加入 `ko: '한국어'`。
5. 如有字体或标题排版差异，在 `app/src/styles/global.css` 中增加 `html[lang='ko']` 规则。
6. 检查所有页面、总览、备注、图片预览和浏览器标题，并运行 `npm run build`。

不要只添加语言代码或部分字典：缺失字符串虽会回退中文，但数组和对象依赖完整的数据结构，部分翻译会造成语言混杂。

## 维护检查清单

- 所有面向用户的文案均进入字典，固定命令、数值和专有名词除外。
- 三份现有语言的键和数据结构一致。
- `t()` 不用于读取数组或对象，`tm()` 不用于替代普通字符串。
- 数组和对象通过 `computed()` 读取。
- 图片 `alt`、无障碍标签和讲师备注同样翻译。
- 长文本语言切换后没有内容溢出。
