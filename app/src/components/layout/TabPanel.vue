<script setup lang="ts">
import { ref, useId, watch } from 'vue'

export interface TabPanelItem {
  id: string
  label: string
}

const props = withDefaults(defineProps<{
  items: TabPanelItem[]
  defaultActive?: string
  ariaLabel?: string
}>(), {
  defaultActive: '',
  ariaLabel: '',
})

const uid = useId()
const initialActive = props.items.some((item) => item.id === props.defaultActive)
  ? props.defaultActive
  : props.items[0]?.id ?? ''
const activeId = ref(initialActive)

watch(() => props.items.map((item) => item.id), () => {
  if (props.items.some((item) => item.id === activeId.value)) return
  activeId.value = props.items.some((item) => item.id === props.defaultActive)
    ? props.defaultActive
    : props.items[0]?.id ?? ''
})

const tabId = (id: string) => `tab-panel-${uid}-${id}-tab`
const panelId = (id: string) => `tab-panel-${uid}-${id}-panel`
</script>

<template>
  <div class="tab-panel">
    <div
      class="tab-panel__tabs"
      role="tablist"
      :aria-label="ariaLabel || undefined"
    >
      <button
        v-for="item in items"
        :id="tabId(item.id)"
        :key="item.id"
        class="tab-panel__tab"
        :class="{ 'tab-panel__tab--active': activeId === item.id }"
        type="button"
        role="tab"
        :aria-selected="activeId === item.id"
        :aria-controls="panelId(item.id)"
        @click="activeId = item.id"
      >
        {{ item.label }}
      </button>
    </div>

    <div class="tab-panel__content">
      <div
        v-for="item in items"
        v-show="activeId === item.id"
        :id="panelId(item.id)"
        :key="item.id"
        class="tab-panel__panel"
        role="tabpanel"
        :aria-labelledby="tabId(item.id)"
        :tabindex="activeId === item.id ? 0 : -1"
      >
        <slot :name="item.id" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-panel {
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  gap: 24px;
}

.tab-panel__tabs {
  display: flex;
  flex: none;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  border-bottom: 1px solid var(--line);
  gap: 12px;
}

.tab-panel__tab {
  flex: none;
  margin-bottom: -1px;
  padding: 14px 26px;
  border-bottom: 3px solid transparent;
  border-radius: var(--radius-control) var(--radius-control) 0 0;
  color: var(--ink-muted);
  font-size: 22px;
  font-weight: 600;
  line-height: 1.4;
  white-space: nowrap;
}

.tab-panel__tab:hover {
  color: var(--accent);
  background: var(--surface-accent);
}

.tab-panel__tab--active {
  border-bottom-color: var(--accent);
  color: var(--accent);
  background: var(--surface-accent);
}

.tab-panel__content {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex: 1;
}

.tab-panel__panel {
  width: 100%;
  min-width: 0;
  min-height: 0;
}

.tab-panel__panel:focus-visible {
  border-radius: var(--radius-control);
}
</style>
