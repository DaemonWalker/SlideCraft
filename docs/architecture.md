# 项目架构

## 总体结构

SlideCraft 是无后端的前端单页应用。课件由 Vue 组件组成，框架负责画布缩放、翻页、演示工具、多语言和单文件构建。

```text
DeckDefinition
  └─ SlideDefinition[] ──> 每页一个 Vue 组件
                              └─ Slide + 布局 / 内容组件

App.vue
  ├─ useDeck：当前页、进度、Hash 与浏览器标题
  ├─ SlideViewport：测量空间并缩放固定画布
  ├─ useI18n：界面和课件文案
  └─ 工具栏、导航、总览、备注、帮助与全屏
```

## 模块职责

| 路径 | 职责 |
| --- | --- |
| `app/src/main.ts` | 根据 Vite 模式选择课件或组件展示站，并加载全局样式 |
| `app/src/App.vue` | 组合演示外壳、课件、导航、弹层和快捷键 |
| `app/src/showcase/` | 组件目录、真实示例、搜索、API 与 Pages 展示界面 |
| `app/src/core/types.ts` | 定义 `DeckDefinition` 与 `SlideDefinition` |
| `app/src/core/useDeck.ts` | 当前页状态、边界约束、Hash 和文档标题 |
| `app/src/core/SlideViewport.vue` | 1920 × 1080 画布测量、缩放与居中 |
| `app/src/core/Slide.vue` | 标准页面结构和内容溢出检测 |
| `app/src/components/` | 可复用布局、内容组件和语言选择器 |
| `app/src/decks/demo/` | 示例课件注册表和每页组件 |
| `app/src/i18n/index.ts` | 语言字典、共享语言状态、翻译与持久化 |
| `app/src/styles/global.css` | 主题变量、基础样式和语言排版差异 |
| `app/vite.config.ts` | 相对路径和资源内嵌的单文件构建 |

## 课件数据与渲染

`DeckDefinition` 包含 `title`、`subtitle` 和 `slides`。每个 `SlideDefinition` 包含：

- `id`：页面唯一标识，同时用于拼接多语言路径。
- `title`、`section`、`duration`、`notes`：页面元数据。
- `component`：实际渲染的 Vue 组件。

需要注意：当前 `App.vue` 为支持语言切换，界面中的标题、章节、时长和备注实际读取 `deck.slides.<id>.*` 字典，而不是直接显示注册表字段。因此新增页面时，注册表和三份语言字典都要维护。

`App.vue` 通过动态组件渲染当前页：

```vue
<SlideViewport>
  <component :is="currentSlide.component" :key="currentSlide.id" />
</SlideViewport>
```

## 固定画布与缩放

所有页面按 1920 × 1080 的逻辑尺寸设计。`SlideViewport` 使用 `ResizeObserver` 和窗口 `resize` 事件测量可用空间：

```ts
scale = Math.max(0.01, Math.min(
  1,
  availableWidth / 1920,
  availableHeight / 1080,
))
```

外层 `slide-frame` 使用缩放后的实际宽高参与布局，内层 `slide-canvas` 保持 1920 × 1080，并通过 `transform: scale(...)` 从左上角缩放。这样可以同时满足：

- 小窗口完整等比缩小，不改变页面内部布局。
- 大窗口最多显示为 1:1，并居中留空。
- 可用空间已扣除工具栏、导航和舞台内边距。
- 全屏时隐藏工具栏、导航和进度条，并移除舞台内边距。

`Slide` 会比较内容的滚动尺寸和可见尺寸。检测到溢出时设置 `data-overflow` 并显示轮廓；开发环境还会输出 `[SlideCraft]` 警告。

## 导航状态

`useDeck` 将当前页保存为响应式索引，并提供 `goTo`、`next`、`previous`、`progress` 等状态和方法。

- Hash 格式为 `#/<从 1 开始的页码>`。
- 无效或越界页码会被限制在有效范围内；无法识别的 Hash 从第一页开始。
- 翻页使用 `history.replaceState` 更新 Hash。
- 监听 `hashchange`，支持外部修改 Hash 后同步页面。
- 浏览器标题由两位页码、当前页标题和课件标题组成，语言切换后会更新。

键盘、按钮、总览和触屏手势都复用同一组导航方法。图片预览等原生 `dialog` 打开时，页面级快捷键会让位于弹层交互。

## 多语言状态

`i18n/index.ts` 中的模块级 `ref` 在所有组件间共享当前语言。语言变化会：

1. 更新 `<html lang>`。
2. 尝试写入 `localStorage` 的 `slidecraft-locale`。
3. 触发使用翻译函数的组件重新渲染。
4. 通过 `App.vue` 中的监听器更新浏览器标题。

字符串缺失时回退到中文；本地存储不可用不会阻止语言切换。详见[多语言](internationalization.md)。

## 单文件构建

`vite.config.ts` 使用 `vite-plugin-singlefile`，并设置：

- `base: './'`：生成相对资源路径。
- `assetsInlineLimit: 100_000_000`：内嵌构建资源。
- `cssCodeSplit: false`：合并 CSS。
- `inlineDynamicImports: true`：内联动态导入。

构建结果写入 `app/dist/index.html`。该交付方式要求课件资源在构建时导入，不能依赖运行时读取本地文件。详见[构建与交付](deployment.md)。
