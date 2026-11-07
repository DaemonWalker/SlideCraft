<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'

export interface ProcessStep {
  title: string
  description?: string
}

withDefaults(defineProps<{
  items?: ProcessStep[]
  activeStep?: number
}>(), {
  items: () => [],
  activeStep: 0,
})
</script>

<template>
  <div class="process-layout">
    <ol
      v-if="items.length"
      class="process-layout__steps"
      :style="{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }"
    >
      <li
        v-for="(item, index) in items"
        :key="`${item.title}-${index}`"
        class="process-layout__step"
        :class="{ 'process-layout__step--active': activeStep === index + 1 }"
        :aria-current="activeStep === index + 1 ? 'step' : undefined"
      >
        <span class="process-layout__number">{{ String(index + 1).padStart(2, '0') }}</span>
        <strong>{{ item.title }}</strong>
        <p v-if="item.description">{{ item.description }}</p>
        <ArrowRight
          v-if="index < items.length - 1"
          class="process-layout__arrow"
          :size="32"
          aria-hidden="true"
        />
      </li>
    </ol>
    <div v-if="$slots.default" class="process-layout__conclusion"><slot /></div>
  </div>
</template>

<style scoped>
.process-layout {
  width: 100%;
  min-width: 0;
}

.process-layout__steps {
  display: grid;
  gap: 54px;
  list-style: none;
}

.process-layout__step {
  position: relative;
  display: flex;
  min-width: 0;
  min-height: 230px;
  flex-direction: column;
  align-items: flex-start;
  padding: 30px;
  border: 1px solid var(--line);
  border-radius: var(--radius-panel);
  background: var(--surface-muted);
}

.process-layout__step--active {
  border-color: var(--accent);
  background: var(--surface-accent);
  box-shadow: inset 0 4px 0 var(--accent);
}

.process-layout__number {
  color: var(--accent);
  font-family: var(--font-code);
  font-size: 19px;
  font-weight: 700;
}

.process-layout__step strong {
  margin-top: 22px;
  color: var(--ink);
  font-size: 28px;
  line-height: 1.35;
}

.process-layout__step p {
  margin-top: 14px;
  color: var(--ink-muted);
  font-size: 20px;
  line-height: 1.55;
}

.process-layout__arrow {
  position: absolute;
  top: 50%;
  right: -44px;
  color: var(--accent);
  transform: translateY(-50%);
}

.process-layout__conclusion {
  margin-top: 42px;
  padding: 24px 30px;
  border: 1px solid var(--line);
  border-radius: var(--radius-panel);
  color: var(--ink-muted);
  background: var(--surface-muted);
  font-size: 22px;
}
</style>
