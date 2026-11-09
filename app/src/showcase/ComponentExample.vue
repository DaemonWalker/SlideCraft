<script setup lang="ts">
import { computed } from 'vue'
import Slide from '../core/Slide.vue'
import {
  ArchitectureDiagram,
  BulletList,
  Callout,
  Card,
  CodeBlock,
  CodeDiff,
  ComparisonLayout,
  ConfigBlock,
  DataTable,
  FlowDiagram,
  Grid,
  ImageFigure,
  Metric,
  ProcessLayout,
  RequestResponse,
  SectionLayout,
  SequenceDiagram,
  Stack,
  TabPanel,
  TagList,
  TerminalBlock,
  Timeline,
  TitleLayout,
  TwoColumn,
} from '../components'
import type { ArchitectureEdge, ArchitectureNode } from '../components/content/ArchitectureDiagram.vue'
import type { DiffLine } from '../components/content/CodeDiff.vue'
import type { ComparisonMetric } from '../components/layout/ComparisonLayout.vue'
import type { ConfigEntry } from '../components/content/ConfigBlock.vue'
import type { FlowItem } from '../components/content/FlowDiagram.vue'
import type { ProcessStep } from '../components/layout/ProcessLayout.vue'
import type { HttpRequest, HttpResponse } from '../components/content/RequestResponse.vue'
import type { SequenceMessage, SequenceParticipant } from '../components/content/SequenceDiagram.vue'
import type { TerminalEntry } from '../components/content/TerminalBlock.vue'
import type { TimelineItem } from '../components/content/Timeline.vue'
import viewportDiagram from '../assets/viewport-diagram.svg'
import { useI18n } from '../i18n'

const props = defineProps<{
  componentId: string
  name: string
  dark?: boolean
}>()

const { t, tm } = useI18n()
const isCover = computed(() => ['title-layout', 'section-layout'].includes(props.componentId))
const bullets = computed(() => tm<string[]>('showcase.examples.bullets'))
const steps = computed(() => tm<string[]>('showcase.examples.steps'))
const tags = computed(() => tm<string[]>('showcase.examples.tags'))
const metrics = computed(() => tm<Array<{ value: string, label: string, description: string }>>('showcase.examples.metrics'))
const callouts = computed(() => tm<Array<{ title: string, body: string }>>('showcase.examples.callouts'))
const comparisonMetrics = computed(() => tm<ComparisonMetric[]>('showcase.examples.comparisonMetrics'))
const comparisonBefore = computed(() => tm<string[]>('showcase.examples.comparisonBefore'))
const comparisonAfter = computed(() => tm<string[]>('showcase.examples.comparisonAfter'))
const processSteps = computed(() => tm<ProcessStep[]>('showcase.examples.processSteps'))
const terminalEntries = computed(() => tm<TerminalEntry[]>('showcase.examples.terminalEntries'))
const configEntries = computed(() => tm<ConfigEntry[]>('showcase.examples.configEntries'))
const tableColumns = computed(() => tm<string[]>('showcase.examples.tableColumns'))
const tableRows = computed(() => tm<string[][]>('showcase.examples.tableRows'))
const architectureNodes = computed(() => tm<ArchitectureNode[]>('showcase.examples.architectureNodes'))
const architectureEdges = computed(() => tm<ArchitectureEdge[]>('showcase.examples.architectureEdges'))
const sequenceParticipants = computed(() => tm<SequenceParticipant[]>('showcase.examples.sequenceParticipants'))
const sequenceMessages = computed(() => tm<SequenceMessage[]>('showcase.examples.sequenceMessages'))
const flowItems = computed(() => tm<FlowItem[]>('showcase.examples.flowItems'))
const timelineItems = computed(() => tm<TimelineItem[]>('showcase.examples.timelineItems'))
const request = computed<HttpRequest>(() => ({
  method: 'POST',
  path: '/api/orders',
  description: t('showcase.examples.requestDescription'),
  headers: { 'Content-Type': 'application/json' },
  body: t('showcase.examples.requestBody'),
}))
const response = computed<HttpResponse>(() => ({
  status: 201,
  statusText: 'Created',
  headers: { 'Content-Type': 'application/json' },
  body: t('showcase.examples.responseBody'),
  duration: '42 ms',
}))

const sourceCode = `import { createApp } from 'vue'
import App from './App.vue'
import './styles/global.css'

const app = createApp(App)
app.mount('#app')`

const javascriptCode = `export async function createOrder(request) {
  const response = await api.post('/orders', request)
  return response.data
}`

const typescriptCode = `interface OrderRequest {
  customerId: string
  items: Array<{ sku: string; quantity: number }>
}

export async function createOrder(request: OrderRequest) {
  const response = await api.post<Order>('/orders', request)
  return response.data
}`

const diffLines: DiffLine[] = [
  { content: 'export const renderSlide = (slide) => {' },
  { type: 'removed', content: '  return `<article>${slide}</article>`' },
  { type: 'added', content: '  return h(Slide, slide.props, slide.content)' },
  { type: 'added', content: '  // Reuse the shared page component' },
  { content: '}' },
]
</script>

<template>
  <Slide
    :dark="dark"
    :title="isCover ? '' : name"
    :eyebrow="t('showcase.examples.eyebrow')"
    :footer="t('showcase.examples.footer')"
  >
    <TwoColumn v-if="componentId === 'two-column'" ratio="1.1fr 0.9fr" :gap="48">
      <template #left>
        <Card :title="t('showcase.examples.cardTitle')" tone="accent">
          <BulletList :items="bullets" />
        </Card>
      </template>
      <template #right>
        <ImageFigure
          :src="viewportDiagram"
          :alt="t('showcase.examples.imageAlt')"
          :caption="t('showcase.examples.titleImageCaption')"
        />
      </template>
    </TwoColumn>

    <Grid v-else-if="componentId === 'grid'" :columns="3" :gap="28">
      <Card v-for="(metric, index) in metrics" :key="metric.label" :title="metric.label" :tone="index === 0 ? 'accent' : 'default'">
        {{ metric.description }}
      </Card>
    </Grid>

    <Stack v-else-if="componentId === 'stack'" :gap="28">
      <Callout :title="callouts[0].title">{{ callouts[0].body }}</Callout>
      <Card :title="t('showcase.examples.cardTitle')">
        <BulletList :items="bullets" />
      </Card>
    </Stack>

    <TitleLayout
      v-else-if="componentId === 'title-layout'"
      :eyebrow="t('showcase.examples.titleEyebrow')"
      :title="t('showcase.examples.titleLine')"
      :accent="t('showcase.examples.titleAccent')"
      :subtitle="t('showcase.examples.titleSubtitle')"
      :meta="t('showcase.examples.titleMeta')"
    >
      <template #tags><TagList :items="tags" /></template>
      <template #visual>
        <ImageFigure
          :src="viewportDiagram"
          :alt="t('showcase.examples.titleImageAlt')"
          :caption="t('showcase.examples.titleImageCaption')"
        />
      </template>
    </TitleLayout>

    <SectionLayout
      v-else-if="componentId === 'section-layout'"
      :number="1"
      :title="t('showcase.examples.sectionTitle')"
      :description="t('showcase.examples.sectionDescription')"
    >
      <TagList :items="tags" />
    </SectionLayout>

    <ComparisonLayout
      v-else-if="componentId === 'comparison-layout'"
      :metrics="comparisonMetrics"
      before-label="Before"
      after-label="After"
    >
      <template #before><BulletList :items="comparisonBefore" /></template>
      <template #after><BulletList :items="comparisonAfter" /></template>
    </ComparisonLayout>

    <ProcessLayout v-else-if="componentId === 'process-layout'" :items="processSteps" :active-step="2">
      {{ t('showcase.examples.processConclusion') }}
    </ProcessLayout>

    <TabPanel
      v-else-if="componentId === 'tab-panel'"
      :items="[
        { id: 'javascript', label: 'JavaScript' },
        { id: 'typescript', label: 'TypeScript' },
      ]"
      default-active="typescript"
      :aria-label="t('showcase.examples.tabAriaLabel')"
    >
      <template #javascript>
        <CodeBlock :code="javascriptCode" language="js" caption="src/order.js" show-line-numbers />
      </template>
      <template #typescript>
        <CodeBlock :code="typescriptCode" language="ts" caption="src/order.ts" show-line-numbers />
      </template>
    </TabPanel>

    <TwoColumn v-else-if="componentId === 'bullet-list'" :gap="36" align="start">
      <template #left><Card title="Unordered"><BulletList :items="bullets" /></Card></template>
      <template #right><Card title="Ordered"><BulletList :items="steps" ordered /></Card></template>
    </TwoColumn>

    <div v-else-if="componentId === 'tag-list'" class="example-center">
      <TagList :items="[...tags, 'Components', 'GitHub Pages', 'SVG']" />
    </div>

    <Grid v-else-if="componentId === 'metric'" :columns="3" :gap="56">
      <Card v-for="metric in metrics" :key="metric.label">
        <Metric :value="metric.value" :label="metric.label" :description="metric.description" />
      </Card>
    </Grid>

    <Grid v-else-if="componentId === 'card'" :columns="4" :gap="24">
      <Card :title="t('showcase.examples.cardTitle')">{{ t('showcase.examples.cardBody') }}</Card>
      <Card :title="t('showcase.examples.cardTitle')" tone="accent">{{ t('showcase.examples.cardBody') }}</Card>
      <Card :title="t('showcase.examples.cardTitle')" tone="warning">{{ t('showcase.examples.cardBody') }}</Card>
      <Card :title="t('showcase.examples.cardTitle')" tone="success">{{ t('showcase.examples.cardBody') }}</Card>
    </Grid>

    <Stack v-else-if="componentId === 'callout'" :gap="24">
      <Callout :title="callouts[0].title">{{ callouts[0].body }}</Callout>
      <Callout :title="callouts[1].title" tone="warning">{{ callouts[1].body }}</Callout>
      <Callout :title="callouts[2].title" tone="success">{{ callouts[2].body }}</Callout>
    </Stack>

    <CodeBlock
      v-else-if="componentId === 'code-block'"
      :code="sourceCode"
      language="ts"
      caption="src/main.ts"
      show-line-numbers
      :highlight-lines="[5]"
    />

    <CodeDiff
      v-else-if="componentId === 'code-diff'"
      :lines="diffLines"
      language="ts"
      caption="src/render.ts"
    />

    <TerminalBlock
      v-else-if="componentId === 'terminal-block'"
      :entries="terminalEntries"
      title="SlideCraft build"
      show-exit-code
    />

    <ConfigBlock
      v-else-if="componentId === 'config-block'"
      :entries="configEntries"
      caption="application.yaml"
    />

    <RequestResponse
      v-else-if="componentId === 'request-response'"
      :request="request"
      :response="response"
      :caption="t('showcase.examples.requestCaption')"
    />

    <ImageFigure
      v-else-if="componentId === 'image-figure'"
      :src="viewportDiagram"
      :alt="t('showcase.examples.imageAlt')"
      :caption="t('showcase.examples.imageCaption')"
    />

    <DataTable
      v-else-if="componentId === 'data-table'"
      :columns="tableColumns"
      :rows="tableRows"
      :caption="t('showcase.examples.tableCaption')"
    />

    <ArchitectureDiagram
      v-else-if="componentId === 'architecture-diagram'"
      :nodes="architectureNodes"
      :edges="architectureEdges"
      :caption="t('showcase.examples.architectureCaption')"
      :height="460"
    />

    <SequenceDiagram
      v-else-if="componentId === 'sequence-diagram'"
      :participants="sequenceParticipants"
      :messages="sequenceMessages"
      :caption="t('showcase.examples.sequenceCaption')"
    />

    <FlowDiagram v-else-if="componentId === 'flow-diagram'" :items="flowItems" />

    <Timeline v-else-if="componentId === 'timeline'" :items="timelineItems" />
  </Slide>
</template>

<style scoped>
.example-center {
  display: flex;
  justify-content: center;
}
</style>
