<script setup lang="ts">
import { computed } from 'vue'

export interface ConfigEntry {
  key: string
  value: string
  description?: string
  sensitive?: boolean
}

const props = withDefaults(defineProps<{
  entries: ConfigEntry[]
  format?: 'yaml' | 'properties' | 'env'
  caption?: string
  maskSecrets?: boolean
  mask?: string
}>(), {
  format: 'yaml',
  caption: '',
  maskSecrets: true,
  mask: '••••••',
})

const separator = computed(() => props.format === 'yaml' ? ':' : '=')
</script>

<template>
  <section class="config-block">
    <header v-if="caption || format" class="config-block__header">
      <strong>{{ caption }}</strong><span>{{ format }}</span>
    </header>
    <ul class="config-block__entries">
      <li v-for="entry in entries" :key="entry.key">
        <div class="config-block__line">
          <span class="config-block__key">{{ entry.key }}</span>
          <span class="config-block__separator" aria-hidden="true">{{ separator }}</span>
          <code class="config-block__value" :class="{ 'config-block__value--masked': entry.sensitive && maskSecrets }">{{ entry.sensitive && maskSecrets ? mask : entry.value }}</code>
          <span v-if="entry.sensitive" class="config-block__secret">secret</span>
        </div>
        <p v-if="entry.description">{{ entry.description }}</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.config-block {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--line-dark);
  border-radius: var(--radius-panel);
  color: var(--on-dark);
  background: var(--surface-dark);
}

.config-block__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 14px 22px;
  border-bottom: 1px solid var(--line-dark);
  color: var(--on-dark-muted);
  font-size: 16px;
}

.config-block__header span {
  color: var(--accent-on-dark);
  font-family: var(--font-code);
  font-size: 13px;
}

.config-block__entries {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 22px;
  list-style: none;
}

.config-block__line {
  display: flex;
  min-width: 0;
  align-items: baseline;
  font-family: var(--font-code);
  font-size: 18px;
  line-height: 1.55;
}

.config-block__key {
  color: var(--code-property);
  overflow-wrap: anywhere;
}

.config-block__separator {
  margin: 0 8px;
  color: var(--on-dark-muted);
}

.config-block__value {
  min-width: 0;
  color: var(--code-string);
  overflow-wrap: anywhere;
}

.config-block__value--masked {
  color: var(--warning);
  letter-spacing: 0.12em;
}

.config-block__secret {
  flex: none;
  margin-left: 12px;
  padding: 2px 8px;
  border: 1px solid var(--warning);
  border-radius: 999px;
  color: var(--warning);
  font-family: var(--font-sans);
  font-size: 11px;
  line-height: 1.4;
  text-transform: uppercase;
}

.config-block__entries p {
  margin-top: 4px;
  color: var(--on-dark-muted);
  font-size: 15px;
  line-height: 1.5;
}
</style>
