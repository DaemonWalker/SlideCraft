<script setup lang="ts">
withDefaults(defineProps<{
  columns?: 2 | 3 | 4
  gap?: number
}>(), {
  columns: 3,
  gap: 24,
})
</script>

<template>
  <div class="grid-layout" :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: `${gap}px` }">
    <slot />
  </div>
</template>

<style scoped>
.grid-layout {
  display: grid;
  min-width: 0;
}
</style>
