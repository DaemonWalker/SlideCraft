<script setup lang="ts">
withDefaults(defineProps<{
  items?: string[]
  ordered?: boolean
}>(), {
  items: () => [],
  ordered: false,
})
</script>

<template>
  <component :is="ordered ? 'ol' : 'ul'" class="bullet-list" :class="{ 'bullet-list--ordered': ordered }">
    <li v-for="item in items" :key="item">{{ item }}</li>
    <slot />
  </component>
</template>

<style scoped>
.bullet-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  list-style: none;
  color: var(--ink-muted);
  font-size: 25px;
  line-height: 1.55;
}

.bullet-list li {
  position: relative;
  padding-left: 30px;
}

.bullet-list li::before {
  position: absolute;
  top: 0.68em;
  left: 2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  content: '';
}

.bullet-list--ordered {
  counter-reset: item;
}

.bullet-list--ordered li {
  padding-left: 52px;
  counter-increment: item;
}

.bullet-list--ordered li::before {
  top: 0.1em;
  left: 0;
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  color: var(--accent);
  background: var(--surface-accent);
  font-family: var(--font-code);
  font-size: 15px;
  font-weight: 700;
  content: counter(item);
}
</style>
