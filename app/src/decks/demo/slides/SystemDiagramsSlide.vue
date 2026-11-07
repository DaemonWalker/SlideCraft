<script setup lang="ts">
import { computed } from 'vue'
import Slide from '../../../core/Slide.vue'
import { ArchitectureDiagram, SequenceDiagram, TwoColumn, Stack } from '../../../components'
import type { ArchitectureEdge, ArchitectureNode } from '../../../components/content/ArchitectureDiagram.vue'
import type { SequenceMessage, SequenceParticipant } from '../../../components/content/SequenceDiagram.vue'
import { useI18n } from '../../../i18n'

const { t, tm } = useI18n()
const nodeLayout: Record<string, Pick<ArchitectureNode, 'x' | 'y' | 'kind'>> = {
  client: { x: 140, y: 105, kind: 'client' },
  gateway: { x: 460, y: 105, kind: 'service' },
  orders: { x: 790, y: 105, kind: 'service' },
  queue: { x: 460, y: 340, kind: 'queue' },
  database: { x: 790, y: 340, kind: 'database' },
}
const architectureNodes = computed(() => tm<Omit<ArchitectureNode, 'x' | 'y'>[]>(
  'deck.slides.system-diagrams.architecture.nodes',
).map((node) => ({ ...node, ...nodeLayout[node.id] })))
const architectureEdges = computed(() => tm<ArchitectureEdge[]>('deck.slides.system-diagrams.architecture.edges'))
const participants = computed(() => tm<SequenceParticipant[]>('deck.slides.system-diagrams.sequence.participants'))
const messages = computed(() => tm<SequenceMessage[]>('deck.slides.system-diagrams.sequence.messages'))
</script>

<template>
  <Slide
    :eyebrow="t('deck.slides.system-diagrams.eyebrow')"
    :title="t('deck.slides.system-diagrams.title')"
    :subtitle="t('deck.slides.system-diagrams.subtitle')"
    :footer="t('deck.slides.system-diagrams.footer')"
    :duration="t('deck.slides.system-diagrams.duration')"
    content-align="start"
  >
    <TwoColumn ratio="1fr 1fr" :gap="28" align="start">
      <template #left>
        <Stack :gap="18">
          <ArchitectureDiagram
            :nodes="architectureNodes"
            :edges="architectureEdges"
            :caption="t('deck.slides.system-diagrams.architecture.caption')"
            :height="460"
          />
        </Stack>
      </template>
      <template #right>
        <SequenceDiagram
          :participants="participants"
          :messages="messages"
          :caption="t('deck.slides.system-diagrams.sequence.caption')"
        />
      </template>
    </TwoColumn>
  </Slide>
</template>
