<script setup lang="ts">
export interface TerminalEntry {
  command: string
  output?: string
  cwd?: string
  status?: 'success' | 'error'
  exitCode?: number
}

withDefaults(defineProps<{
  entries: TerminalEntry[]
  title?: string
  prompt?: string
  showExitCode?: boolean
}>(), {
  title: 'Terminal',
  prompt: '$',
  showExitCode: false,
})
</script>

<template>
  <section class="terminal-block" :aria-label="title">
    <header class="terminal-block__header">
      <span class="terminal-block__controls" aria-hidden="true"><i></i><i></i><i></i></span>
      <strong>{{ title }}</strong>
    </header>
    <ol class="terminal-block__entries">
      <li v-for="(entry, index) in entries" :key="index" :class="entry.status === 'error' ? 'terminal-block__entry--error' : undefined">
        <div class="terminal-block__command">
          <span v-if="entry.cwd" class="terminal-block__cwd">{{ entry.cwd }}</span>
          <span class="terminal-block__prompt" aria-hidden="true">{{ prompt }}</span>
          <code>{{ entry.command }}</code>
        </div>
        <pre v-if="entry.output" class="terminal-block__output">{{ entry.output }}</pre>
        <span v-if="showExitCode" class="terminal-block__exit">exit {{ entry.exitCode ?? (entry.status === 'error' ? 1 : 0) }}</span>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.terminal-block {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--line-dark);
  border-radius: var(--radius-panel);
  color: var(--on-dark);
  background: oklch(0.21 0.035 240);
  font-family: var(--font-code);
}

.terminal-block__header {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 13px 20px;
  border-bottom: 1px solid var(--line-dark);
  color: var(--on-dark-muted);
  background: var(--surface-dark);
  font-family: var(--font-sans);
  font-size: 15px;
}

.terminal-block__controls {
  display: flex;
  gap: 7px;
}

.terminal-block__controls i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--line-dark);
}

.terminal-block__controls i:first-child { background: var(--danger); }
.terminal-block__controls i:nth-child(2) { background: var(--warning); }
.terminal-block__controls i:last-child { background: var(--success); }

.terminal-block__entries {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 22px 24px;
  list-style: none;
}

.terminal-block__command {
  display: flex;
  min-width: 0;
  align-items: baseline;
  gap: 10px;
  font-size: 18px;
  line-height: 1.6;
}

.terminal-block__command code {
  min-width: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.terminal-block__prompt {
  flex: none;
  color: var(--success);
  font-weight: 700;
}

.terminal-block__cwd {
  flex: none;
  color: var(--accent-on-dark);
}

.terminal-block__output {
  margin: 8px 0 0 22px;
  color: var(--on-dark-muted);
  font-size: 16px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.terminal-block__exit {
  display: block;
  margin: 7px 0 0 22px;
  color: var(--success);
  font-size: 13px;
}

.terminal-block__entry--error .terminal-block__prompt,
.terminal-block__entry--error .terminal-block__exit {
  color: oklch(0.75 0.13 18);
}

.terminal-block__entry--error .terminal-block__output {
  color: oklch(0.79 0.08 18);
}
</style>
