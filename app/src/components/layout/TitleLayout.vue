<script setup lang="ts">
withDefaults(defineProps<{
  eyebrow?: string
  title: string
  accent?: string
  subtitle?: string
  meta?: string
}>(), {
  eyebrow: '',
  accent: '',
  subtitle: '',
  meta: '',
})
</script>

<template>
  <div class="title-layout" :class="{ 'title-layout--solo': !$slots.visual }">
    <div class="title-layout__copy">
      <span v-if="eyebrow" class="title-layout__eyebrow">{{ eyebrow }}</span>
      <h1 class="title-layout__title">
        <span>{{ title }}</span>
        <span v-if="accent" class="title-layout__accent">{{ accent }}</span>
      </h1>
      <p v-if="subtitle" class="title-layout__subtitle">{{ subtitle }}</p>
      <div v-if="$slots.tags" class="title-layout__tags"><slot name="tags" /></div>
      <div v-if="meta || $slots.meta" class="title-layout__meta">
        <slot name="meta">{{ meta }}</slot>
      </div>
    </div>
    <div v-if="$slots.visual" class="title-layout__visual"><slot name="visual" /></div>
  </div>
</template>

<style scoped>
.title-layout {
  display: grid;
  width: 100%;
  height: 100%;
  min-height: 0;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  align-items: center;
  gap: 80px;
}

.title-layout--solo {
  grid-template-columns: minmax(0, 1fr);
}

.title-layout__copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;
}

.title-layout__eyebrow {
  color: var(--accent-on-dark);
  font-size: 19px;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.title-layout__title {
  margin-top: 34px;
  color: var(--on-dark);
  font-size: 84px;
  font-weight: 760;
  letter-spacing: -0.045em;
  line-height: 1.15;
}

.title-layout__title > span {
  display: block;
}

.title-layout__accent {
  color: var(--accent-on-dark);
}

.title-layout__subtitle {
  max-width: 820px;
  margin-top: 30px;
  color: var(--on-dark-muted);
  font-size: 29px;
  line-height: 1.6;
}

.title-layout__tags {
  margin-top: 32px;
}

.title-layout__meta {
  margin-top: 48px;
  color: var(--on-dark-muted);
  font-size: 20px;
}

.title-layout__visual {
  min-width: 0;
}

:global(html[lang='ja']) .title-layout__title,
:global(html[lang='en']) .title-layout__title {
  font-size: 68px;
  line-height: 1.12;
}

:global(html[lang='en']) .title-layout__eyebrow {
  letter-spacing: 0.08em;
}
</style>
