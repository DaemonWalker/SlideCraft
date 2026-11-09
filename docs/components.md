# 组件参考

可复用组件从 `app/src/components/index.ts` 统一导出：

```ts
import { TwoColumn, Card, BulletList } from '../../../components'
```

`Slide` 和 `SlideViewport` 属于核心模块，需从 `core/` 单独导入。

[在线组件库](https://daemonwalker.github.io/SlideCraft/)提供全部布局与内容组件的真实预览和示例代码。新增或修改公共组件时，同步维护 `app/src/showcase/catalog.ts`、`ComponentExample.vue` 和三份 `app/src/i18n/showcase.ts` 字典。

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

### TitleLayout

用于深色标题页的非对称图文结构，左侧显示标题信息，右侧显示可选视觉内容。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `eyebrow` | `string` | `''` | 标题上方的小型引导文字 |
| `title` | `string` | 必填 | 主标题第一行 |
| `accent` | `string` | `''` | 单独一行显示的强调标题 |
| `subtitle` | `string` | `''` | 副标题 |
| `meta` | `string` | `''` | 主讲人、部门、日期等简短信息 |

Slots：

- `visual`：右侧图片、示意图或其他视觉内容；省略时使用单列结构。
- `tags`：副标题下方的标签区域。
- `meta`：自定义课程信息；提供时覆盖 `meta` Prop 的默认显示。

```vue
<Slide dark>
  <TitleLayout
    eyebrow="TECH TRAINING"
    title="用组件，构建你的"
    accent="下一套课件"
    subtitle="组件化 HTML 幻灯片框架"
    meta="主讲人 · 部门 · 日期"
  >
    <template #tags><TagList :items="['Vue 3', 'TypeScript']" /></template>
    <template #visual><ImageFigure :src="coverImage" alt="课件示意图" /></template>
  </TitleLayout>
</Slide>
```

应放在 `<Slide dark>` 中。主标题和强调标题分行显示，长标题应优先精简，而不是缩小字号。

### SectionLayout

用于深色章节过渡页，左侧显示大编号，右侧显示章节标题与导语。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `number` | `string \| number` | 必填 | 章节编号；数值 `1` 自动显示为 `01` |
| `title` | `string` | 必填 | 章节标题 |
| `description` | `string` | `''` | 一句章节导语 |

默认插槽可在导语下方追加简短内容。应放在 `<Slide dark>` 中，并保持页面信息精简。

```vue
<Slide dark>
  <SectionLayout :number="1" title="核心设计" description="从固定画布开始，理解页面的缩放规则。" />
</Slide>
```

### ComparisonLayout

上方展示可选指标，下方使用左右两栏展示 Before/After、优缺点或其他对照内容。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `metrics` | `ComparisonMetric[]` | `[]` | 顶部指标；省略或为空时只显示对照区域 |
| `beforeLabel` | `string` | `''` | 左栏标签 |
| `afterLabel` | `string` | `''` | 右栏标签 |

```ts
interface ComparisonMetric {
  value: string
  label: string
  description?: string
}
```

Slots：`before`、`after`，可放入列表、代码、表格或其他内容。建议顶部使用 2～3 个指标。

```vue
<ComparisonLayout :metrics="metrics" before-label="Before" after-label="After">
  <template #before><BulletList :items="oldApproach" /></template>
  <template #after><BulletList :items="newApproach" /></template>
</ComparisonLayout>
```

### ProcessLayout

使用带编号的横向步骤表达流程，可突出一个关键步骤，并在底部追加结论或行动。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `ProcessStep[]` | `[]` | 按顺序显示的流程步骤 |
| `activeStep` | `number` | `0` | 需要强调的步骤序号，从 1 开始；`0` 表示不强调 |

```ts
interface ProcessStep {
  title: string
  description?: string
}
```

默认插槽用于底部结论、命令或提示。建议使用 3～4 个步骤，更多步骤应拆页。

```vue
<ProcessLayout :items="steps" :active-step="2">
  <code>npm run build:offline</code>
</ProcessLayout>
```

### TabPanel

在同一区域切换不同工具、语言或版本的内容。标签通过 `items` 配置，每个面板使用与 `id` 同名的动态插槽，可放入代码、图片或其他组件。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `TabPanelItem[]` | 必填 | 标签列表，`id` 必须唯一且与插槽名一致 |
| `defaultActive` | `string` | `''` | 默认激活的标签 `id`；为空或无效时使用第一项 |
| `ariaLabel` | `string` | `''` | 标签组的无障碍名称 |

```ts
interface TabPanelItem {
  id: string
  label: string
}
```

Slots：由 `items` 动态决定，例如 `javascript`、`typescript`。

```vue
<TabPanel :items="codeTabs" default-active="typescript" aria-label="代码语言">
  <template #javascript><CodeBlock :code="javascriptCode" language="js" /></template>
  <template #typescript><CodeBlock :code="typescriptCode" language="ts" /></template>
</TabPanel>
```

标签使用原生按钮，支持 Tab 键聚焦以及 Enter、Space 激活，不占用幻灯片的方向键和 Home/End 翻页操作。非激活面板仅隐藏而不销毁，切换后保留内部状态。建议使用 2～4 个短标签，并分别检查每种面板内容的溢出情况。

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
| `language` | `string` | `''` | 右上角语言标签和基础语法着色规则 |
| `caption` | `string` | `''` | 左上角说明或文件路径 |
| `showLineNumbers` | `boolean` | `false` | 是否显示行号 |
| `highlightLines` | `number[]` | `[]` | 需要强调的实际行号 |
| `errorLines` | `number[]` | `[]` | 需要标记为错误的实际行号 |
| `startLine` | `number` | `1` | 第一行的行号 |
| `wrap` | `boolean` | `true` | 是否自动换行；关闭后显示横向滚动条 |
| `syntax` | `boolean` | `true` | 是否启用轻量级语法着色 |

语法着色由本地分词实现，支持常见开发语言，不依赖第三方高亮库；它不是完整的语言解析器。`highlightLines` 和 `errorLines` 使用包含 `startLine` 偏移后的实际行号。

### CodeDiff

统一差异视图，自动计算修改前后的行号。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `lines` | `DiffLine[]` | 必填 | 按显示顺序排列的差异行 |
| `language` | `string` | `''` | 基础语法着色规则 |
| `caption` | `string` | `''` | 文件路径或说明 |
| `oldLabel` | `string` | `'Before'` | 旧版本标签 |
| `newLabel` | `string` | `'After'` | 新版本标签 |
| `showLineNumbers` | `boolean` | `true` | 是否显示新旧行号 |
| `wrap` | `boolean` | `true` | 是否自动换行 |
| `syntax` | `boolean` | `true` | 是否启用语法着色 |

```ts
interface DiffLine {
  type?: 'added' | 'removed' | 'context'
  content: string
}
```

省略 `type` 时按未修改的上下文行处理。

### TerminalBlock

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `entries` | `TerminalEntry[]` | 必填 | 命令及输出记录 |
| `title` | `string` | `'Terminal'` | 终端标题和无障碍名称 |
| `prompt` | `string` | `'$'` | 命令提示符 |
| `showExitCode` | `boolean` | `false` | 是否显示退出码 |

```ts
interface TerminalEntry {
  command: string
  output?: string
  cwd?: string
  status?: 'success' | 'error'
  exitCode?: number
}
```

未提供 `exitCode` 时，错误状态显示 `1`，其他状态显示 `0`。

### ConfigBlock

用于结构化展示 YAML、Properties 或环境变量，并对敏感值进行掩码。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `entries` | `ConfigEntry[]` | 必填 | 配置项列表 |
| `format` | `'yaml' \| 'properties' \| 'env'` | `'yaml'` | 分隔符与格式标签 |
| `caption` | `string` | `''` | 配置标题 |
| `maskSecrets` | `boolean` | `true` | 是否掩码显示敏感值 |
| `mask` | `string` | `'••••••'` | 掩码文本 |

```ts
interface ConfigEntry {
  key: string
  value: string
  description?: string
  sensitive?: boolean
}
```

该组件只负责展示，不会读取环境变量或本地配置文件。不要在课件中传入真实密钥。

### RequestResponse

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `request` | `HttpRequest` | 必填 | HTTP 请求 |
| `response` | `HttpResponse` | 无 | 可选 HTTP 响应；省略时使用单列布局 |
| `caption` | `string` | `''` | 整个接口示例的标题 |
| `requestLabel` | `string` | `'Request'` | 请求栏标签 |
| `responseLabel` | `string` | `'Response'` | 响应栏标签 |

```ts
interface HttpRequest {
  method: string
  path: string
  description?: string
  headers?: Record<string, string>
  body?: string
}

interface HttpResponse {
  status: number | string
  statusText?: string
  headers?: Record<string, string>
  body?: string
  duration?: string
}
```

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

### ArchitectureDiagram

通过逻辑坐标放置系统节点，并用有向连线描述依赖关系。SVG 按容器宽度等比显示，不需要远程图形库。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `nodes` | `ArchitectureNode[]` | 必填 | 节点列表，`id` 必须唯一 |
| `edges` | `ArchitectureEdge[]` | `[]` | 节点之间的连线 |
| `caption` | `string` | `''` | 图形标题和无障碍名称 |
| `width` | `number` | `1200` | SVG 逻辑宽度 |
| `height` | `number` | `560` | SVG 逻辑高度 |

```ts
interface ArchitectureNode {
  id: string
  title: string
  description?: string
  x: number
  y: number
  width?: number
  height?: number
  kind?: 'service' | 'client' | 'database' | 'cache' | 'queue' | 'external'
}

interface ArchitectureEdge {
  from: string
  to: string
  label?: string
  route?: 'direct' | 'orthogonal'
  tone?: 'default' | 'warning' | 'success'
}
```

`x`、`y` 是节点中心坐标。连线端点会自动落在节点边界；引用不存在的节点时忽略该连线。标题和说明应保持简短，复杂架构应拆成多页。

### SequenceDiagram

根据参与者顺序和消息数组自动计算生命线、消息位置与高度。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `participants` | `SequenceParticipant[]` | 必填 | 按从左到右排列的参与者 |
| `messages` | `SequenceMessage[]` | 必填 | 按发生顺序排列的消息 |
| `caption` | `string` | `''` | 图形标题和无障碍名称 |
| `width` | `number` | `1200` | SVG 逻辑宽度 |
| `messageGap` | `number` | `76` | 消息的纵向逻辑间距 |
| `showNumbers` | `boolean` | `true` | 是否在消息前显示序号 |

```ts
interface SequenceParticipant {
  id: string
  title: string
  subtitle?: string
  tone?: 'default' | 'accent' | 'success' | 'warning'
}

interface SequenceMessage {
  from: string
  to: string
  label: string
  type?: 'sync' | 'async' | 'return'
}
```

支持同步、异步、返回和自身调用。引用不存在的参与者时忽略该消息；建议每页控制在 2～6 个参与者和少量关键消息，长文本应拆页。

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
