<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { Check, ChevronLeft, ChevronRight, Copy, ExternalLink, GitBranch, Layers, Search, X } from '@lucide/vue'
import LanguagePicker from '../components/LanguagePicker.vue'
import SlideViewport from '../core/SlideViewport.vue'
import { useI18n } from '../i18n'
import ComponentExample from './ComponentExample.vue'
import { componentCatalog, componentCategories, findComponent } from './catalog'
import type { ComponentCategory } from './catalog'

const repositoryUrl = 'https://github.com/DaemonWalker/SlideCraft'
const { locale, t } = useI18n()
const query = ref('')
const copiedKind = ref('')
const failedKind = ref('')
let copyTimer: ReturnType<typeof setTimeout> | undefined

const idFromHash = () => {
  const match = window.location.hash.match(/^#\/components\/([a-z0-9-]+)$/)
  return match && findComponent(match[1]) ? match[1] : undefined
}

const selectedId = ref(idFromHash() ?? componentCatalog[0].id)
const selected = computed(() => findComponent(selectedId.value) ?? componentCatalog[0])
const selectedIndex = computed(() => componentCatalog.findIndex((item) => item.id === selected.value.id))
const previousComponent = computed(() => componentCatalog[(selectedIndex.value - 1 + componentCatalog.length) % componentCatalog.length])
const nextComponent = computed(() => componentCatalog[(selectedIndex.value + 1) % componentCatalog.length])
const sourceUrl = computed(() => `${repositoryUrl}/blob/main/app/src/components/${selected.value.source}`)
const normalizedQuery = computed(() => query.value.trim().toLocaleLowerCase())
const filteredComponents = computed(() => componentCatalog.filter((item) => {
  if (!normalizedQuery.value) return true
  const description = t(`showcase.components.${item.id}`)
  return `${item.name} ${description}`.toLocaleLowerCase().includes(normalizedQuery.value)
}))

const componentsInCategory = (category: ComponentCategory) => {
  return filteredComponents.value.filter((item) => item.category === category)
}

const updateTitle = () => {
  document.title = `${selected.value.name} · SlideCraft ${t('showcase.title')}`
}

const syncFromHash = () => {
  selectedId.value = idFromHash() ?? componentCatalog[0].id
}

const selectComponent = (id: string) => {
  if (id === selectedId.value) return
  selectedId.value = id
  window.history.pushState(null, '', `#/components/${id}`)
}

const copyCurrentLink = () => copyText(window.location.href, 'link')

const copyText = async (text: string, kind: 'code' | 'link') => {
  if (copyTimer) clearTimeout(copyTimer)
  failedKind.value = ''
  try {
    await navigator.clipboard.writeText(text)
    copiedKind.value = kind
  } catch {
    copiedKind.value = ''
    failedKind.value = kind
  }
  copyTimer = setTimeout(() => {
    copiedKind.value = ''
    failedKind.value = ''
  }, 2000)
}

watch([locale, selectedId], updateTitle, { immediate: true })

onMounted(() => {
  document.body.classList.add('showcase-page')
  if (!idFromHash()) window.history.replaceState(null, '', `#/components/${selectedId.value}`)
  window.addEventListener('hashchange', syncFromHash)
})

onUnmounted(() => {
  document.body.classList.remove('showcase-page')
  window.removeEventListener('hashchange', syncFromHash)
  if (copyTimer) clearTimeout(copyTimer)
})
</script>

<template>
  <div class="showcase-shell">
    <header class="showcase-header">
      <a class="showcase-brand" :href="`#/components/${componentCatalog[0].id}`" aria-label="SlideCraft">
        <span class="showcase-brand__mark" aria-hidden="true"><Layers :size="23" /></span>
        <span>
          <strong>SlideCraft</strong>
          <small>{{ t('showcase.title') }}</small>
        </span>
      </a>
      <p class="showcase-header__subtitle">{{ t('showcase.subtitle') }}</p>
      <div class="showcase-header__actions">
        <LanguagePicker />
        <a class="showcase-repository" :href="repositoryUrl" target="_blank" rel="noreferrer">
          <GitBranch :size="18" aria-hidden="true" />
          <span>{{ t('showcase.repository') }}</span>
          <ExternalLink :size="14" aria-hidden="true" />
        </a>
      </div>
    </header>

    <div class="showcase-layout">
      <aside class="showcase-sidebar">
        <div class="showcase-search">
          <label class="sr-only" for="component-search">{{ t('showcase.search') }}</label>
          <Search :size="18" aria-hidden="true" />
          <input
            id="component-search"
            v-model="query"
            type="search"
            :placeholder="t('showcase.searchPlaceholder')"
            autocomplete="off"
          />
          <button v-if="query" type="button" :aria-label="t('showcase.clearSearch')" :title="t('showcase.clearSearch')" @click="query = ''">
            <X :size="16" aria-hidden="true" />
          </button>
        </div>
        <div class="showcase-sidebar__count">
          {{ t('showcase.componentCount', { count: filteredComponents.length }) }}
        </div>
        <nav class="showcase-nav" :aria-label="t('showcase.navigation')">
          <section v-for="category in componentCategories" :key="category" class="showcase-nav__group">
            <template v-if="componentsInCategory(category).length">
              <h2>{{ t(`showcase.categories.${category}`) }}</h2>
              <button
                v-for="item in componentsInCategory(category)"
                :key="item.id"
                class="showcase-nav__item"
                :class="{ 'showcase-nav__item--active': item.id === selected.id }"
                type="button"
                :aria-current="item.id === selected.id ? 'page' : undefined"
                @click="selectComponent(item.id)"
              >
                <span>{{ item.name }}</span>
                <ChevronRight :size="15" aria-hidden="true" />
              </button>
            </template>
          </section>
          <p v-if="!filteredComponents.length" class="showcase-nav__empty">{{ t('showcase.noResults') }}</p>
        </nav>
      </aside>

      <main class="showcase-main">
        <section class="showcase-intro" aria-labelledby="component-title">
          <div>
            <span class="showcase-intro__category">{{ t(`showcase.categories.${selected.category}`) }}</span>
            <h1 id="component-title">{{ selected.name }}</h1>
            <p>{{ t(`showcase.components.${selected.id}`) }}</p>
          </div>
          <button class="showcase-link-button" type="button" :aria-label="t('showcase.copyLink')" @click="copyCurrentLink">
            <Check v-if="copiedKind === 'link'" :size="16" aria-hidden="true" />
            <Copy v-else :size="16" aria-hidden="true" />
            <span>{{ copiedKind === 'link' ? t('showcase.copied') : failedKind === 'link' ? t('showcase.copyFailed') : t('showcase.copyLink') }}</span>
          </button>
        </section>

        <section class="showcase-panel showcase-preview" aria-labelledby="preview-title">
          <header class="showcase-panel__header">
            <div>
              <h2 id="preview-title">{{ t('showcase.preview') }}</h2>
              <p>{{ t('showcase.previewHint') }}</p>
            </div>
          </header>
          <div class="showcase-preview__stage">
            <SlideViewport>
              <ComponentExample
                :key="selected.id"
                :component-id="selected.id"
                :name="selected.name"
                :dark="selected.dark"
              />
            </SlideViewport>
          </div>
        </section>

        <div class="showcase-details">
          <section class="showcase-panel showcase-usage" aria-labelledby="usage-title">
            <header class="showcase-panel__header showcase-panel__header--inline">
              <h2 id="usage-title">{{ t('showcase.usage') }}</h2>
              <button class="showcase-icon-button" type="button" :aria-label="t('showcase.copyCode')" :title="t('showcase.copyCode')" @click="copyText(selected.code, 'code')">
                <Check v-if="copiedKind === 'code'" :size="16" aria-hidden="true" />
                <Copy v-else :size="16" aria-hidden="true" />
                <span>{{ copiedKind === 'code' ? t('showcase.copied') : failedKind === 'code' ? t('showcase.copyFailed') : t('showcase.copyCode') }}</span>
              </button>
            </header>
            <pre class="showcase-code"><code>{{ selected.code }}</code></pre>
          </section>

          <section class="showcase-panel showcase-api" aria-labelledby="api-title">
            <header class="showcase-panel__header">
              <h2 id="api-title">API</h2>
            </header>
            <div class="showcase-api__section">
              <h3>{{ t('showcase.props') }}</h3>
              <ul v-if="selected.props.length" class="showcase-api__list">
                <li v-for="prop in selected.props" :key="prop"><code>{{ prop }}</code></li>
              </ul>
              <p v-else class="showcase-api__empty">{{ t('showcase.noProps') }}</p>
            </div>
            <div class="showcase-api__section">
              <h3>{{ t('showcase.slots') }}</h3>
              <ul v-if="selected.slots.length" class="showcase-slot-list">
                <li v-for="slot in selected.slots" :key="slot"><code>{{ slot }}</code></li>
              </ul>
              <p v-else class="showcase-api__empty">{{ t('showcase.noSlots') }}</p>
            </div>
            <a class="showcase-source-link" :href="sourceUrl" target="_blank" rel="noreferrer">
              <GitBranch :size="16" aria-hidden="true" />
              {{ t('showcase.viewSource') }}
              <ExternalLink :size="14" aria-hidden="true" />
            </a>
          </section>
        </div>

        <nav class="showcase-pagination" :aria-label="t('showcase.navigation')">
          <button type="button" @click="selectComponent(previousComponent.id)">
            <ChevronLeft :size="18" aria-hidden="true" />
            <span><small>{{ t('showcase.previous') }}</small><strong>{{ previousComponent.name }}</strong></span>
          </button>
          <button type="button" @click="selectComponent(nextComponent.id)">
            <span><small>{{ t('showcase.next') }}</small><strong>{{ nextComponent.name }}</strong></span>
            <ChevronRight :size="18" aria-hidden="true" />
          </button>
        </nav>
      </main>
    </div>
  </div>
</template>

<style scoped>
.showcase-shell {
  min-height: 100dvh;
  background:
    radial-gradient(circle at 85% 0%, oklch(0.72 0.13 225 / 0.09), transparent 30rem),
    var(--surface-app);
}

.showcase-header {
  position: sticky;
  z-index: 40;
  top: 0;
  display: flex;
  min-height: 74px;
  align-items: center;
  gap: 32px;
  padding: 12px clamp(20px, 3vw, 48px);
  border-bottom: 1px solid var(--line);
  background: oklch(0.99 0.004 235 / 0.92);
  backdrop-filter: blur(16px);
}

.showcase-brand {
  display: flex;
  flex: none;
  align-items: center;
  gap: 11px;
  color: var(--ink);
  text-decoration: none;
}

.showcase-brand__mark {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 12px;
  color: var(--on-dark);
  background: var(--surface-dark);
}

.showcase-brand > span:last-child {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.showcase-brand strong {
  font-size: 18px;
  letter-spacing: -0.02em;
}

.showcase-brand small {
  margin-top: 4px;
  color: var(--ink-muted);
  font-size: 11px;
}

.showcase-header__subtitle {
  flex: 1;
  color: var(--ink-muted);
  font-size: 13px;
}

.showcase-header__actions {
  display: flex;
  flex: none;
  align-items: center;
  gap: 10px;
}

.showcase-repository {
  display: flex;
  min-height: 44px;
  align-items: center;
  gap: 8px;
  padding: 8px 13px;
  border: 1px solid var(--line);
  border-radius: var(--radius-control);
  color: var(--ink-muted);
  background: var(--surface-slide);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}

.showcase-repository:hover {
  border-color: var(--line-strong);
  color: var(--accent);
}

.showcase-layout {
  display: grid;
  width: min(1680px, 100%);
  margin: 0 auto;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: clamp(24px, 3vw, 48px);
  padding: 30px clamp(20px, 3vw, 48px) 56px;
}

.showcase-sidebar {
  position: sticky;
  top: 104px;
  align-self: start;
  max-height: calc(100dvh - 128px);
  overflow: auto;
  scrollbar-width: thin;
}

.showcase-search {
  display: flex;
  min-height: 44px;
  align-items: center;
  gap: 9px;
  padding: 0 11px;
  border: 1px solid var(--line);
  border-radius: var(--radius-control);
  color: var(--ink-muted);
  background: var(--surface-slide);
}

.showcase-search:focus-within {
  border-color: var(--accent);
  outline: 3px solid oklch(0.59 0.16 241 / 0.16);
}

.showcase-search input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  color: var(--ink);
  background: transparent;
  font: inherit;
  font-size: 13px;
}

.showcase-search input::placeholder {
  color: var(--ink-muted);
  opacity: 0.8;
}

.showcase-search input::-webkit-search-cancel-button {
  display: none;
}

.showcase-search button {
  display: grid;
  flex: none;
  place-items: center;
}

.showcase-sidebar__count {
  margin: 16px 4px 22px;
  color: var(--ink-muted);
  font-family: var(--font-code);
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.showcase-nav {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.showcase-nav__group h2 {
  margin: 0 8px 8px;
  color: var(--ink-muted);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.showcase-nav__item {
  display: flex;
  width: 100%;
  min-width: 0;
  min-height: 38px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 7px;
  color: var(--ink-muted);
  font-family: var(--font-code);
  font-size: 12px;
  text-align: left;
}

.showcase-nav__item span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.showcase-nav__item svg {
  opacity: 0;
}

.showcase-nav__item:hover {
  color: var(--ink);
  background: var(--surface-muted);
}

.showcase-nav__item:hover svg,
.showcase-nav__item--active svg {
  opacity: 1;
}

.showcase-nav__item--active {
  color: var(--accent);
  background: var(--surface-accent);
  font-weight: 700;
}

.showcase-nav__empty {
  padding: 20px 8px;
  color: var(--ink-muted);
  font-size: 13px;
}

.showcase-main {
  min-width: 0;
}

.showcase-intro {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

.showcase-intro__category {
  color: var(--accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.showcase-intro h1 {
  margin-top: 4px;
  font-family: var(--font-code);
  font-size: clamp(28px, 3vw, 42px);
  letter-spacing: -0.045em;
  line-height: 1.2;
}

.showcase-intro p {
  max-width: 760px;
  margin-top: 10px;
  color: var(--ink-muted);
  font-size: 14px;
}

.showcase-link-button,
.showcase-icon-button {
  display: flex;
  flex: none;
  align-items: center;
  gap: 7px;
  border-radius: var(--radius-control);
  color: var(--ink-muted);
  font-size: 12px;
  font-weight: 600;
}

.showcase-link-button {
  min-height: 40px;
  padding: 8px 12px;
  border: 1px solid var(--line);
  background: var(--surface-slide);
}

.showcase-link-button:hover,
.showcase-icon-button:hover {
  color: var(--accent);
  background: var(--surface-accent);
}

.showcase-panel {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--radius-panel);
  background: var(--surface-slide);
  box-shadow: 0 8px 28px oklch(0.25 0.055 240 / 0.045);
}

.showcase-panel__header {
  padding: 18px 22px;
  border-bottom: 1px solid var(--line);
}

.showcase-panel__header h2 {
  font-size: 15px;
  line-height: 1.4;
}

.showcase-panel__header p {
  margin-top: 4px;
  color: var(--ink-muted);
  font-size: 12px;
}

.showcase-panel__header--inline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.showcase-preview__stage {
  height: min(62vh, 650px);
  min-height: 370px;
  padding: 20px;
  background: oklch(0.935 0.014 235 / 0.72);
}

.showcase-details {
  display: grid;
  margin-top: 24px;
  grid-template-columns: minmax(0, 1.55fr) minmax(280px, 0.75fr);
  gap: 24px;
  align-items: start;
}

.showcase-icon-button {
  min-height: 34px;
  padding: 6px 9px;
}

.showcase-code {
  max-height: 450px;
  overflow: auto;
  padding: 22px;
  color: oklch(0.9 0.025 235);
  background: var(--surface-dark);
  font-size: 12px;
  line-height: 1.75;
  tab-size: 2;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.showcase-api__section {
  padding: 18px 20px;
  border-bottom: 1px solid var(--line);
}

.showcase-api__section h3 {
  margin-bottom: 12px;
  color: var(--ink-muted);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.showcase-api__list {
  display: flex;
  flex-direction: column;
  gap: 9px;
  list-style: none;
}

.showcase-api__list code {
  display: block;
  color: var(--ink);
  font-size: 11px;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.showcase-slot-list {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  list-style: none;
}

.showcase-slot-list code {
  padding: 3px 8px;
  border: 1px solid var(--line);
  border-radius: 5px;
  color: var(--accent);
  background: var(--surface-accent);
  font-size: 11px;
}

.showcase-api__empty {
  color: var(--ink-muted);
  font-size: 12px;
}

.showcase-source-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 17px 20px;
  color: var(--accent);
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
}

.showcase-source-link svg:last-child {
  margin-left: auto;
}

.showcase-source-link:hover {
  background: var(--surface-accent);
}

.showcase-pagination {
  display: grid;
  margin-top: 24px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.showcase-pagination button {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border: 1px solid var(--line);
  border-radius: var(--radius-control);
  background: var(--surface-slide);
  text-align: left;
}

.showcase-pagination button:last-child {
  justify-content: flex-end;
  text-align: right;
}

.showcase-pagination button:hover {
  border-color: var(--line-strong);
  color: var(--accent);
}

.showcase-pagination span {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.showcase-pagination small {
  color: var(--ink-muted);
  font-size: 10px;
}

.showcase-pagination strong {
  overflow: hidden;
  font-family: var(--font-code);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

:global(body.showcase-page) {
  overflow: auto;
}

@media (max-width: 1100px) {
  .showcase-header__subtitle {
    display: none;
  }

  .showcase-header__actions {
    margin-left: auto;
  }

  .showcase-layout {
    grid-template-columns: 220px minmax(0, 1fr);
    gap: 24px;
  }

  .showcase-details {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 780px) {
  .showcase-header {
    gap: 12px;
    padding: 10px 16px;
  }

  .showcase-repository span,
  .showcase-repository svg:last-child {
    display: none;
  }

  .showcase-repository {
    padding: 8px 11px;
  }

  .showcase-layout {
    display: block;
    padding: 20px 16px 40px;
  }

  .showcase-sidebar {
    position: static;
    max-height: none;
    margin-bottom: 26px;
    overflow: visible;
  }

  .showcase-sidebar__count {
    margin-bottom: 12px;
  }

  .showcase-nav {
    display: grid;
    max-height: 250px;
    padding-right: 4px;
    overflow: auto;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .showcase-preview__stage {
    height: 56.25vw;
    min-height: 260px;
    padding: 10px;
  }
}

@media (max-width: 520px) {
  .showcase-brand small {
    display: none;
  }

  .showcase-brand__mark {
    width: 38px;
    height: 38px;
  }

  .showcase-intro {
    align-items: flex-start;
  }

  .showcase-intro p {
    font-size: 13px;
  }

  .showcase-link-button {
    width: 40px;
    height: 40px;
    justify-content: center;
    padding: 8px;
  }

  .showcase-link-button span {
    display: none;
  }

  .showcase-link-button svg {
    color: var(--ink-muted);
  }

  .showcase-preview__stage {
    min-height: 220px;
  }

  .showcase-panel__header,
  .showcase-code {
    padding: 16px;
  }

  .showcase-panel__header p {
    display: none;
  }

  .showcase-icon-button span {
    display: none;
  }

  .showcase-pagination {
    gap: 10px;
  }

  .showcase-pagination button {
    padding: 12px;
  }
}
</style>
