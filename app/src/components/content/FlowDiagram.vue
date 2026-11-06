<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'

export interface FlowItem {
  title: string
  description?: string
}

withDefaults(defineProps<{ items: FlowItem[] }>(), { items: () => [] })
</script>

<template>
  <div class="flow-diagram">
    <template v-for="(item, index) in items" :key="item.title">
      <div class="flow-diagram__node">
        <strong>{{ item.title }}</strong>
        <span v-if="item.description">{{ item.description }}</span>
      </div>
      <ArrowRight v-if="index < items.length - 1" class="flow-diagram__arrow" :size="34" aria-hidden="true" />
    </template>
  </div>
</template>

<style scoped>
.flow-diagram {
  display: flex;
  align-items: stretch;
  gap: 16px;
}

.flow-diagram__node {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 28px 20px;
  border: 1px solid var(--line);
  border-radius: var(--radius-panel);
  background: var(--surface-muted);
  text-align: center;
}

.flow-diagram__node strong {
  color: var(--ink);
  font-size: 27px;
}

.flow-diagram__node span {
  color: var(--ink-muted);
  font-size: 19px;
  line-height: 1.5;
}

.flow-diagram__arrow {
  align-self: center;
  color: var(--accent);
}
</style>
