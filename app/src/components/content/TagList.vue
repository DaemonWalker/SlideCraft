<script setup lang="ts">
withDefaults(defineProps<{ items: string[] }>(), { items: () => [] })
</script>

<template>
  <ul class="tag-list" aria-label="标签">
    <li v-for="item in items" :key="item">{{ item }}</li>
  </ul>
</template>

<style scoped>
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  list-style: none;
}

.tag-list li {
  padding: 7px 16px;
  border: 1px solid currentColor;
  border-radius: 999px;
  color: inherit;
  font-family: var(--font-code);
  font-size: 17px;
  line-height: 1.4;
  opacity: 0.82;
}
</style>
