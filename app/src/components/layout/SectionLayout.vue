<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  number: string | number
  title: string
  description?: string
}>()

const formattedNumber = computed(() => typeof props.number === 'number'
  ? String(props.number).padStart(2, '0')
  : props.number)
</script>

<template>
  <div class="section-layout">
    <div class="section-layout__number">{{ formattedNumber }}</div>
    <div class="section-layout__copy">
      <h1>{{ title }}</h1>
      <p v-if="description">{{ description }}</p>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.section-layout {
  display: grid;
  width: 100%;
  height: 100%;
  min-height: 0;
  grid-template-columns: minmax(0, 0.65fr) minmax(0, 1.35fr);
  align-items: center;
  gap: 76px;
}

.section-layout__number {
  color: var(--accent-on-dark);
  font-family: var(--font-code);
  font-size: 190px;
  font-weight: 700;
  letter-spacing: -0.08em;
  line-height: 1;
}

.section-layout__copy {
  min-width: 0;
  padding-left: 76px;
  border-left: 1px solid var(--line-dark);
}

.section-layout h1 {
  max-width: 1040px;
  color: var(--on-dark);
  font-size: 68px;
  font-weight: 740;
  letter-spacing: -0.035em;
  line-height: 1.2;
}

.section-layout p {
  max-width: 940px;
  margin-top: 28px;
  color: var(--on-dark-muted);
  font-size: 29px;
  line-height: 1.6;
}

:global(html[lang='ja']) .section-layout h1,
:global(html[lang='en']) .section-layout h1 {
  font-size: 58px;
}
</style>
