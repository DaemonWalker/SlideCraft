<script setup lang="ts">
import { ArrowDown, ArrowRight } from '@lucide/vue'
import CodeBlock from './CodeBlock.vue'

withDefaults(defineProps<{
  inputCode: string
  inputLanguage?: string
  inputCaption?: string
  transformCode: string
  transformLanguage?: string
  transformCaption?: string
  outputCode: string
  outputLanguage?: string
  outputCaption?: string
  direction?: 'horizontal' | 'vertical'
  ariaLabel?: string
}>(), {
  inputLanguage: 'json',
  inputCaption: '',
  transformLanguage: '',
  transformCaption: '',
  outputLanguage: 'json',
  outputCaption: '',
  direction: 'horizontal',
  ariaLabel: '',
})
</script>

<template>
  <section
    class="example-flow"
    :class="`example-flow--${direction}`"
    :aria-label="ariaLabel || undefined"
  >
    <div class="example-flow__stage">
      <slot name="input">
        <CodeBlock :code="inputCode" :language="inputLanguage" :caption="inputCaption" />
      </slot>
    </div>
    <ArrowDown v-if="direction === 'vertical'" class="example-flow__arrow" :size="34" aria-hidden="true" />
    <ArrowRight v-else class="example-flow__arrow" :size="34" aria-hidden="true" />
    <div class="example-flow__stage">
      <slot name="transform">
        <CodeBlock :code="transformCode" :language="transformLanguage" :caption="transformCaption" />
      </slot>
    </div>
    <ArrowDown v-if="direction === 'vertical'" class="example-flow__arrow" :size="34" aria-hidden="true" />
    <ArrowRight v-else class="example-flow__arrow" :size="34" aria-hidden="true" />
    <div class="example-flow__stage">
      <slot name="output">
        <CodeBlock :code="outputCode" :language="outputLanguage" :caption="outputCaption" />
      </slot>
    </div>
  </section>
</template>

<style scoped>
.example-flow {
  display: grid;
  min-width: 0;
  min-height: 0;
  max-width: 100%;
  max-height: 100%;
  align-items: stretch;
  gap: 20px;
  overflow: hidden;
}

.example-flow--horizontal {
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
}

.example-flow--vertical {
  grid-template-columns: minmax(0, 1fr);
}

.example-flow__stage {
  display: flex;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  border-radius: var(--radius-panel);
}

.example-flow__stage :deep(.code-block) {
  display: flex;
  width: 100%;
  min-height: 0;
  max-height: 100%;
  flex-direction: column;
}

.example-flow__stage :deep(.code-block__pre) {
  min-height: 0;
  flex: 1;
}

.example-flow__arrow {
  align-self: center;
  justify-self: center;
  color: var(--accent);
}
</style>
