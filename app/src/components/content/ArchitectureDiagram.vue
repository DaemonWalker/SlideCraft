<script setup lang="ts">
import { computed, useId } from 'vue'

export type ArchitectureNodeKind = 'service' | 'client' | 'database' | 'cache' | 'queue' | 'external'

export interface ArchitectureNode {
  id: string
  title: string
  description?: string
  x: number
  y: number
  width?: number
  height?: number
  kind?: ArchitectureNodeKind
}

export interface ArchitectureEdge {
  from: string
  to: string
  label?: string
  route?: 'direct' | 'orthogonal'
  tone?: 'default' | 'warning' | 'success'
}

const props = withDefaults(defineProps<{
  nodes: ArchitectureNode[]
  edges?: ArchitectureEdge[]
  caption?: string
  width?: number
  height?: number
}>(), {
  edges: () => [],
  caption: '',
  width: 1200,
  height: 560,
})

const markerId = useId()
const nodes = computed(() => props.nodes.map((node) => ({
  ...node,
  width: node.width ?? 190,
  height: node.height ?? 86,
  kind: node.kind ?? 'service',
})))
const nodeMap = computed(() => new Map(nodes.value.map((node) => [node.id, node])))

const boundaryPoint = (
  node: { x: number; y: number; width: number; height: number },
  target: { x: number; y: number },
) => {
  const deltaX = target.x - node.x
  const deltaY = target.y - node.y
  const scaleX = deltaX === 0 ? Number.POSITIVE_INFINITY : node.width / 2 / Math.abs(deltaX)
  const scaleY = deltaY === 0 ? Number.POSITIVE_INFINITY : node.height / 2 / Math.abs(deltaY)
  const scale = Math.min(scaleX, scaleY)
  return { x: node.x + deltaX * scale, y: node.y + deltaY * scale }
}

const edges = computed(() => props.edges.flatMap((edge) => {
  const from = nodeMap.value.get(edge.from)
  const to = nodeMap.value.get(edge.to)
  if (!from || !to || from.id === to.id) return []
  const start = boundaryPoint(from, to)
  const end = boundaryPoint(to, from)
  const route = edge.route ?? 'direct'
  const middleX = (start.x + end.x) / 2
  const path = route === 'orthogonal'
    ? `M ${start.x} ${start.y} L ${middleX} ${start.y} L ${middleX} ${end.y} L ${end.x} ${end.y}`
    : `M ${start.x} ${start.y} L ${end.x} ${end.y}`
  return [{
    ...edge,
    path,
    labelX: middleX,
    labelY: (start.y + end.y) / 2 - 10,
    tone: edge.tone ?? 'default',
  }]
}))
</script>

<template>
  <figure class="architecture-diagram">
    <figcaption v-if="caption">{{ caption }}</figcaption>
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      role="img"
      :aria-label="caption"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <marker :id="markerId" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
          <path d="M 0 0 L 10 5 L 0 10 z" class="architecture-diagram__arrow" />
        </marker>
      </defs>
      <g v-for="(edge, index) in edges" :key="`${edge.from}-${edge.to}-${index}`">
        <path
          :d="edge.path"
          class="architecture-diagram__edge"
          :class="`architecture-diagram__edge--${edge.tone}`"
          :marker-end="`url(#${markerId})`"
        />
        <text v-if="edge.label" :x="edge.labelX" :y="edge.labelY" class="architecture-diagram__edge-label" text-anchor="middle">{{ edge.label }}</text>
      </g>
      <g v-for="node in nodes" :key="node.id" class="architecture-diagram__node" :class="`architecture-diagram__node--${node.kind}`">
        <rect :x="node.x - node.width / 2" :y="node.y - node.height / 2" :width="node.width" :height="node.height" rx="16" />
        <text :x="node.x" :y="node.y + (node.description ? -5 : 7)" class="architecture-diagram__node-title" text-anchor="middle">{{ node.title }}</text>
        <text v-if="node.description" :x="node.x" :y="node.y + 24" class="architecture-diagram__node-description" text-anchor="middle">{{ node.description }}</text>
      </g>
    </svg>
  </figure>
</template>

<style scoped>
.architecture-diagram {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--radius-panel);
  background: var(--surface-slide);
}

.architecture-diagram figcaption {
  padding: 14px 22px;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
  background: var(--surface-muted);
  font-size: 17px;
  font-weight: 700;
}

.architecture-diagram svg {
  display: block;
  width: 100%;
  height: auto;
}

.architecture-diagram__edge {
  fill: none;
  stroke: var(--accent);
  stroke-width: 2.5;
}

.architecture-diagram__edge--warning { stroke: var(--warning); }
.architecture-diagram__edge--success { stroke: var(--success); }
.architecture-diagram__arrow { fill: var(--accent); }

.architecture-diagram__edge-label {
  fill: var(--ink-muted);
  stroke: var(--surface-slide);
  stroke-width: 7px;
  paint-order: stroke;
  font-family: var(--font-code);
  font-size: 15px;
}

.architecture-diagram__node rect {
  fill: var(--surface-accent);
  stroke: var(--accent);
  stroke-width: 2;
}

.architecture-diagram__node--client rect { fill: var(--surface-muted); stroke: var(--line-strong); }
.architecture-diagram__node--database rect { fill: var(--surface-success); stroke: var(--success); }
.architecture-diagram__node--cache rect { fill: var(--surface-warning); stroke: var(--warning); }
.architecture-diagram__node--queue rect { fill: oklch(0.94 0.035 310); stroke: oklch(0.58 0.13 310); }
.architecture-diagram__node--external rect { fill: var(--surface-muted); stroke: var(--ink-muted); stroke-dasharray: 7 5; }

.architecture-diagram__node-title {
  fill: var(--ink);
  font-size: 20px;
  font-weight: 700;
}

.architecture-diagram__node-description {
  fill: var(--ink-muted);
  font-size: 14px;
}
</style>
