<script setup lang="ts">
export interface TimelineItem {
  title: string
  description: string
  meta?: string
}

withDefaults(defineProps<{ items: TimelineItem[] }>(), { items: () => [] })
</script>

<template>
  <ol class="timeline">
    <li v-for="item in items" :key="item.title">
      <span v-if="item.meta" class="timeline__meta">{{ item.meta }}</span>
      <strong>{{ item.title }}</strong>
      <p>{{ item.description }}</p>
    </li>
  </ol>
</template>

<style scoped>
.timeline {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  list-style: none;
}

.timeline li {
  position: relative;
  padding: 32px 34px 0 0;
  border-top: 2px solid var(--line-dark);
}

.timeline li::before {
  position: absolute;
  top: -8px;
  left: 0;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent-on-dark);
  content: '';
}

.timeline__meta {
  display: block;
  margin-bottom: 12px;
  color: var(--accent-on-dark);
  font-family: var(--font-code);
  font-size: 16px;
}

.timeline strong {
  display: block;
  color: inherit;
  font-size: 27px;
}

.timeline p {
  max-width: 320px;
  margin-top: 12px;
  color: var(--on-dark-muted);
  font-size: 19px;
  line-height: 1.6;
}
</style>
