<script setup lang="ts">
import { computed } from 'vue'
import Slide from '../../../core/Slide.vue'
import Stack from '../../../components/layout/Stack.vue'
import TwoColumn from '../../../components/layout/TwoColumn.vue'
import FlowDiagram from '../../../components/content/FlowDiagram.vue'
import CodeBlock from '../../../components/content/CodeBlock.vue'
import Callout from '../../../components/content/Callout.vue'
import { useI18n } from '../../../i18n'

const { t, tm } = useI18n()
const flow = computed(() => tm<{ title: string; description: string }[]>('deck.slides.scaling.flow'))
const formula = `scale = min(
  1,
  availableWidth / 1920,
  availableHeight / 1080
)`
</script>

<template>
  <Slide
    :eyebrow="t('deck.slides.scaling.eyebrow')"
    :title="t('deck.slides.scaling.title')"
    :subtitle="t('deck.slides.scaling.subtitle')"
    :footer="t('deck.slides.scaling.footer')"
    :duration="t('deck.slides.scaling.duration')"
  >
    <Stack :gap="52">
      <FlowDiagram :items="flow" />
      <TwoColumn ratio="1fr 1fr" :gap="48">
        <template #left><CodeBlock :code="formula" language="ts" :caption="t('deck.slides.scaling.formulaCaption')" /></template>
        <template #right>
          <Callout :title="t('deck.slides.scaling.calloutTitle')" tone="success">
            {{ t('deck.slides.scaling.calloutBody') }}
          </Callout>
        </template>
      </TwoColumn>
    </Stack>
  </Slide>
</template>
