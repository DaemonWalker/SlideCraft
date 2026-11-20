<script setup lang="ts">
import { computed } from 'vue'
import CodeBlock from './CodeBlock.vue'
import { createJsonPathHighlightRanges } from './jsonPathHighlight'

const props = withDefaults(defineProps<{
  code: string
  language?: 'json' | 'xml'
  highlightLines?: number[]
  highlightPaths?: string[]
  caption?: string
  showLineNumbers?: boolean
}>(), {
  language: 'json',
  highlightLines: () => [],
  highlightPaths: () => [],
  caption: '',
  showLineNumbers: true,
})

const highlightRanges = computed(() => props.language === 'json'
  ? createJsonPathHighlightRanges(props.code, props.highlightPaths)
  : [])
</script>

<template>
  <CodeBlock
    class="data-highlight"
    :code="code"
    :language="language"
    :caption="caption"
    :show-line-numbers="showLineNumbers"
    :highlight-lines="highlightLines"
    :highlight-ranges="highlightRanges"
  />
</template>

<style scoped>
.data-highlight {
  display: flex;
  min-height: 0;
  max-height: 100%;
  flex-direction: column;
}

.data-highlight :deep(.code-block__pre) {
  min-height: 0;
  flex: 1;
}
</style>
