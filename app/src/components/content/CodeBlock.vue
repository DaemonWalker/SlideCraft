<script setup lang="ts">
import { computed } from 'vue'
import { highlightLine } from './codeHighlight'
import type { CodeToken } from './codeHighlight'

export interface CodeHighlightRange {
  line: number
  start: number
  end: number
}

const props = withDefaults(defineProps<{
  code: string
  language?: string
  caption?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  highlightRanges?: CodeHighlightRange[]
  errorLines?: number[]
  startLine?: number
  wrap?: boolean
  syntax?: boolean
}>(), {
  language: '',
  caption: '',
  showLineNumbers: false,
  highlightLines: () => [],
  highlightRanges: () => [],
  errorLines: () => [],
  startLine: 1,
  wrap: true,
  syntax: true,
})

const tokenizeLine = (line: string, number: number) => {
  const tokens: CodeToken[] = props.syntax ? highlightLine(line, props.language) : [{ text: line }]
  const ranges = props.highlightRanges.filter((range) => (
    range.line === number && range.start >= 0 && range.end > range.start
  ))
  if (!ranges.length) return tokens.map((token) => ({ ...token, rangeHighlighted: false }))

  let lineOffset = 0
  return tokens.flatMap((token) => {
    const tokenStart = lineOffset
    const tokenEnd = tokenStart + token.text.length
    lineOffset = tokenEnd
    const boundaries = new Set([0, token.text.length])
    for (const range of ranges) {
      if (range.start > tokenStart && range.start < tokenEnd) boundaries.add(range.start - tokenStart)
      if (range.end > tokenStart && range.end < tokenEnd) boundaries.add(range.end - tokenStart)
    }
    const points = [...boundaries].sort((a, b) => a - b)
    return points.slice(0, -1).map((start, index) => {
      const end = points[index + 1]
      return {
        text: token.text.slice(start, end),
        tone: token.tone,
        rangeHighlighted: ranges.some((range) => (
          range.start < tokenStart + end && range.end > tokenStart + start
        )),
      }
    })
  })
}

const lines = computed(() => props.code.replace(/\r\n/g, '\n').split('\n').map((line, index) => {
  const number = props.startLine + index
  return {
    number,
    tokens: tokenizeLine(line, number),
    highlighted: props.highlightLines.includes(number),
    error: props.errorLines.includes(number),
  }
}))
</script>

<template>
  <figure class="code-block">
    <figcaption v-if="language || caption" class="code-block__caption">
      <span>{{ caption }}</span><strong>{{ language }}</strong>
    </figcaption>
    <pre class="code-block__pre" :class="{ 'code-block__pre--nowrap': !wrap }"><code><span
      v-for="line in lines"
      :key="line.number"
      class="code-block__line"
      :class="{ 'code-block__line--highlighted': line.highlighted, 'code-block__line--error': line.error }"
    ><span v-if="showLineNumbers" class="code-block__line-number" aria-hidden="true">{{ line.number }}</span><span class="code-block__line-content"><span
      v-for="(token, tokenIndex) in line.tokens"
      :key="tokenIndex"
      :class="[token.tone ? `code-token--${token.tone}` : undefined, { 'code-block__range-highlight': token.rangeHighlighted }]"
    >{{ token.text }}</span></span></span></code></pre>
  </figure>
</template>

<style scoped>
.code-block {
  min-width: 0;
  overflow: hidden;
  border-radius: var(--radius-panel);
  color: oklch(0.9 0.025 235);
  background: var(--surface-dark);
}

.code-block__caption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 14px 24px;
  border-bottom: 1px solid var(--line-dark);
  color: var(--on-dark-muted);
  font-size: 16px;
}

.code-block__caption strong {
  color: var(--accent-on-dark);
  font-family: var(--font-code);
  font-size: 13px;
}

.code-block__pre {
  overflow: auto;
  padding: 20px 0;
  font-size: 19px;
  line-height: 1.7;
  tab-size: 2;
}

.code-block__line {
  display: flex;
  min-height: 1.7em;
  padding: 0 24px;
  border-left: 4px solid transparent;
}

.code-block__line--highlighted {
  border-left-color: var(--accent-on-dark);
  background: oklch(0.72 0.13 225 / 0.12);
}

.code-block__line--error {
  border-left-color: var(--danger);
  background: oklch(0.52 0.16 18 / 0.18);
}

.code-block__line-number {
  flex: none;
  width: 48px;
  padding-right: 18px;
  color: var(--on-dark-muted);
  text-align: right;
  user-select: none;
}

.code-block__line-content {
  min-width: 0;
  flex: 1;
  white-space: pre-wrap;
  word-break: break-word;
}

.code-block__pre--nowrap .code-block__line {
  width: max-content;
  min-width: 100%;
}

.code-block__pre--nowrap .code-block__line-content {
  white-space: pre;
  word-break: normal;
}

.code-block__range-highlight {
  background: var(--surface-highlight);
  box-shadow: 0 0 0 3px var(--surface-highlight);
}

.code-token--keyword { color: var(--code-keyword); }
.code-token--string { color: var(--code-string); }
.code-token--comment { color: var(--code-comment); font-style: italic; }
.code-token--number { color: var(--code-number); }
.code-token--property { color: var(--code-property); }
.code-token--tag { color: var(--code-tag); }
</style>
