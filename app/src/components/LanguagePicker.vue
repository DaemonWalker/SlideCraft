<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useId, watch } from 'vue'
import { Check, ChevronDown, Languages } from '@lucide/vue'
import { useI18n } from '../i18n'
import type { Locale } from '../i18n'

const { locale, locales, t, setLocale } = useI18n()
const labels: Record<Locale, string> = {
  'zh-CN': '中文',
  ja: '日本語',
  en: 'English',
}

const root = ref<HTMLElement>()
const trigger = ref<HTMLButtonElement>()
const isOpen = ref(false)
const activeIndex = ref(Math.max(0, locales.indexOf(locale.value)))
const uid = useId()
const listboxId = `language-listbox-${uid}`
const activeOptionId = computed(() => isOpen.value ? `${listboxId}-${activeIndex.value}` : undefined)

watch(locale, (value) => {
  if (!isOpen.value) activeIndex.value = Math.max(0, locales.indexOf(value))
})

const openMenu = () => {
  activeIndex.value = Math.max(0, locales.indexOf(locale.value))
  isOpen.value = true
}

const closeMenu = () => {
  isOpen.value = false
}

const chooseLocale = async (value: Locale) => {
  setLocale(value)
  closeMenu()
  await nextTick()
  trigger.value?.focus()
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Tab') {
    closeMenu()
    return
  }

  if (event.key === 'Escape' && isOpen.value) {
    event.preventDefault()
    event.stopPropagation()
    closeMenu()
    return
  }

  if (!isOpen.value && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
    event.preventDefault()
    event.stopPropagation()
    openMenu()
    return
  }

  if (!isOpen.value) return

  switch (event.key) {
    case 'ArrowDown':
      activeIndex.value = (activeIndex.value + 1) % locales.length
      break
    case 'ArrowUp':
      activeIndex.value = (activeIndex.value - 1 + locales.length) % locales.length
      break
    case 'Home':
      activeIndex.value = 0
      break
    case 'End':
      activeIndex.value = locales.length - 1
      break
    case 'Enter':
    case ' ':
      void chooseLocale(locales[activeIndex.value])
      break
    default:
      return
  }

  event.preventDefault()
  event.stopPropagation()
}

const onDocumentPointerdown = (event: PointerEvent) => {
  if (isOpen.value && !root.value?.contains(event.target as Node)) closeMenu()
}

const onDocumentFocusin = (event: FocusEvent) => {
  if (isOpen.value && !root.value?.contains(event.target as Node)) closeMenu()
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerdown)
  document.addEventListener('focusin', onDocumentFocusin)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onDocumentPointerdown)
  document.removeEventListener('focusin', onDocumentFocusin)
})
</script>

<template>
  <div ref="root" class="language-picker">
    <button
      ref="trigger"
      class="language-picker__trigger"
      type="button"
      role="combobox"
      :aria-label="t('app.language')"
      :title="t('app.language')"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      :aria-controls="listboxId"
      :aria-activedescendant="activeOptionId"
      @click="isOpen ? closeMenu() : openMenu()"
      @keydown="onKeydown"
    >
      <Languages :size="19" aria-hidden="true" />
      <span class="language-picker__label">{{ labels[locale] }}</span>
      <ChevronDown
        class="language-picker__chevron"
        :class="{ 'language-picker__chevron--open': isOpen }"
        :size="15"
        aria-hidden="true"
      />
    </button>

    <Transition name="language-menu">
      <ul
        v-if="isOpen"
        :id="listboxId"
        class="language-picker__menu"
        role="listbox"
        :aria-label="t('app.language')"
      >
        <li
          v-for="(item, index) in locales"
          :id="`${listboxId}-${index}`"
          :key="item"
          class="language-picker__option"
          :class="{
            'language-picker__option--active': index === activeIndex,
            'language-picker__option--selected': item === locale,
          }"
          role="option"
          :aria-selected="item === locale"
          @mousedown.prevent
          @click="chooseLocale(item)"
          @mouseenter="activeIndex = index"
        >
          <span>{{ labels[item] }}</span>
          <Check v-if="item === locale" :size="16" aria-hidden="true" />
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.language-picker {
  position: relative;
  flex: none;
}

.language-picker__trigger {
  display: flex;
  min-width: 126px;
  min-height: 44px;
  align-items: center;
  gap: 7px;
  padding: 5px 10px;
  border: 1px solid var(--line);
  border-radius: var(--radius-control);
  color: var(--ink-muted);
  background: var(--surface-slide);
}

.language-picker__trigger > svg:first-child {
  color: var(--accent);
}

.language-picker__trigger:hover,
.language-picker__trigger[aria-expanded='true'] {
  border-color: var(--line-strong);
  color: var(--ink);
  background: var(--surface-muted);
}

.language-picker__trigger:active {
  background: var(--surface-accent);
}

.language-picker__trigger:focus-visible {
  border-color: var(--accent);
}

.language-picker__label {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  white-space: nowrap;
}

.language-picker__chevron {
  color: var(--ink-muted);
  transition: color 160ms ease-out, transform 160ms ease-out;
}

.language-picker__chevron--open {
  color: var(--accent);
  transform: rotate(180deg);
}

.language-picker__menu {
  position: absolute;
  z-index: 50;
  top: calc(100% + 8px);
  left: 0;
  width: max-content;
  min-width: 100%;
  max-width: calc(100vw - 24px);
  padding: 6px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--surface-slide);
  box-shadow: 0 12px 32px oklch(0.25 0.055 240 / 0.18);
  list-style: none;
}

.language-picker__option {
  display: flex;
  min-width: 132px;
  min-height: 44px;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 8px 12px;
  border-radius: 7px;
  color: var(--ink-muted);
  font-size: 13px;
  white-space: nowrap;
  cursor: pointer;
  transition: color 140ms ease-out, background-color 140ms ease-out;
}

.language-picker__option--active {
  color: var(--ink);
  background: var(--surface-accent);
}

.language-picker__option--selected {
  color: var(--accent);
  font-weight: 700;
}

.language-menu-enter-active,
.language-menu-leave-active {
  transition: opacity 140ms ease-out, transform 140ms ease-out;
  transform-origin: top left;
}

.language-menu-enter-from,
.language-menu-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

.language-menu-leave-active {
  transition-duration: 100ms;
}

@media (max-width: 650px) {
  .language-picker__trigger {
    min-width: 112px;
    padding: 5px 8px;
  }

  .language-picker__option {
    min-width: 124px;
  }
}
</style>
