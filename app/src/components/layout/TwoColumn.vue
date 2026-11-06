<script setup lang="ts">
withDefaults(defineProps<{
  ratio?: string
  gap?: number
  align?: 'start' | 'center' | 'stretch'
}>(), {
  ratio: '1fr 1fr',
  gap: 48,
  align: 'center',
})
</script>

<template>
  <div
    class="two-column"
    :style="{ gridTemplateColumns: ratio, gap: `${gap}px`, alignItems: align }"
  >
    <div class="two-column__cell"><slot name="left" /></div>
    <div class="two-column__cell"><slot name="right" /></div>
  </div>
</template>

<style scoped>
.two-column {
  display: grid;
  min-width: 0;
}

.two-column__cell {
  min-width: 0;
}
</style>
