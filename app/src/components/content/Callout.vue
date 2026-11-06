<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  tone?: 'accent' | 'warning' | 'success'
}>(), {
  title: '',
  tone: 'accent',
})
</script>

<template>
  <aside class="callout" :class="`callout--${tone}`">
    <strong v-if="title">{{ title }}</strong>
    <div><slot /></div>
  </aside>
</template>

<style scoped>
.callout {
  padding: 24px 28px;
  border-left: 4px solid var(--accent);
  border-radius: 0 var(--radius-control) var(--radius-control) 0;
  color: var(--ink-muted);
  background: var(--surface-accent);
  font-size: 22px;
  line-height: 1.6;
}

.callout--warning {
  border-left-color: var(--warning);
  background: var(--surface-warning);
}

.callout--success {
  border-left-color: var(--success);
  background: var(--surface-success);
}

.callout strong {
  display: block;
  margin-bottom: 6px;
  color: var(--ink);
  font-size: 24px;
}
</style>
