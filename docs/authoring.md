# 课件制作

以下示例假设在 `app/src/decks/my-course/` 中创建一套新课件。当前应用一次加载一套课件，需要替换 `App.vue` 中的示例课件引用。

## 1. 创建课件目录

复制 `app/src/decks/demo/`，例如：

```text
app/src/decks/my-course/
├─ index.ts
└─ slides/
   └─ OrderApiSlide.vue
```

每页使用独立 Vue 组件，页面顺序由课件 `index.ts` 中的 `slides` 数组决定。

## 2. 编写页面

推荐组合 `Slide`、布局组件、内容组件和多语言字典：

```vue
<script setup lang="ts">
import { computed } from 'vue'
import Slide from '../../../core/Slide.vue'
import { TwoColumn, BulletList, ImageFigure } from '../../../components'
import { useI18n } from '../../../i18n'
import flowImage from '../../../assets/flow.svg'

const { t, tm } = useI18n()
const bullets = computed(() => tm<string[]>('deck.slides.order-api.bullets'))
</script>

<template>
  <Slide
    :eyebrow="t('deck.slides.order-api.eyebrow')"
    :title="t('deck.slides.order-api.title')"
    :subtitle="t('deck.slides.order-api.subtitle')"
    :footer="t('deck.title')"
  >
    <TwoColumn ratio="1.2fr 0.8fr">
      <template #left>
        <BulletList :items="bullets" />
      </template>
      <template #right>
        <ImageFigure
          :src="flowImage"
          :alt="t('deck.slides.order-api.imageAlt')"
        />
      </template>
    </TwoColumn>
  </Slide>
</template>
```

`tm()` 读取数组或对象时，应在 `script setup` 中包进 `computed()`，确保切换语言后内容同步更新。固定数值、命令或专有名词可直接写入组件；面向观众的普通文案应进入字典。

特殊页面可以直接编写 HTML、CSS 或 SVG，不必强行套用现有组件。深色页面使用 `<Slide dark>`，并使用 `--on-dark`、`--on-dark-muted`、`--accent-on-dark` 等主题变量。

## 3. 注册课件

编辑 `app/src/decks/my-course/index.ts`：

```ts
import type { DeckDefinition } from '../../core/types'
import OrderApiSlide from './slides/OrderApiSlide.vue'

export const myCourse: DeckDefinition = {
  title: '业务开发培训',
  subtitle: '订单查询 API',
  slides: [
    {
      id: 'order-api',
      title: '订单查询 API',
      section: '核心流程',
      duration: '5 分钟',
      component: OrderApiSlide,
      notes: '这里填写当前页的备注，内容可按需自由填写。',
    },
  ],
}
```

页面 `id` 必须在当前课件中唯一，并与字典中的 `deck.slides.<id>` 完全一致。含连字符的 id 在对象字面量中应使用引号，例如 `'order-api'`。

## 4. 补齐三份语言字典

在 `app/src/i18n/index.ts` 的 `zh-CN`、`ja`、`en` 中，都为当前课件补齐 `deck.title`、`deck.subtitle` 和页面文案。中文页面示例：

```ts
deck: {
  title: '业务开发培训',
  subtitle: '订单查询 API',
  slides: {
    'order-api': {
      title: '订单查询 API',
      section: '核心流程',
      duration: '5 分钟',
      notes: '介绍订单查询的请求与响应流程。',
      eyebrow: '01 · 核心流程',
      subtitle: '从接收请求到返回响应',
      bullets: ['接收请求', '查询数据', '组装响应'],
      imageAlt: '订单查询流程图',
    },
  },
}
```

当前 `App.vue` 会从字典读取导航标题、章节、时长和备注。只修改 `DeckDefinition` 中的字段，不足以更新这些可见内容。

现有字典只有一组 `deck`。如果只是把示例改造成新课件，直接替换各语言下的 `deck` 即可；如果需要在运行时支持多套课件，应先扩展字典键和 `App.vue` 的取词逻辑。

完整规则见[多语言](internationalization.md)。

## 5. 在应用中启用课件

编辑 `app/src/App.vue`：

1. 将 `demoDeck` 的导入改为从 `./decks/my-course` 导入 `myCourse`。
2. 将该文件内的 `demoDeck` 引用替换为 `myCourse`，包括 `useDeck`、末页跳转、页数和总览。
3. 确认字典中的 `deck` 已替换为新课件文案。

## 6. 添加图片和其他资源

资源放入 `app/src/assets/`，通过 ES Module 导入：

```ts
import architectureImage from '../../../assets/architecture.svg'
```

然后在模板中绑定：

```vue
<ImageFigure :src="architectureImage" alt="系统架构图" />
```

推荐 SVG、WebP 或压缩后的 PNG。不要通过运行时 `fetch()` 读取本地资源，也不要依赖 CDN、远程字体或远程脚本；这些方式会破坏离线交付。

`ImageFigure` 默认支持点击放大，装饰性或不需要放大的图片可设置 `:zoomable="false"`。

### 添加可下载附件

将附件放入 `app/src/assets/attachments/`，使用 `?attachment` 导入并传给 `AttachmentDownload`：

```vue
<script setup lang="ts">
import { AttachmentDownload } from '../../../components'
import practiceFile from '../../../assets/attachments/practice.zip?attachment'
</script>

<template>
  <AttachmentDownload
    :src="practiceFile"
    file-name="practice.zip"
    description="本节课的源码与练习。"
  />
</template>
```

`?attachment` 会在构建时校验原始文件大小并生成 Base64 Data URL。附件仍内嵌于最终 HTML，不会产生 `attachments` 交付目录；只有用户点击下载时才解码并创建 Blob。默认单个附件不超过 10MiB，全部附件总计不超过 30MiB，重复导入同一文件只计算一次。超限时构建失败，开发预览也会显示错误。限制配置见[构建与离线交付](deployment.md)。

## 7. 检查页面

开发环境中重点检查：

- 控制台没有 `[SlideCraft]` 内容溢出警告。
- 页面没有红色溢出轮廓，内容不被固定画布裁切。
- 三种语言的标题、正文、备注、总览和浏览器标题均正确。
- 长文本、代码和表格在 1920 × 1080 逻辑画布内完整显示。
- 翻页、Hash 定位、图片预览和全屏正常。
- `npm run build` 成功。

不要通过缩小整个浏览器字号来掩盖溢出；应减少内容、调整局部布局或拆分页面。
