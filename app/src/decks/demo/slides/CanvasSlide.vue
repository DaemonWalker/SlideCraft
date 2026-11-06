<script setup lang="ts">
import { computed } from 'vue'
import Slide from '../../../core/Slide.vue'
import TwoColumn from '../../../components/layout/TwoColumn.vue'
import Stack from '../../../components/layout/Stack.vue'
import Metric from '../../../components/content/Metric.vue'
import BulletList from '../../../components/content/BulletList.vue'
import ImageFigure from '../../../components/content/ImageFigure.vue'
import viewportDiagram from '../../../assets/viewport-diagram.svg'
import { useI18n } from '../../../i18n'

const { t, tm } = useI18n()
const bullets = computed(() => tm<string[]>('deck.slides.canvas.bullets'))
</script>

<template>
  <Slide
    :eyebrow="t('deck.slides.canvas.eyebrow')"
    :title="t('deck.slides.canvas.title')"
    :subtitle="t('deck.slides.canvas.subtitle')"
    :footer="t('deck.slides.canvas.footer')"
    :duration="t('deck.slides.canvas.duration')"
  >
    <TwoColumn ratio="0.85fr 1.15fr" :gap="64">
      <template #left>
        <Stack :gap="34">
          <Metric value="1920 × 1080" label="DESIGN CANVAS" :description="t('deck.slides.canvas.metricDescription')" />
          <BulletList :items="bullets" />
        </Stack>
      </template>
      <template #right>
        <ImageFigure :src="viewportDiagram" :alt="t('deck.slides.canvas.imageAlt')" :caption="t('deck.slides.canvas.imageCaption')" />
      </template>
    </TwoColumn>
  </Slide>
</template>
