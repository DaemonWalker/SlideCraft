<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  tone?: 'default' | 'accent' | 'warning' | 'success'
}>(), {
  title: '',
  tone: 'default',
})
</script>

<template>
  <section class="content-card" :class="`content-card--${tone}`">
    <h3 v-if="title" class="content-card__title">{{ title }}</h3>
    <div class="content-card__body"><slot /></div>
  </section>
</template>

<style scoped>
.content-card {
  min-width: 0;
  padding: 30px;
  border: 1px solid var(--line);
  border-radius: var(--radius-panel);
  background: var(--surface-muted);
}

.content-card--accent {
  border-color: oklch(0.75 0.08 235);
  background: var(--surface-accent);
}

.content-card--warning {
  border-color: oklch(0.8 0.08 70);
  background: var(--surface-warning);
}

.content-card--success {
  border-color: oklch(0.8 0.06 165);
  background: var(--surface-success);
}

.content-card__title {
  margin-bottom: 12px;
  color: var(--ink);
  font-size: 28px;
  line-height: 1.35;
}

.content-card__body {
  color: var(--ink-muted);
  font-size: 22px;
  line-height: 1.65;
}
</style>
