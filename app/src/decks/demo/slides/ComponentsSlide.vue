<script setup lang="ts">
import { computed } from 'vue'
import Slide from '../../../core/Slide.vue'
import TwoColumn from '../../../components/layout/TwoColumn.vue'
import Stack from '../../../components/layout/Stack.vue'
import Card from '../../../components/content/Card.vue'
import CodeBlock from '../../../components/content/CodeBlock.vue'
import { useI18n } from '../../../i18n'

const { t } = useI18n()
const example = computed(() => `<Slide title="${t('deck.slides.components.codeTitle')}">
  <TwoColumn ratio="1.2fr 0.8fr">
    <template #left>
      <BulletList :items="steps" />
    </template>
    <template #right>
      <ImageFigure src="./flow.svg" />
    </template>
  </TwoColumn>
</Slide>`)
</script>

<template>
  <Slide
    :eyebrow="t('deck.slides.components.eyebrow')"
    :title="t('deck.slides.components.title')"
    :subtitle="t('deck.slides.components.subtitle')"
    :footer="t('deck.slides.components.footer')"
    :duration="t('deck.slides.components.duration')"
  >
    <TwoColumn ratio="1.15fr 0.85fr" :gap="56">
      <template #left>
        <CodeBlock :code="example" language="vue" caption="slides/OrderApiSlide.vue" />
      </template>
      <template #right>
        <Stack :gap="22">
          <Card :title="t('deck.slides.components.templateTitle')" tone="accent">{{ t('deck.slides.components.templateBody') }}</Card>
          <Card :title="t('deck.slides.components.layoutTitle')">{{ t('deck.slides.components.layoutBody') }}</Card>
          <Card :title="t('deck.slides.components.contentTitle')">{{ t('deck.slides.components.contentBody') }}</Card>
        </Stack>
      </template>
    </TwoColumn>
  </Slide>
</template>
