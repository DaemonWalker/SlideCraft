export type ComponentCategory = 'layout' | 'text' | 'media' | 'diagram'

export interface ComponentCatalogItem {
  id: string
  name: string
  category: ComponentCategory
  source: string
  props: string[]
  slots: string[]
  code: string
  dark?: boolean
}

export const componentCatalog: ComponentCatalogItem[] = [
  {
    id: 'two-column',
    name: 'TwoColumn',
    category: 'layout',
    source: 'layout/TwoColumn.vue',
    props: ["ratio?: string = '1fr 1fr'", 'gap?: number = 48', "align?: 'start' | 'center' | 'stretch' = 'center'"],
    slots: ['left', 'right'],
    code: `<TwoColumn ratio="1.2fr 0.8fr" :gap="64">
  <template #left><BulletList :items="items" /></template>
  <template #right><ImageFigure :src="image" alt="Diagram" /></template>
</TwoColumn>`,
  },
  {
    id: 'grid',
    name: 'Grid',
    category: 'layout',
    source: 'layout/Grid.vue',
    props: ['columns?: 2 | 3 | 4 = 3', 'gap?: number = 24'],
    slots: ['default'],
    code: `<Grid :columns="3" :gap="24">
  <Card title="One">First item</Card>
  <Card title="Two">Second item</Card>
  <Card title="Three">Third item</Card>
</Grid>`,
  },
  {
    id: 'stack',
    name: 'Stack',
    category: 'layout',
    source: 'layout/Stack.vue',
    props: ['gap?: number = 20'],
    slots: ['default'],
    code: `<Stack :gap="24">
  <Callout title="Key point">Keep related content together.</Callout>
  <BulletList :items="items" />
</Stack>`,
  },
  {
    id: 'title-layout',
    name: 'TitleLayout',
    category: 'layout',
    source: 'layout/TitleLayout.vue',
    props: ["eyebrow?: string = ''", 'title: string', "accent?: string = ''", "subtitle?: string = ''", "meta?: string = ''"],
    slots: ['visual', 'tags', 'meta'],
    dark: true,
    code: `<Slide dark>
  <TitleLayout
    eyebrow="TECH TRAINING"
    title="Build your next deck"
    accent="with components"
    subtitle="A component-based HTML slide framework"
    meta="Presenter · Team · Date"
  >
    <template #tags><TagList :items="['Vue 3', 'TypeScript']" /></template>
    <template #visual><ImageFigure :src="coverImage" alt="Cover visual" /></template>
  </TitleLayout>
</Slide>`,
  },
  {
    id: 'section-layout',
    name: 'SectionLayout',
    category: 'layout',
    source: 'layout/SectionLayout.vue',
    props: ['number: string | number', 'title: string', "description?: string = ''"],
    slots: ['default'],
    dark: true,
    code: `<Slide dark>
  <SectionLayout
    :number="1"
    title="Core design"
    description="Start with a fixed canvas and shared scaling rules."
  />
</Slide>`,
  },
  {
    id: 'comparison-layout',
    name: 'ComparisonLayout',
    category: 'layout',
    source: 'layout/ComparisonLayout.vue',
    props: ['metrics?: ComparisonMetric[] = []', "beforeLabel?: string = ''", "afterLabel?: string = ''"],
    slots: ['before', 'after'],
    code: `<ComparisonLayout :metrics="metrics" before-label="Before" after-label="After">
  <template #before><BulletList :items="oldApproach" /></template>
  <template #after><BulletList :items="newApproach" /></template>
</ComparisonLayout>`,
  },
  {
    id: 'process-layout',
    name: 'ProcessLayout',
    category: 'layout',
    source: 'layout/ProcessLayout.vue',
    props: ['items?: ProcessStep[] = []', 'activeStep?: number = 0'],
    slots: ['default'],
    code: `<ProcessLayout :items="steps" :active-step="2">
  <code>npm run build:offline</code>
</ProcessLayout>`,
  },
  {
    id: 'tab-panel',
    name: 'TabPanel',
    category: 'layout',
    source: 'layout/TabPanel.vue',
    props: ['items: TabPanelItem[]', "defaultActive?: string = ''", "ariaLabel?: string = ''"],
    slots: ['<item.id>'],
    code: `<TabPanel
  :items="[
    { id: 'javascript', label: 'JavaScript' },
    { id: 'typescript', label: 'TypeScript' },
  ]"
  default-active="javascript"
  aria-label="Code language"
>
  <template #javascript><CodeBlock :code="javascriptCode" language="js" /></template>
  <template #typescript><CodeBlock :code="typescriptCode" language="ts" /></template>
</TabPanel>`,
  },
  {
    id: 'bullet-list',
    name: 'BulletList',
    category: 'text',
    source: 'content/BulletList.vue',
    props: ['items?: string[] = []', 'ordered?: boolean = false'],
    slots: ['default'],
    code: `<BulletList :items="['Fixed canvas', 'Reusable components', 'Offline delivery']" />
<BulletList :items="steps" ordered />`,
  },
  {
    id: 'tag-list',
    name: 'TagList',
    category: 'text',
    source: 'content/TagList.vue',
    props: ['items: string[] = []'],
    slots: [],
    code: `<TagList :items="['Vue 3', 'TypeScript', 'Vite', 'Offline HTML']" />`,
  },
  {
    id: 'metric',
    name: 'Metric',
    category: 'text',
    source: 'content/Metric.vue',
    props: ['value: string', 'label: string', 'description?: string'],
    slots: [],
    code: `<Metric
  value="1920 × 1080"
  label="Design canvas"
  description="One coordinate system for every slide."
/>`,
  },
  {
    id: 'card',
    name: 'Card',
    category: 'text',
    source: 'content/Card.vue',
    props: ["title?: string = ''", "tone?: 'default' | 'accent' | 'warning' | 'success' = 'default'"],
    slots: ['default'],
    code: `<Card title="Reusable" tone="accent">
  Compose a slide from typed Vue components.
</Card>`,
  },
  {
    id: 'callout',
    name: 'Callout',
    category: 'text',
    source: 'content/Callout.vue',
    props: ["title?: string = ''", "tone?: 'accent' | 'warning' | 'success' = 'accent'"],
    slots: ['default'],
    code: `<Callout title="Remember" tone="success">
  All resources are embedded for offline delivery.
</Callout>`,
  },
  {
    id: 'attachment-download',
    name: 'AttachmentDownload',
    category: 'media',
    source: 'content/AttachmentDownload.vue',
    props: ['src: string', 'fileName: string', "description?: string = ''"],
    slots: [],
    code: `<AttachmentDownload
  :src="practiceFile"
  file-name="practice.zip"
  description="Source code and exercises for this lesson."
/>`,
  },
  {
    id: 'code-block',
    name: 'CodeBlock',
    category: 'media',
    source: 'content/CodeBlock.vue',
    props: ['code: string', "language?: string = ''", "caption?: string = ''", 'showLineNumbers?: boolean = false', 'highlightLines?: number[] = []', 'errorLines?: number[] = []', 'startLine?: number = 1', 'wrap?: boolean = true', 'syntax?: boolean = true'],
    slots: [],
    code: `<CodeBlock
  :code="source"
  language="ts"
  caption="src/main.ts"
  show-line-numbers
  :highlight-lines="[3]"
/>`,
  },
  {
    id: 'code-diff',
    name: 'CodeDiff',
    category: 'media',
    source: 'content/CodeDiff.vue',
    props: ['lines: DiffLine[]', "language?: string = ''", "caption?: string = ''", "oldLabel?: string = 'Before'", "newLabel?: string = 'After'", 'showLineNumbers?: boolean = true', 'wrap?: boolean = true', 'syntax?: boolean = true'],
    slots: [],
    code: `<CodeDiff
  :lines="[
    { type: 'removed', content: 'const scale = 1' },
    { type: 'added', content: 'const scale = fitViewport()' },
  ]"
  language="ts"
  caption="viewport.ts"
/>`,
  },
  {
    id: 'terminal-block',
    name: 'TerminalBlock',
    category: 'media',
    source: 'content/TerminalBlock.vue',
    props: ['entries: TerminalEntry[]', "title?: string = 'Terminal'", "prompt?: string = '$'", 'showExitCode?: boolean = false'],
    slots: [],
    code: `<TerminalBlock
  :entries="[{ command: 'npm run build:offline', output: '✓ built successfully' }]"
  title="Build"
  show-exit-code
/>`,
  },
  {
    id: 'config-block',
    name: 'ConfigBlock',
    category: 'media',
    source: 'content/ConfigBlock.vue',
    props: ['entries: ConfigEntry[]', "format?: 'yaml' | 'properties' | 'env' = 'yaml'", "caption?: string = ''", 'maskSecrets?: boolean = true', "mask?: string = '••••••'"],
    slots: [],
    code: `<ConfigBlock
  :entries="[
    { key: 'APP_ENV', value: 'training' },
    { key: 'DB_PASSWORD', value: 'example-only', sensitive: true },
  ]"
  caption="Application settings"
/>`,
  },
  {
    id: 'request-response',
    name: 'RequestResponse',
    category: 'media',
    source: 'content/RequestResponse.vue',
    props: ['request: HttpRequest', 'response?: HttpResponse', "caption?: string = ''", "requestLabel?: string = 'Request'", "responseLabel?: string = 'Response'"],
    slots: [],
    code: `<RequestResponse
  :request="{ method: 'POST', path: '/api/orders', body: requestBody }"
  :response="{ status: 201, statusText: 'Created', body: responseBody }"
  caption="Create an order"
/>`,
  },
  {
    id: 'image-figure',
    name: 'ImageFigure',
    category: 'media',
    source: 'content/ImageFigure.vue',
    props: ['src: string', 'alt: string', "caption?: string = ''", "fit?: 'contain' | 'cover' = 'contain'", 'zoomable?: boolean = true'],
    slots: [],
    code: `<ImageFigure
  :src="viewportDiagram"
  alt="Fixed canvas scaling in a window"
  caption="Click the image to open the accessible preview."
/>`,
  },
  {
    id: 'data-table',
    name: 'DataTable',
    category: 'media',
    source: 'content/DataTable.vue',
    props: ['columns: string[]', 'rows: string[][]', "caption?: string = ''"],
    slots: [],
    code: `<DataTable
  :columns="['Component', 'Category', 'Use']"
  :rows="[['TwoColumn', 'Layout', 'Side-by-side content']]"
  caption="Component overview"
/>`,
  },
  {
    id: 'architecture-diagram',
    name: 'ArchitectureDiagram',
    category: 'diagram',
    source: 'content/ArchitectureDiagram.vue',
    props: ['nodes: ArchitectureNode[]', 'edges?: ArchitectureEdge[] = []', "caption?: string = ''", 'width?: number = 1200', 'height?: number = 560'],
    slots: [],
    code: `<ArchitectureDiagram
  :nodes="nodes"
  :edges="edges"
  caption="Order service architecture"
  :height="460"
/>`,
  },
  {
    id: 'sequence-diagram',
    name: 'SequenceDiagram',
    category: 'diagram',
    source: 'content/SequenceDiagram.vue',
    props: ['participants: SequenceParticipant[]', 'messages: SequenceMessage[]', "caption?: string = ''", 'width?: number = 1200', 'messageGap?: number = 76', 'showNumbers?: boolean = true'],
    slots: [],
    code: `<SequenceDiagram
  :participants="participants"
  :messages="messages"
  caption="Create-order sequence"
/>`,
  },
  {
    id: 'flow-diagram',
    name: 'FlowDiagram',
    category: 'diagram',
    source: 'content/FlowDiagram.vue',
    props: ['items: FlowItem[] = []'],
    slots: [],
    code: `<FlowDiagram
  :items="[
    { title: 'Author', description: 'Compose Vue components' },
    { title: 'Build', description: 'Generate one HTML file' },
    { title: 'Share', description: 'Present online or offline' },
  ]"
/>`,
  },
  {
    id: 'timeline',
    name: 'Timeline',
    category: 'diagram',
    source: 'content/Timeline.vue',
    props: ['items: TimelineItem[] = []'],
    slots: [],
    dark: true,
    code: `<Slide dark>
  <Timeline
    :items="[
      { meta: 'STEP 01', title: 'Author', description: 'Compose slides.' },
      { meta: 'STEP 02', title: 'Preview', description: 'Check every page.' },
      { meta: 'STEP 03', title: 'Build', description: 'Generate HTML.' },
      { meta: 'STEP 04', title: 'Deliver', description: 'Share the file.' },
    ]"
  />
</Slide>`,
  },
]

export const componentCategories: ComponentCategory[] = ['layout', 'text', 'media', 'diagram']

export const findComponent = (id: string) => componentCatalog.find((item) => item.id === id)
