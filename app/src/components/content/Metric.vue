<script setup lang="ts">
defineProps<{
  value: string
  label: string
  description?: string
}>()
</script>

<template>
  <div class="metric">
    <span class="metric__label">{{ label }}</span>
    <strong class="metric__value">{{ value }}</strong>
    <p v-if="description">{{ description }}</p>
  </div>
</template>

<style scoped>
.metric {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.metric__label {
  color: var(--accent);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.metric__value {
  margin-top: 8px;
  color: var(--ink);
  font-family: var(--font-code);
  font-size: 64px;
  letter-spacing: -0.05em;
  line-height: 1.2;
}

.metric p {
  margin-top: 14px;
  color: var(--ink-muted);
  font-size: 21px;
}
</style>
