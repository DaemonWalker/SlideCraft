# SlideCraft

基于 Vue 3 + TypeScript + Vite 的组件化 HTML 幻灯片框架。源码按组件维护，构建后交付一个可离线双击打开的 `dist/index.html`。

## 已实现

- 固定 1920 × 1080 设计画布。
- 小窗口等比缩小，大窗口保持原始尺寸并居中留空，缩放比例不超过 1。
- 页面内部不随窗口重排，开发模式下提供内容溢出提示。
- 按钮、键盘、触屏翻页和 Hash 页码定位。
- 幻灯片总览、讲师备注、快捷键帮助和全屏演示。
- 全屏时隐藏工具栏、底部导航和进度条。
- 23 个布局与内容组件，以及 9 页示例课件。
- GitHub Pages 组件展示站，提供搜索、真实预览、API、示例代码和三语言切换。
- 中文、日文、英文切换，覆盖工具栏、课件正文、总览、讲师备注和浏览器标题。
- 自动保存语言选择，下次打开时恢复。
- CSS、JavaScript 和 SVG 图片全部内嵌的单文件构建。

## 启动与构建

```bash
npm install
npm run dev
```

开发服务器支持 Vite 参数，例如：

```bash
npm run dev -- --port 7100
```

生成单文件离线版：

```bash
npm run build:offline
```

交付文件：

```text
dist/index.html
```

该文件不需要服务器。接收方可以使用现代 Chrome 或 Edge 直接打开，也可以在断网后切换语言。

组件展示站：

```bash
npm run dev:showcase -- --port 7101
npm run build:pages
```

Pages 构建同样输出 `dist/index.html`，但根组件切换为 `src/showcase/ShowcaseApp.vue`。自动部署配置见根目录 `.github/workflows/pages.yml`。

## 项目结构

```text
src/
├─ core/                 # Slide、SlideViewport、翻页逻辑和类型
├─ components/
│  ├─ layout/            # TwoColumn、Grid、Stack
│  ├─ content/           # 列表、卡片、代码、图片、表格、流程等
│  ├─ LanguagePicker.vue # 自定义语言菜单与键盘交互
│  └─ index.ts           # 统一组件出口
├─ decks/
│  └─ demo/              # 示例课件
│     ├─ index.ts        # 页面注册
│     └─ slides/         # 每页一个 Vue 组件
├─ i18n/index.ts         # 中日英字典、语言状态和翻译函数
├─ styles/global.css     # 主题变量、字体与语言排版
└─ App.vue               # 演示工具栏、导航和弹层
```

## 多语言

工具栏右上角可以切换中文、日文和英文，默认使用中文。`LanguagePicker.vue` 提供样式统一的自定义选项列表，支持鼠标、方向键、Home、End、Enter、Esc 和点击外部关闭。选择保存在当前浏览器的 `localStorage` 中，键名为 `slidecraft-locale`；清除浏览器数据后会恢复中文，`http://` 与 `file://` 的存储区域可能相互独立。

所有文案集中在 `src/i18n/index.ts`，结构分为：

- `app`：工具栏、总览、备注、快捷键及无障碍标签。
- `deck`：课件标题、副标题，以及各页的标题、章节、时长、正文和讲师备注。
- `deck.slides.<页面 id>`：与 `src/decks/demo/index.ts` 中的页面 `id` 一一对应。

组件中使用 `useI18n()`：

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { BulletList } from '../../../components'
import { useI18n } from '../../../i18n'

const { t, tm } = useI18n()
const bullets = computed(() => tm<string[]>('deck.slides.canvas.bullets'))
</script>

<template>
  <h2>{{ t('deck.slides.canvas.title') }}</h2>
  <BulletList :items="bullets" />
</template>
```

`t()` 用于字符串并支持 `{参数}` 替换；`tm()` 用于数组或对象，在 `script setup` 中应包在 `computed()` 内，确保切换语言后同步更新。语言状态还可通过 `locale` 和 `setLocale()` 读取与设置。

新增语言时，在 `locales` 中加入语言代码，复制并翻译一份完整字典，将其加入 `messages`，再在 `App.vue` 的语言选择器中增加对应选项。

## 制作一套新课件

### 1. 复制示例目录

复制 `src/decks/demo`，例如命名为 `src/decks/my-course`。

### 2. 编写页面

```vue
<script setup lang="ts">
import Slide from '../../../core/Slide.vue'
import {
  TwoColumn,
  BulletList,
  ImageFigure,
} from '../../../components'
import flowImage from '../../../assets/flow.svg'
</script>

<template>
  <Slide
    eyebrow="01 · 核心流程"
    title="订单查询 API"
    subtitle="从接收请求到返回响应"
    footer="业务开发培训"
  >
    <TwoColumn ratio="1.2fr 0.8fr">
      <template #left>
        <BulletList :items="['接收请求', '查询数据', '组装响应']" />
      </template>
      <template #right>
        <ImageFigure :src="flowImage" alt="订单查询流程" />
      </template>
    </TwoColumn>
  </Slide>
</template>
```

### 3. 注册页面

在课件的 `index.ts` 中注册：

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
      notes: '这里填写当前页的讲师备注。',
    },
  ],
}
```

然后在 `src/App.vue` 中把 `demoDeck` 替换为新的课件定义。

## 组件目录

| 类型 | 组件 |
| --- | --- |
| 页面 | `Slide`、`SlideViewport` |
| 布局 | `TwoColumn`、`Grid`、`Stack` |
| 文本 | `BulletList`、`TagList`、`Metric` |
| 容器 | `Card`、`Callout` |
| 媒体 | `CodeBlock`、`CodeDiff`、`TerminalBlock`、`ImageFigure` |
| 开发配置 | `ConfigBlock`、`RequestResponse` |
| 数据 | `DataTable` |
| 图形 | `FlowDiagram`、`Timeline`、`ArchitectureDiagram`、`SequenceDiagram` |

所有组件都可以使用 Vue Props 和 Slots 扩展。特殊页面可以直接编写 HTML、CSS 或 SVG，不必强行套用现有组件。

### 图片放大预览

`ImageFigure` 默认启用点击放大，现有图片无需修改。课件中的普通图片应优先统一使用该组件：

```vue
<ImageFigure
  :src="diagram"
  alt="系统流程图"
  caption="从接收请求到返回响应"
/>
```

点击图片后会在页面顶层打开大图，支持关闭按钮、Esc 和点击遮罩关闭；关闭后焦点回到原图，预览打开时翻页快捷键不会误触。只有装饰性或明确不需要放大的图片才设置 `:zoomable="false"`。

## 缩放规则

```ts
scale = Math.min(
  1,
  availableWidth / 1920,
  availableHeight / 1080,
)
```

可用空间已经扣除工具栏、导航栏和舞台内边距。全屏时这些区域隐藏，因此 1920 × 1080 的屏幕可以实现 1:1 显示。

## 单文件制作注意事项

- 图片通过 ES Module 导入，构建时自动内嵌。
- 不使用 CDN、远程字体或运行时 `fetch` 本地文件。
- 图片优先使用 SVG、WebP 或压缩后的 PNG。
- 页码使用 `#/1` 形式，适配 `file://`。
- 当前版本不包含 PDF、PPTX 导出和可视化编辑器。

## 第三方资源

图标来自 Lucide，通过 `@lucide/vue` 使用，许可证为 ISC。示例示意图由项目内 SVG 绘制，无外部图片依赖。
