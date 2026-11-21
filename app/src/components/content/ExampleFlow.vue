<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { ArrowDown, ArrowRight } from '@lucide/vue'
import CodeBlock from './CodeBlock.vue'

const props = withDefaults(defineProps<{
  inputCode?: string
  inputLanguage?: string
  inputCaption?: string
  transformCode: string
  transformLanguage?: string
  transformCaption?: string
  outputCode: string
  outputLanguage?: string
  outputCaption?: string
  variant?: 'panels' | 'unified'
  direction?: 'horizontal' | 'vertical'
  showArrows?: boolean
  ariaLabel?: string
}>(), {
  inputLanguage: 'json',
  inputCaption: '',
  transformLanguage: '',
  transformCaption: '',
  outputLanguage: 'json',
  outputCaption: '',
  variant: 'panels',
  direction: 'horizontal',
  showArrows: true,
  ariaLabel: '',
})

const slots = useSlots()
const hasInput = computed(() => props.inputCode !== undefined || Boolean(slots.input))
</script>

<template>
  <section
    v-if="variant === 'unified'"
    class="example-flow example-flow--unified"
    :class="[`example-flow--${direction}`, { 'example-flow--with-input': hasInput, 'example-flow--with-arrows': showArrows }]"
    :aria-label="ariaLabel || undefined"
  >
    <div v-if="hasInput" class="example-flow__unified-stage">
      <div class="example-flow__unified-heading">
        <span>{{ inputCaption }}</span>
        <strong>{{ inputLanguage }}</strong>
        <template v-if="showArrows">
          <ArrowDown v-if="direction === 'vertical'" class="example-flow__unified-arrow" :size="20" aria-hidden="true" />
          <ArrowRight v-else class="example-flow__unified-arrow" :size="20" aria-hidden="true" />
        </template>
      </div>
      <div class="example-flow__stage example-flow__unified-body">
        <slot name="input">
          <CodeBlock :code="inputCode ?? ''" :language="inputLanguage" />
        </slot>
      </div>
    </div>
    <div class="example-flow__unified-stage">
      <div class="example-flow__unified-heading">
        <span>{{ transformCaption }}</span>
        <strong>{{ transformLanguage }}</strong>
        <template v-if="showArrows">
          <ArrowDown v-if="direction === 'vertical'" class="example-flow__unified-arrow" :size="20" aria-hidden="true" />
          <ArrowRight v-else class="example-flow__unified-arrow" :size="20" aria-hidden="true" />
        </template>
      </div>
      <div class="example-flow__stage example-flow__unified-body">
        <slot name="transform">
          <CodeBlock :code="transformCode" :language="transformLanguage" />
        </slot>
      </div>
    </div>
    <div class="example-flow__unified-stage">
      <div class="example-flow__unified-heading">
        <span>{{ outputCaption }}</span>
        <strong>{{ outputLanguage }}</strong>
      </div>
      <div class="example-flow__stage example-flow__unified-body">
        <slot name="output">
          <CodeBlock :code="outputCode" :language="outputLanguage" />
        </slot>
      </div>
    </div>
  </section>
  <section
    v-else
    class="example-flow example-flow--panels"
    :class="[`example-flow--${direction}`, { 'example-flow--with-input': hasInput }]"
    :aria-label="ariaLabel || undefined"
  >
    <div v-if="hasInput" class="example-flow__stage">
      <slot name="input">
        <CodeBlock :code="inputCode ?? ''" :language="inputLanguage" :caption="inputCaption" />
      </slot>
    </div>
    <template v-if="hasInput">
      <ArrowDown v-if="direction === 'vertical'" class="example-flow__arrow" :size="34" aria-hidden="true" />
      <ArrowRight v-else class="example-flow__arrow" :size="34" aria-hidden="true" />
    </template>
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

.example-flow--panels.example-flow--horizontal {
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
}

.example-flow--panels.example-flow--horizontal.example-flow--with-input {
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
}

.example-flow--panels.example-flow--vertical {
  grid-template-columns: minmax(0, 1fr);
}

.example-flow--unified {
  --example-flow-unified-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 0;
  border-radius: var(--radius-panel);
  background: var(--surface-dark);
}

.example-flow--unified.example-flow--with-input {
  --example-flow-unified-columns: minmax(0, 0.9fr) minmax(0, 1.2fr) minmax(0, 0.9fr);
}

.example-flow--unified.example-flow--horizontal {
  grid-template-columns: var(--example-flow-unified-columns);
  grid-template-rows: minmax(0, 1fr);
}

.example-flow--unified.example-flow--vertical {
  grid-template-columns: minmax(0, 1fr);
  grid-auto-rows: minmax(0, 1fr);
}

.example-flow__unified-stage {
  position: relative;
  display: flex;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
}

.example-flow--horizontal > .example-flow__unified-stage:not(:last-child) {
  border-right: 1px solid var(--line-dark);
}

.example-flow--vertical > .example-flow__unified-stage:not(:last-child) {
  border-bottom: 1px solid var(--line-dark);
}

.example-flow__unified-heading {
  position: relative;
  display: flex;
  min-width: 0;
  flex: none;
  align-items: center;
  gap: 20px;
  padding: 14px 24px;
  border-bottom: 1px solid var(--line-dark);
  color: var(--on-dark-muted);
  font-size: 16px;
}

.example-flow--with-arrows.example-flow--horizontal > .example-flow__unified-stage:not(:last-child) .example-flow__unified-heading {
  padding-right: 36px;
}

.example-flow__unified-heading span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.example-flow__unified-heading strong {
  margin-left: auto;
  flex: none;
  color: var(--accent-on-dark);
  font-family: var(--font-code);
  font-size: 13px;
}

.example-flow__unified-arrow {
  position: absolute;
  z-index: 1;
  top: 50%;
  right: 0;
  border-radius: 50%;
  background: var(--surface-dark);
  box-shadow: 0 0 0 5px var(--surface-dark);
  color: var(--accent-on-dark);
  pointer-events: none;
  transform: translate(50%, -50%);
}

.example-flow--vertical .example-flow__unified-heading {
  position: static;
}

.example-flow--vertical .example-flow__unified-arrow {
  top: auto;
  right: auto;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 50%);
}

.example-flow__stage.example-flow__unified-body {
  flex: 1;
  border-radius: 0;
}

.example-flow__unified-stage :deep(.code-block) {
  border-radius: 0;
}

.example-flow__unified-stage :deep(.code-block__caption) {
  display: none;
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
