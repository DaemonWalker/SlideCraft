<script setup lang="ts">
import { computed } from 'vue'
import { highlightLine } from './codeHighlight'

export type DiffLineType = 'added' | 'removed' | 'context'

export interface DiffLine {
  type?: DiffLineType
  content: string
}

const props = withDefaults(defineProps<{
  lines: DiffLine[]
  language?: string
  caption?: string
  oldLabel?: string
  newLabel?: string
  showLineNumbers?: boolean
  wrap?: boolean
  syntax?: boolean
}>(), {
  language: '',
  caption: '',
  oldLabel: 'Before',
  newLabel: 'After',
  showLineNumbers: true,
  wrap: true,
  syntax: true,
})

const renderedLines = computed(() => {
  let oldNumber = 0
  let newNumber = 0
  return props.lines.map((line) => {
    const type = line.type ?? 'context'
    if (type !== 'added') oldNumber += 1
    if (type !== 'removed') newNumber += 1
    return {
      ...line,
      type,
      oldNumber: type === 'added' ? '' : oldNumber,
      newNumber: type === 'removed' ? '' : newNumber,
      marker: type === 'added' ? '+' : type === 'removed' ? '−' : ' ',
      tokens: props.syntax ? highlightLine(line.content, props.language) : [{ text: line.content }],
    }
  })
})
</script>

<template>
  <figure class="code-diff">
    <figcaption v-if="caption || oldLabel || newLabel" class="code-diff__caption">
      <span>{{ caption }}</span>
      <span class="code-diff__versions"><span>{{ oldLabel }}</span><strong>{{ newLabel }}</strong></span>
    </figcaption>
    <pre class="code-diff__pre" :class="{ 'code-diff__pre--nowrap': !wrap }"><code><span
      v-for="(line, index) in renderedLines"
      :key="index"
      class="code-diff__line"
      :class="[`code-diff__line--${line.type}`, { 'code-diff__line--numbered': showLineNumbers }]"
    ><template v-if="showLineNumbers"><span class="code-diff__number" aria-hidden="true">{{ line.oldNumber }}</span><span class="code-diff__number" aria-hidden="true">{{ line.newNumber }}</span></template><span class="code-diff__marker" aria-hidden="true">{{ line.marker }}</span><span class="code-diff__content"><span
      v-for="(token, tokenIndex) in line.tokens"
      :key="tokenIndex"
      :class="token.tone ? `code-token--${token.tone}` : undefined"
    >{{ token.text }}</span></span></span></code></pre>
  </figure>
</template>

<style scoped>
.code-diff {
  min-width: 0;
  overflow: hidden;
  border-radius: var(--radius-panel);
  color: oklch(0.9 0.025 235);
  background: var(--surface-dark);
}

.code-diff__caption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 14px 24px;
  border-bottom: 1px solid var(--line-dark);
  color: var(--on-dark-muted);
  font-size: 16px;
}

.code-diff__versions {
  display: flex;
  gap: 18px;
  font-family: var(--font-code);
  font-size: 13px;
}

.code-diff__versions strong {
  color: var(--accent-on-dark);
}

.code-diff__pre {
  overflow: auto;
  padding: 18px 0;
  font-size: 18px;
  line-height: 1.65;
  tab-size: 2;
}

.code-diff__line {
  display: grid;
  min-height: 1.65em;
  grid-template-columns: 24px minmax(0, 1fr);
  padding: 0 22px;
}

.code-diff__line--numbered {
  grid-template-columns: 42px 42px 24px minmax(0, 1fr);
}

.code-diff__line--added {
  color: oklch(0.9 0.05 165);
  background: oklch(0.49 0.11 164 / 0.17);
}

.code-diff__line--removed {
  color: oklch(0.9 0.04 18);
  background: oklch(0.52 0.16 18 / 0.17);
}

.code-diff__number {
  padding-right: 12px;
  color: var(--on-dark-muted);
  text-align: right;
  user-select: none;
}

.code-diff__marker {
  text-align: center;
  user-select: none;
}

.code-diff__line--added .code-diff__marker { color: var(--success); }
.code-diff__line--removed .code-diff__marker { color: oklch(0.75 0.13 18); }

.code-diff__content {
  min-width: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.code-diff__pre--nowrap .code-diff__line {
  width: max-content;
  min-width: 100%;
}

.code-diff__pre--nowrap .code-diff__content {
  white-space: pre;
  word-break: normal;
}

.code-token--keyword { color: var(--code-keyword); }
.code-token--string { color: var(--code-string); }
.code-token--comment { color: var(--code-comment); font-style: italic; }
.code-token--number { color: var(--code-number); }
.code-token--property { color: var(--code-property); }
.code-token--tag { color: var(--code-tag); }
</style>
