<script setup lang="ts">
withDefaults(defineProps<{
  ratio?: string
  gap?: number
  align?: 'start' | 'center' | 'stretch'
  scrollable?: boolean
}>(), {
  ratio: '1fr 1fr',
  gap: 48,
  align: 'center',
  scrollable: false,
})
</script>

<template>
  <div
    class="two-column"
    :class="{ 'two-column--scrollable': scrollable }"
    :style="{ gridTemplateColumns: ratio, gap: `${gap}px`, alignItems: scrollable ? 'stretch' : align }"
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

.two-column--scrollable {
  height: 100%;
  min-height: 0;
  grid-template-rows: minmax(0, 1fr);
}

.two-column__cell {
  min-width: 0;
}

.two-column--scrollable .two-column__cell {
  min-height: 0;
  overflow: auto;
}
</style>
