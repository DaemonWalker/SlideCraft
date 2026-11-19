<script setup lang="ts">
import { computed, useId, watch } from 'vue'

export interface CycleStep {
  title: string
  description?: string
}

interface NodePosition {
  x: number
  y: number
}

const props = withDefaults(defineProps<{
  items: CycleStep[]
  activeStep?: number
  centerLabel?: string
  caption?: string
  width?: number
}>(), {
  activeStep: 0,
  centerLabel: '',
  caption: '',
  width: 1400,
})

const markerId = useId()
const items = computed(() => props.items.slice(0, 5))
const isLinear = computed(() => items.value.length < 3)
const height = computed(() => isLinear.value ? 320 : 590)
const hasActiveStep = computed(() => props.activeStep > 0)

const positions = computed<NodePosition[]>(() => {
  const count = items.value.length
  const centerX = props.width / 2

  if (isLinear.value) {
    return items.value.map((_, index) => ({
      x: props.width * (index + 1) / (count + 1),
      y: 160,
    }))
  }

  if (count === 3) {
    return [
      { x: centerX, y: 100 },
      { x: props.width * 0.75, y: 460 },
      { x: props.width * 0.25, y: 460 },
    ]
  }

  if (count === 4) {
    return [
      { x: props.width * 0.264, y: 110 },
      { x: props.width * 0.736, y: 110 },
      { x: props.width * 0.736, y: 450 },
      { x: props.width * 0.264, y: 450 },
    ]
  }

  return [
    { x: centerX, y: 90 },
    { x: props.width * 0.779, y: 250 },
    { x: props.width * 0.686, y: 475 },
    { x: props.width * 0.314, y: 475 },
    { x: props.width * 0.221, y: 250 },
  ]
})

const nodes = computed(() => items.value.map((item, index) => ({
  ...item,
  ...positions.value[index],
  index,
  width: 360,
  height: 150,
})))

const center = computed(() => ({
  x: positions.value.reduce((sum, position) => sum + position.x, 0) / positions.value.length,
  y: positions.value.reduce((sum, position) => sum + position.y, 0) / positions.value.length,
}))

const boundaryPoint = (
  node: NodePosition & { width: number, height: number },
  target: NodePosition,
) => {
  const deltaX = target.x - node.x
  const deltaY = target.y - node.y
  const scaleX = deltaX === 0 ? Number.POSITIVE_INFINITY : node.width / 2 / Math.abs(deltaX)
  const scaleY = deltaY === 0 ? Number.POSITIVE_INFINITY : node.height / 2 / Math.abs(deltaY)
  const scale = Math.min(scaleX, scaleY)
  return { x: node.x + deltaX * scale, y: node.y + deltaY * scale }
}

const edges = computed(() => nodes.value.flatMap((node, index) => {
  if (isLinear.value && index === nodes.value.length - 1) return []
  const target = nodes.value[(index + 1) % nodes.value.length]
  const start = boundaryPoint(node, target)
  const end = boundaryPoint(target, node)
  return [{
    index,
    path: `M ${start.x} ${start.y} L ${end.x} ${end.y}`,
  }]
}))

watch(() => props.items.length, (count) => {
  if (!import.meta.env.DEV) return
  if (count < 3) {
    console.warn(`[SlideCraft] CycleDiagram 需要至少 3 个步骤，当前为 ${count} 个，已降级为横向布局。`)
  } else if (count > 5) {
    console.warn(`[SlideCraft] CycleDiagram 最多支持 5 个步骤，当前为 ${count} 个，仅显示前 5 个。`)
  }
}, { immediate: true })
</script>

<template>
  <div class="cycle-diagram">
    <figure class="cycle-diagram__figure">
      <figcaption v-if="caption">{{ caption }}</figcaption>
      <svg
        :viewBox="`0 0 ${width} ${height}`"
        role="img"
        :aria-label="caption || 'Cycle diagram'"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker :id="markerId" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 10 5 L 0 10 z" class="cycle-diagram__arrow" />
          </marker>
        </defs>
        <g :class="{ 'cycle-diagram__edges--dimmed': hasActiveStep }">
          <path
            v-for="edge in edges"
            :key="edge.index"
            :d="edge.path"
            class="cycle-diagram__edge"
            :marker-end="`url(#${markerId})`"
          />
        </g>
        <g
          v-for="node in nodes"
          :key="`${node.title}-${node.index}`"
          class="cycle-diagram__node"
          :class="{
            'cycle-diagram__node--active': activeStep === node.index + 1,
            'cycle-diagram__node--dimmed': hasActiveStep && activeStep !== node.index + 1,
          }"
          :aria-current="activeStep === node.index + 1 ? 'step' : undefined"
        >
          <rect
            :x="node.x - node.width / 2"
            :y="node.y - node.height / 2"
            :width="node.width"
            :height="node.height"
            :rx="16"
            class="cycle-diagram__card"
          />
          <rect
            :x="node.x - node.width / 2 + 22"
            :y="node.y - node.height / 2 + 20"
            width="46"
            height="30"
            rx="15"
            class="cycle-diagram__badge"
          />
          <text
            :x="node.x - node.width / 2 + 45"
            :y="node.y - node.height / 2 + 41"
            text-anchor="middle"
            class="cycle-diagram__number"
          >{{ String(node.index + 1).padStart(2, '0') }}</text>
          <text
            :x="node.x - node.width / 2 + 24"
            :y="node.y - node.height / 2 + 84"
            class="cycle-diagram__title"
          >{{ node.title }}</text>
          <text
            v-if="node.description"
            :x="node.x - node.width / 2 + 24"
            :y="node.y - node.height / 2 + 120"
            class="cycle-diagram__description"
          >{{ node.description }}</text>
        </g>
        <foreignObject
          v-if="!isLinear && ($slots.center || centerLabel)"
          :x="center.x - 140"
          :y="center.y - 42"
          width="280"
          height="84"
        >
          <div class="cycle-diagram__center">
            <slot name="center">{{ centerLabel }}</slot>
          </div>
        </foreignObject>
      </svg>
    </figure>
    <div v-if="$slots.default" class="cycle-diagram__conclusion"><slot /></div>
  </div>
</template>

<style scoped>
.cycle-diagram {
  width: 100%;
  min-width: 0;
}

.cycle-diagram__figure {
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: var(--radius-panel);
  background: var(--surface-slide);
}

.cycle-diagram__figure figcaption {
  padding: 14px 22px;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
  background: var(--surface-muted);
  font-size: 17px;
  font-weight: 700;
}

.cycle-diagram__figure svg {
  width: 100%;
  height: auto;
}

.cycle-diagram__edge {
  fill: none;
  stroke: var(--accent);
  stroke-width: 2.5;
}

.cycle-diagram__edges--dimmed {
  opacity: 0.45;
}

.cycle-diagram__arrow {
  fill: var(--accent);
}

.cycle-diagram__card {
  fill: var(--surface-muted);
  stroke: var(--line-strong);
  stroke-width: 2;
}

.cycle-diagram__badge {
  fill: var(--accent);
}

.cycle-diagram__number {
  fill: var(--on-dark);
  font-family: var(--font-code);
  font-size: 14px;
  font-weight: 700;
}

.cycle-diagram__title {
  fill: var(--ink);
  font-size: 25px;
  font-weight: 700;
}

.cycle-diagram__description {
  fill: var(--ink-muted);
  font-size: 16px;
}

.cycle-diagram__node--active .cycle-diagram__card {
  fill: var(--surface-accent);
  stroke: var(--accent);
  stroke-width: 3;
}

.cycle-diagram__node--dimmed {
  opacity: 0.45;
}

.cycle-diagram__center {
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  color: var(--accent);
  font-size: 26px;
  font-weight: 700;
  line-height: 1.35;
  text-align: center;
}

.cycle-diagram__conclusion {
  margin-top: 30px;
  padding: 22px 30px;
  border: 1px solid var(--line);
  border-radius: var(--radius-panel);
  color: var(--ink-muted);
  background: var(--surface-muted);
  font-size: 22px;
}

.cycle-diagram__conclusion :deep(p + p) {
  margin-top: 6px;
}

:global(.slide--dark .cycle-diagram__figure) {
  border-color: var(--line-dark);
  background: var(--surface-dark);
}

:global(.slide--dark .cycle-diagram__figure figcaption) {
  border-color: var(--line-dark);
  color: var(--on-dark);
  background: var(--surface-dark);
}

:global(.slide--dark .cycle-diagram__edge) {
  stroke: var(--accent-on-dark);
}

:global(.slide--dark .cycle-diagram__arrow) {
  fill: var(--accent-on-dark);
}

:global(.slide--dark .cycle-diagram__card) {
  fill: var(--surface-dark);
  stroke: var(--line-dark);
}

:global(.slide--dark .cycle-diagram__badge) {
  fill: var(--accent-on-dark);
}

:global(.slide--dark .cycle-diagram__number) {
  fill: var(--surface-dark);
}

:global(.slide--dark .cycle-diagram__title) {
  fill: var(--on-dark);
}

:global(.slide--dark .cycle-diagram__description) {
  fill: var(--on-dark-muted);
}

:global(.slide--dark .cycle-diagram__node--active .cycle-diagram__card) {
  fill: var(--surface-dark);
  stroke: var(--accent-on-dark);
}

:global(.slide--dark .cycle-diagram__center) {
  color: var(--accent-on-dark);
}

:global(.slide--dark .cycle-diagram__conclusion) {
  border-color: var(--line-dark);
  color: var(--on-dark-muted);
  background: var(--surface-dark);
}
</style>
