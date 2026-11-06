# 组件参考

可复用组件从 `app/src/components/index.ts` 统一导出：

```ts
import { TwoColumn, Card, BulletList } from '../../../components'
```

`Slide` 和 `SlideViewport` 属于核心模块，需从 `core/` 单独导入。

## 核心页面组件

### Slide

标准 1920 × 1080 页面容器，提供标题区、内容区、页脚和溢出检测。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `''` | 页面标题；为空时按封面页处理 |
| `subtitle` | `string` | `''` | 副标题 |
| `eyebrow` | `string` | `''` | 标题上方引导文字 |
| `duration` | `string` | `''` | 顶部右侧时长或标签 |
| `footer` | `string` | `''` | 页脚左侧文字 |
| `footerRight` | `string` | `'SlideCraft'` | 默认页脚右侧文字 |
| `dark` | `boolean` | `false` | 是否使用深色页面 |
| `contentAlign` | `'start' \| 'center'` | `'center'` | 内容区垂直对齐方式 |

Slots：

- 默认插槽：页面主体。
- `footer`：完整自定义页脚；提供该插槽后不再显示默认页脚内容。

### SlideViewport

测量可用空间、计算缩放比例并居中画布，仅提供默认插槽。通过 `defineExpose` 暴露 `scale` 和 `updateScale`，普通课件页面通常无需直接操作。

## 布局组件

### TwoColumn

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `ratio` | `string` | `'1fr 1fr'` | 直接作为 `grid-template-columns` 的两列比例 |
| `gap` | `number` | `48` | 列间距，单位 px |
| `align` | `'start' \| 'center' \| 'stretch'` | `'center'` | 两列内容对齐方式 |

Slots：`left`、`right`。

```vue
<TwoColumn ratio="1.2fr 0.8fr" :gap="64">
  <template #left><BulletList :items="items" /></template>
  <template #right><ImageFigure :src="image" alt="示意图" /></template>
</TwoColumn>
```

### Grid

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `columns` | `2 \| 3 \| 4` | `3` | 等宽列数 |
| `gap` | `number` | `24` | 网格间距，单位 px |

使用默认插槽放置网格子项。

### Stack

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `gap` | `number` | `20` | 纵向间距，单位 px |

使用默认插槽放置纵向排列的内容。

## 文本与信息组件

### BulletList

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `string[]` | `[]` | 列表文字 |
| `ordered` | `boolean` | `false` | 是否显示序号 |

默认插槽可追加自定义 `<li>`。`items` 中的文本按纯文本渲染。

### TagList

| Prop | 类型 | 默认值 |
| --- | --- | --- |
| `items` | `string[]` | `[]` |

以可换行的胶囊标签显示字符串列表，无自定义插槽。

### Metric

| Prop | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `value` | `string` | 是 | 主要数值或短文本 |
| `label` | `string` | 是 | 指标名称 |
| `description` | `string` | 否 | 补充说明 |

### Card

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `''` | 可选卡片标题 |
| `tone` | `'default' \| 'accent' \| 'warning' \| 'success'` | `'default'` | 视觉语义 |

使用默认插槽放置卡片正文。

### Callout

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `''` | 可选提示标题 |
| `tone` | `'accent' \| 'warning' \| 'success'` | `'accent'` | 提示语义 |

使用默认插槽放置提示正文，适合结论、注意事项和风险提示。

## 媒体与数据组件

### CodeBlock

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `code` | `string` | 必填 | 代码文本 |
| `language` | `string` | `''` | 右上角语言标签 |
| `caption` | `string` | `''` | 左上角说明 |

代码按纯文本显示并自动换行；当前没有语法高亮。

### ImageFigure

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `src` | `string` | 必填 | 图片地址，推荐导入本地资源 |
| `alt` | `string` | 必填 | 替代文本 |
| `caption` | `string` | `''` | 图片说明 |
| `fit` | `'contain' \| 'cover'` | `'contain'` | 图片填充方式 |
| `zoomable` | `boolean` | `true` | 是否允许点击放大 |

预览通过页面顶层原生 `dialog` 展示，支持关闭按钮、`Esc` 和点击遮罩关闭；关闭后焦点回到原图按钮。

### DataTable

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `columns` | `string[]` | 必填 | 表头 |
| `rows` | `string[][]` | 必填 | 按行组织的单元格文本 |
| `caption` | `string` | `''` | 表格标题 |

单元格按纯文本渲染，每行应与表头列数一致。

## 图形组件

### FlowDiagram

| Prop | 类型 | 默认值 |
| --- | --- | --- |
| `items` | `FlowItem[]` | `[]` |

```ts
interface FlowItem {
  title: string
  description?: string
}
```

按数组顺序显示带右箭头的横向流程节点。节点标题应保持唯一且简短。

### Timeline

| Prop | 类型 | 默认值 |
| --- | --- | --- |
| `items` | `TimelineItem[]` | `[]` |

```ts
interface TimelineItem {
  title: string
  description: string
  meta?: string
}
```

当前样式固定为四列，文字颜色使用深色背景变量，适合放在 `<Slide dark>` 中。内容超过四个阶段时，应评估拆分页面或扩展组件样式。

## 使用约定

- 颜色和字体优先引用 `global.css` 中的主题变量。
- 间距数值 Props 默认按 px 处理，不要传入带单位的字符串。
- 列表、表格和流程数组若来自字典，使用 `computed(() => tm<T>(path))`。
- 组件不满足设计时，可以在页面内编写局部 HTML/CSS，或新增通用组件并从 `components/index.ts` 导出。
- 修改公共 Props 或 Slots 后，同步检查所有使用位置并更新本文档。
