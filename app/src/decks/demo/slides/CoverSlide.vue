<script setup lang="ts">
import Slide from '../../../core/Slide.vue'
import TwoColumn from '../../../components/layout/TwoColumn.vue'
import TagList from '../../../components/content/TagList.vue'
import { useI18n } from '../../../i18n'

const { t } = useI18n()
</script>

<template>
  <Slide dark :eyebrow="t('deck.slides.cover.eyebrow')" :footer="t('deck.slides.cover.footer')" footer-right="1920 × 1080">
    <TwoColumn ratio="1.2fr 0.8fr" :gap="80">
      <template #left>
        <div class="cover-copy">
          <span class="cover-copy__badge">{{ t('deck.slides.cover.badge') }}</span>
          <h1>{{ t('deck.slides.cover.headingBefore') }}<br /><span>{{ t('deck.slides.cover.headingAccent') }}</span></h1>
          <p>{{ t('deck.slides.cover.description') }}</p>
          <TagList :items="['Vue 3', 'TypeScript', 'Single HTML']" />
        </div>
      </template>
      <template #right>
        <div class="blueprint" :aria-label="t('deck.slides.cover.blueprintAlt')">
          <div class="blueprint__top"><span></span><span></span><span></span></div>
          <div class="blueprint__title"></div>
          <div class="blueprint__subtitle"></div>
          <div class="blueprint__grid">
            <div><strong>&lt;Card /&gt;</strong><span></span><span></span></div>
            <div><strong>&lt;Image /&gt;</strong><span></span><span></span></div>
          </div>
          <div class="blueprint__flow"><strong>&lt;FlowDiagram /&gt;</strong><span></span></div>
          <div class="blueprint__footer"></div>
        </div>
      </template>
    </TwoColumn>
  </Slide>
</template>

<style scoped>
.cover-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.cover-copy__badge {
  padding: 8px 18px;
  border: 1px solid var(--line-dark);
  border-radius: 999px;
  color: var(--accent-on-dark);
  font-size: 18px;
  font-weight: 650;
  letter-spacing: 0.08em;
}

h1 {
  margin-top: 38px;
  color: var(--on-dark);
  font-size: 88px;
  font-weight: 760;
  letter-spacing: -0.045em;
  line-height: 1.15;
}

h1 span {
  color: var(--accent-on-dark);
}

:global(html[lang='ja']) h1 {
  font-size: 72px;
}

:global(html[lang='en']) h1 {
  font-size: 68px;
  line-height: 1.12;
}

:global(html[lang='en']) .cover-copy__badge {
  letter-spacing: 0.03em;
}

.cover-copy > p {
  max-width: 760px;
  margin: 34px 0;
  color: var(--on-dark-muted);
  font-size: 29px;
  line-height: 1.65;
}

.blueprint {
  position: relative;
  padding: 30px;
  border: 1px solid var(--line-dark);
  border-radius: 20px;
  background: oklch(0.29 0.055 240);
  box-shadow: 22px 22px 0 oklch(0.21 0.045 240);
}

.blueprint__top {
  display: flex;
  gap: 8px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--line-dark);
}

.blueprint__top span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--on-dark-muted);
}

.blueprint__title,
.blueprint__subtitle,
.blueprint__grid span,
.blueprint__flow span,
.blueprint__footer {
  border-radius: 5px;
  background: var(--line-dark);
}

.blueprint__title {
  width: 65%;
  height: 26px;
  margin-top: 34px;
  background: var(--accent-on-dark);
}

.blueprint__subtitle {
  width: 44%;
  height: 14px;
  margin-top: 16px;
}

.blueprint__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-top: 40px;
}

.blueprint__grid > div,
.blueprint__flow {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 22px;
  border: 1px solid var(--line-dark);
  border-radius: 12px;
}

.blueprint__grid strong,
.blueprint__flow strong {
  color: var(--accent-on-dark);
  font-family: var(--font-code);
  font-size: 16px;
}

.blueprint__grid span {
  width: 100%;
  height: 9px;
}

.blueprint__grid span:last-child {
  width: 65%;
}

.blueprint__flow {
  margin-top: 18px;
}

.blueprint__flow span {
  width: 78%;
  height: 9px;
}

.blueprint__footer {
  width: 100%;
  height: 1px;
  margin-top: 28px;
}
</style>
