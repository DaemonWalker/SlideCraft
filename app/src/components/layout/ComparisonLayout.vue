<script setup lang="ts">
import Metric from '../content/Metric.vue'

export interface ComparisonMetric {
  value: string
  label: string
  description?: string
}

withDefaults(defineProps<{
  metrics?: ComparisonMetric[]
  beforeLabel?: string
  afterLabel?: string
}>(), {
  metrics: () => [],
  beforeLabel: '',
  afterLabel: '',
})
</script>

<template>
  <div class="comparison-layout">
    <div
      v-if="metrics.length"
      class="comparison-layout__metrics"
      :style="{ gridTemplateColumns: `repeat(${metrics.length}, minmax(0, 1fr))` }"
    >
      <Metric
        v-for="(metric, index) in metrics"
        :key="`${metric.label}-${index}`"
        :value="metric.value"
        :label="metric.label"
        :description="metric.description"
      />
    </div>
    <div class="comparison-layout__panels">
      <section class="comparison-layout__panel">
        <h3 v-if="beforeLabel">{{ beforeLabel }}</h3>
        <div class="comparison-layout__body"><slot name="before" /></div>
      </section>
      <section class="comparison-layout__panel comparison-layout__panel--after">
        <h3 v-if="afterLabel">{{ afterLabel }}</h3>
        <div class="comparison-layout__body"><slot name="after" /></div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.comparison-layout {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 0;
  flex-direction: column;
  gap: 38px;
}

.comparison-layout__metrics {
  display: grid;
  min-width: 0;
  gap: 36px;
}

.comparison-layout__metrics > :deep(.metric) {
  min-width: 0;
  padding: 4px 28px;
  border-left: 1px solid var(--line);
}

.comparison-layout__metrics > :deep(.metric:first-child) {
  padding-left: 0;
  border-left: 0;
}

.comparison-layout__panels {
  display: grid;
  min-height: 0;
  flex: 1;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
}

.comparison-layout__panel {
  min-width: 0;
  padding: 30px 34px;
  border: 1px solid var(--line);
  border-radius: var(--radius-panel);
  background: var(--surface-muted);
}

.comparison-layout__panel--after {
  border-color: oklch(0.75 0.08 235);
  background: var(--surface-accent);
}

.comparison-layout__panel h3 {
  margin-bottom: 22px;
  color: var(--accent);
  font-family: var(--font-code);
  font-size: 19px;
  letter-spacing: 0.08em;
}

.comparison-layout__body {
  min-width: 0;
  color: var(--ink-muted);
  font-size: 22px;
  line-height: 1.6;
}
</style>
