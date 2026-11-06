<script setup lang="ts">
withDefaults(defineProps<{ gap?: number }>(), { gap: 20 })
</script>

<template>
  <div class="stack-layout" :style="{ gap: `${gap}px` }"><slot /></div>
</template>

<style scoped>
.stack-layout {
  display: flex;
  min-width: 0;
  flex-direction: column;
}
</style>
