<script setup lang="ts">
import { nextTick, onMounted, onUpdated, ref } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  eyebrow?: string
  duration?: string
  footer?: string
  footerRight?: string
  dark?: boolean
  contentAlign?: 'start' | 'center'
}>(), {
  title: '',
  subtitle: '',
  eyebrow: '',
  duration: '',
  footer: '',
  footerRight: 'SlideCraft',
  dark: false,
  contentAlign: 'center',
})

const slide = ref<HTMLElement>()
const hasOverflow = ref(false)

const checkOverflow = async () => {
  await nextTick()
  if (!slide.value) return
  hasOverflow.value = slide.value.scrollHeight > slide.value.clientHeight + 2
    || slide.value.scrollWidth > slide.value.clientWidth + 2

  if (import.meta.env.DEV && hasOverflow.value) {
    console.warn(`[SlideCraft] 页面内容超出 1920 × 1080 画布：${props.title || '未命名页面'}`)
  }
}

onMounted(checkOverflow)
onUpdated(checkOverflow)
defineExpose({ checkOverflow })
</script>

<template>
  <article
    ref="slide"
    class="slide"
    :class="{ 'slide--dark': dark, 'slide--cover': !title }"
    :data-overflow="hasOverflow || undefined"
  >
    <div v-if="eyebrow || duration" class="slide__topline">
      <span class="slide__eyebrow">{{ eyebrow }}</span>
      <span v-if="duration" class="slide__duration">{{ duration }}</span>
    </div>

    <header v-if="title || subtitle" class="slide__header">
      <h2 v-if="title" class="slide__title">{{ title }}</h2>
      <p v-if="subtitle" class="slide__subtitle">{{ subtitle }}</p>
    </header>

    <div class="slide__content" :class="`slide__content--${contentAlign}`">
      <slot />
    </div>

    <footer v-if="footer || $slots.footer" class="slide__footer">
      <slot name="footer">
        <span>{{ footer }}</span>
        <strong>{{ footerRight }}</strong>
      </slot>
    </footer>
  </article>
</template>

<style scoped>
.slide {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
  padding: 64px 84px 46px;
  color: var(--ink);
  background: var(--surface-slide);
}

.slide--dark {
  color: var(--on-dark);
  background: var(--surface-dark);
}

.slide__topline {
  display: flex;
  min-height: 40px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
}

.slide__eyebrow {
  color: var(--accent);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.slide--dark .slide__eyebrow {
  color: var(--accent-on-dark);
}

.slide__duration {
  padding: 6px 16px;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--ink-muted);
  font-size: 18px;
}

.slide--dark .slide__duration {
  border-color: var(--line-dark);
  color: var(--on-dark-muted);
}

.slide__header {
  flex: none;
}

.slide__title {
  max-width: 1400px;
  color: inherit;
  font-size: 64px;
  font-weight: 750;
  letter-spacing: -0.035em;
  line-height: 1.14;
}

.slide__subtitle {
  max-width: 1450px;
  margin-top: 18px;
  color: var(--ink-muted);
  font-size: 28px;
  line-height: 1.55;
}

.slide--dark .slide__subtitle {
  color: var(--on-dark-muted);
}

.slide__content {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  margin-top: 42px;
}

.slide--cover .slide__content {
  margin-top: 0;
}

.slide__content--start {
  justify-content: flex-start;
}

.slide__content--center {
  justify-content: center;
}

.slide__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  margin-top: auto;
  padding-top: 22px;
  border-top: 1px solid var(--line);
  color: var(--ink-muted);
  font-size: 18px;
}

.slide__footer strong {
  color: var(--accent);
  font-weight: 650;
}

.slide--dark .slide__footer {
  border-color: var(--line-dark);
  color: var(--on-dark-muted);
}

.slide--dark .slide__footer strong {
  color: var(--accent-on-dark);
}

.slide[data-overflow] {
  outline: 6px solid var(--danger);
  outline-offset: -6px;
}
</style>
