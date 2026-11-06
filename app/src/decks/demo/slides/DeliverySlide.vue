<script setup lang="ts">
import { computed } from 'vue'
import Slide from '../../../core/Slide.vue'
import Stack from '../../../components/layout/Stack.vue'
import Timeline from '../../../components/content/Timeline.vue'
import { useI18n } from '../../../i18n'

const { t, tm } = useI18n()
const steps = computed(() => tm<{ meta: string; title: string; description: string }[]>('deck.slides.delivery.steps'))
</script>

<template>
  <Slide dark :eyebrow="t('deck.slides.delivery.eyebrow')" footer="SlideCraft" :footer-right="t('deck.slides.delivery.footerRight')">
    <div class="delivery-title">
      <h1>{{ t('deck.slides.delivery.heading') }}</h1>
      <p>{{ t('deck.slides.delivery.subtitle') }}</p>
    </div>
    <Stack :gap="56">
      <Timeline :items="steps" />
      <div class="delivery-command">
        <span>{{ t('deck.slides.delivery.commandLabel') }}</span>
        <code>npm run build:offline</code>
        <strong>dist/index.html</strong>
      </div>
    </Stack>
  </Slide>
</template>

<style scoped>
.delivery-title {
  margin-bottom: 64px;
}

.delivery-title h1 {
  max-width: 1300px;
  color: var(--on-dark);
  font-size: 66px;
  letter-spacing: -0.035em;
  line-height: 1.2;
}

.delivery-title p {
  margin-top: 20px;
  color: var(--on-dark-muted);
  font-size: 28px;
}

.delivery-command {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 32px;
  padding: 26px 30px;
  border: 1px solid var(--line-dark);
  border-radius: var(--radius-panel);
  background: oklch(0.29 0.055 240);
}

.delivery-command span {
  color: var(--on-dark-muted);
  font-size: 18px;
}

.delivery-command code {
  color: var(--accent-on-dark);
  font-size: 24px;
}

.delivery-command strong {
  color: var(--on-dark);
  font-family: var(--font-code);
  font-size: 20px;
}
</style>
