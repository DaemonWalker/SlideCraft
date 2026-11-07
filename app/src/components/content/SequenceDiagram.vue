<script setup lang="ts">
import { computed, useId } from 'vue'

export interface SequenceParticipant {
  id: string
  title: string
  subtitle?: string
  tone?: 'default' | 'accent' | 'success' | 'warning'
}

export interface SequenceMessage {
  from: string
  to: string
  label: string
  type?: 'sync' | 'async' | 'return'
}

const props = withDefaults(defineProps<{
  participants: SequenceParticipant[]
  messages: SequenceMessage[]
  caption?: string
  width?: number
  messageGap?: number
  showNumbers?: boolean
}>(), {
  caption: '',
  width: 1200,
  messageGap: 76,
  showNumbers: true,
})

const markerId = useId()
const height = computed(() => 164 + props.messages.length * props.messageGap)
const participants = computed(() => {
  const count = Math.max(props.participants.length, 1)
  const boxWidth = Math.min(220, props.width / count - 36)
  return props.participants.map((participant, index) => ({
    ...participant,
    x: props.width * (index + 1) / (props.participants.length + 1),
    boxWidth,
    tone: participant.tone ?? 'default',
  }))
})
const participantMap = computed(() => new Map(participants.value.map((participant) => [participant.id, participant])))
const messages = computed(() => props.messages.flatMap((message, index) => {
  const from = participantMap.value.get(message.from)
  const to = participantMap.value.get(message.to)
  if (!from || !to) return []
  const y = 128 + index * props.messageGap
  const self = from.id === to.id
  return [{
    ...message,
    index,
    fromX: from.x,
    toX: to.x,
    y,
    self,
    type: message.type ?? 'sync',
    path: self ? `M ${from.x} ${y} L ${from.x + 58} ${y} L ${from.x + 58} ${y + 34} L ${from.x} ${y + 34}` : `M ${from.x} ${y} L ${to.x} ${y}`,
    labelX: self ? from.x + 70 : (from.x + to.x) / 2,
    labelY: self ? y + 22 : y - 11,
    labelAnchor: self ? 'start' : 'middle',
    labelText: props.showNumbers ? `${index + 1}. ${message.label}` : message.label,
  }]
}))
</script>

<template>
  <figure class="sequence-diagram">
    <figcaption v-if="caption">{{ caption }}</figcaption>
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      role="img"
      :aria-label="caption"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <marker :id="markerId" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
          <path d="M 0 0 L 10 5 L 0 10 z" class="sequence-diagram__arrow" />
        </marker>
      </defs>
      <g v-for="participant in participants" :key="participant.id">
        <line :x1="participant.x" :x2="participant.x" y1="86" :y2="height - 30" class="sequence-diagram__lifeline" />
        <rect
          :x="participant.x - participant.boxWidth / 2"
          :y="18"
          :width="participant.boxWidth"
          height="68"
          rx="14"
          class="sequence-diagram__participant"
          :class="`sequence-diagram__participant--${participant.tone}`"
        />
        <text :x="participant.x" :y="participant.subtitle ? 45 : 56" class="sequence-diagram__participant-title" text-anchor="middle">{{ participant.title }}</text>
        <text v-if="participant.subtitle" :x="participant.x" :y="68" class="sequence-diagram__participant-subtitle" text-anchor="middle">{{ participant.subtitle }}</text>
      </g>
      <g v-for="message in messages" :key="message.index">
        <path
          :d="message.path"
          class="sequence-diagram__message"
          :class="`sequence-diagram__message--${message.type}`"
          :marker-end="`url(#${markerId})`"
        />
        <text :x="message.labelX" :y="message.labelY" :text-anchor="message.labelAnchor" class="sequence-diagram__message-label">{{ message.labelText }}</text>
      </g>
    </svg>
  </figure>
</template>

<style scoped>
.sequence-diagram {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--radius-panel);
  background: var(--surface-slide);
}

.sequence-diagram figcaption {
  padding: 14px 22px;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
  background: var(--surface-muted);
  font-size: 17px;
  font-weight: 700;
}

.sequence-diagram svg {
  display: block;
  width: 100%;
  height: auto;
}

.sequence-diagram__lifeline {
  stroke: var(--line-strong);
  stroke-width: 2;
  stroke-dasharray: 6 6;
}

.sequence-diagram__participant {
  fill: var(--surface-muted);
  stroke: var(--line-strong);
  stroke-width: 2;
}

.sequence-diagram__participant--accent { fill: var(--surface-accent); stroke: var(--accent); }
.sequence-diagram__participant--success { fill: var(--surface-success); stroke: var(--success); }
.sequence-diagram__participant--warning { fill: var(--surface-warning); stroke: var(--warning); }

.sequence-diagram__participant-title {
  fill: var(--ink);
  font-size: 19px;
  font-weight: 700;
}

.sequence-diagram__participant-subtitle {
  fill: var(--ink-muted);
  font-family: var(--font-code);
  font-size: 13px;
}

.sequence-diagram__message {
  fill: none;
  stroke: var(--accent);
  stroke-width: 2.5;
}

.sequence-diagram__message--async { stroke-dasharray: 8 5; }
.sequence-diagram__message--return { stroke: var(--success); stroke-dasharray: 7 5; }
.sequence-diagram__arrow { fill: var(--accent); }

.sequence-diagram__message-label {
  fill: var(--ink);
  stroke: var(--surface-slide);
  stroke-width: 6px;
  paint-order: stroke;
  font-size: 16px;
}
</style>
