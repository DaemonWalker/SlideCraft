<script setup lang="ts">
withDefaults(defineProps<{
  code: string
  language?: string
  caption?: string
}>(), {
  language: '',
  caption: '',
})
</script>

<template>
  <figure class="code-block">
    <figcaption v-if="language || caption" class="code-block__caption">
      <span>{{ caption }}</span><strong>{{ language }}</strong>
    </figcaption>
    <pre><code>{{ code }}</code></pre>
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

pre {
  overflow: auto;
  padding: 26px;
  font-size: 19px;
  line-height: 1.7;
  tab-size: 2;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
