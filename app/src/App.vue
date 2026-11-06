<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Grid2X2,
  Maximize2,
  Minimize2,
  NotebookText,
  Presentation,
  X,
} from '@lucide/vue'
import SlideViewport from './core/SlideViewport.vue'
import LanguagePicker from './components/LanguagePicker.vue'
import { useDeck } from './core/useDeck'
import { demoDeck } from './decks/demo'
import { useI18n } from './i18n'
import type { SlideDefinition } from './core/types'

type Overlay = 'overview' | 'notes' | 'help' | null

const { locale, t } = useI18n()
const slideTitle = (slide: SlideDefinition) => t(`deck.slides.${slide.id}.title`)
const slideSection = (slide: SlideDefinition) => t(`deck.slides.${slide.id}.section`)
const slideDuration = (slide: SlideDefinition) => t(`deck.slides.${slide.id}.duration`)
const slideNotes = (slide: SlideDefinition) => t(`deck.slides.${slide.id}.notes`)

const {
  currentIndex,
  currentSlide,
  progress,
  canGoPrevious,
  canGoNext,
  goTo,
  next,
  previous,
  updateLocation,
} = useDeck(demoDeck, {
  getDeckTitle: () => t('deck.title'),
  getSlideTitle: slideTitle,
})

const overlay = ref<Overlay>(null)
const dialog = ref<HTMLDialogElement>()
const isFullscreen = ref(false)
const toastMessage = ref('')
const touchStart = ref<{ x: number; y: number } | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | undefined

const overlayTitle = computed(() => ({
  overview: t('app.overviewTitle'),
  notes: t('app.notesTitle'),
  help: t('app.helpTitle'),
}[overlay.value ?? 'help']))

watch(locale, () => updateLocation())

const openOverlay = (value: Exclude<Overlay, null>) => {
  overlay.value = value
}
const closeOverlay = () => {
  overlay.value = null
}
const onDialogClose = () => {
  overlay.value = null
}
const onBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) closeOverlay()
}

watch(overlay, async (value) => {
  await nextTick()
  if (!dialog.value) return
  if (value && !dialog.value.open) dialog.value.showModal()
  if (!value && dialog.value.open) dialog.value.close()
})

const showToast = (message: string) => {
  clearTimeout(toastTimer)
  toastMessage.value = message
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 1800)
}

const syncFullscreen = () => {
  isFullscreen.value = Boolean(document.fullscreenElement)
}
const toggleFullscreen = async () => {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
    } else if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen()
    } else {
      showToast(t('app.fullscreenUnsupported'))
    }
  } catch {
    showToast(t('app.fullscreenFailed'))
  }
}

const onKeydown = (event: KeyboardEvent) => {
  const target = event.target
  const isTyping = target instanceof HTMLElement
    && (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable)
  if (isTyping) return

  if (!overlay.value && target instanceof HTMLElement && target.closest('dialog[open]')) return

  if (overlay.value) {
    if (event.key.toLowerCase() === 'n' && overlay.value === 'notes') closeOverlay()
    return
  }

  if (event.key === ' ' && target instanceof HTMLElement && target.closest('button')) return

  switch (event.key) {
    case 'ArrowRight':
    case 'PageDown':
    case ' ':
      event.preventDefault()
      next()
      break
    case 'ArrowLeft':
    case 'PageUp':
      event.preventDefault()
      previous()
      break
    case 'Home':
      event.preventDefault()
      goTo(0)
      break
    case 'End':
      event.preventDefault()
      goTo(demoDeck.slides.length - 1)
      break
    case 'F':
    case 'f':
      event.preventDefault()
      void toggleFullscreen()
      break
    case 'N':
    case 'n':
      event.preventDefault()
      openOverlay('notes')
      break
    case 'O':
    case 'o':
      event.preventDefault()
      openOverlay('overview')
      break
    case '?':
      event.preventDefault()
      openOverlay('help')
      break
  }
}

const onTouchStart = (event: TouchEvent) => {
  if (event.touches.length !== 1) return
  touchStart.value = { x: event.touches[0].clientX, y: event.touches[0].clientY }
}
const onTouchEnd = (event: TouchEvent) => {
  if (!touchStart.value || !event.changedTouches.length) return
  const deltaX = event.changedTouches[0].clientX - touchStart.value.x
  const deltaY = event.changedTouches[0].clientY - touchStart.value.y
  touchStart.value = null
  if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
    deltaX < 0 ? next() : previous()
  }
}

const jumpFromOverview = (index: number) => {
  goTo(index)
  closeOverlay()
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('fullscreenchange', syncFullscreen)
})
onUnmounted(() => {
  clearTimeout(toastTimer)
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('fullscreenchange', syncFullscreen)
})
</script>

<template>
  <div class="app-shell" :class="{ 'app-shell--fullscreen': isFullscreen }">
    <header class="toolbar" :aria-label="t('app.toolbarLabel')">
      <div class="brand">
        <span class="brand__mark" aria-hidden="true"><Presentation :size="25" /></span>
        <span class="brand__name">Slide<strong>Craft</strong></span>
        <span class="brand__divider" aria-hidden="true"></span>
        <span class="brand__subtitle">{{ t('app.subtitle') }}</span>
      </div>
      <nav class="toolbar__actions" :aria-label="t('app.toolsLabel')">
        <LanguagePicker />
        <button class="tool-button" type="button" :title="`${t('app.overview')}（O）`" @click="openOverlay('overview')">
          <Grid2X2 :size="19" /><span>{{ t('app.overview') }}</span>
        </button>
        <button class="tool-button" type="button" :title="`${t('app.notesTitle')}（N）`" @click="openOverlay('notes')">
          <NotebookText :size="19" /><span>{{ t('app.notes') }}</span>
        </button>
        <button class="tool-button" type="button" :title="`${t('app.fullscreen')}（F）`" @click="toggleFullscreen">
          <Maximize2 :size="19" /><span>{{ t('app.fullscreen') }}</span>
        </button>
        <button class="tool-button tool-button--icon" type="button" :aria-label="t('app.help')" :title="`${t('app.help')}（?）`" @click="openOverlay('help')">
          <CircleHelp :size="20" />
        </button>
      </nav>
    </header>

    <main
      class="deck-stage"
      :aria-label="t('app.stageLabel')"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <SlideViewport>
        <component :is="currentSlide.component" :key="currentSlide.id" />
      </SlideViewport>
    </main>

    <footer class="navigation" :aria-label="t('app.navigationLabel')">
      <div class="navigation__meta">
        <strong>{{ slideSection(currentSlide) }}</strong>
        <span class="navigation__divider" aria-hidden="true"></span>
        <span>{{ slideDuration(currentSlide) }}</span>
      </div>
      <div class="navigation__controls">
        <button class="nav-button" type="button" :aria-label="t('app.previous')" :title="`${t('app.previous')}（←）`" :disabled="!canGoPrevious" @click="previous">
          <ChevronLeft :size="23" />
        </button>
        <span class="slide-counter"><strong>{{ currentIndex + 1 }}</strong><span>/</span>{{ demoDeck.slides.length }}</span>
        <button class="nav-button nav-button--primary" type="button" :aria-label="t('app.next')" :title="`${t('app.next')}（→ / Space）`" :disabled="!canGoNext" @click="next">
          <ChevronRight :size="23" />
        </button>
      </div>
      <span class="navigation__hint"><kbd>←</kbd> <kbd>→</kbd> {{ t('app.keyboardHint') }}</span>
    </footer>

    <div class="progress-track" aria-hidden="true">
      <div class="progress-track__bar" :style="{ width: `${progress}%` }"></div>
    </div>

    <button v-if="isFullscreen" class="fullscreen-exit" type="button" :title="`${t('app.exitFullscreen')}（F / Esc）`" @click="toggleFullscreen">
      <Minimize2 :size="20" /><span>{{ t('app.exitFullscreen') }}</span>
    </button>

    <dialog ref="dialog" class="deck-dialog" :class="`deck-dialog--${overlay}`" @close="onDialogClose" @click="onBackdropClick">
      <section class="dialog-panel" role="document">
        <header class="dialog-header">
          <div>
            <span class="dialog-header__kicker">{{ t('deck.title') }}</span>
            <h2>{{ overlayTitle }}</h2>
          </div>
          <button class="dialog-close" type="button" :aria-label="t('app.close')" @click="closeOverlay"><X :size="23" /></button>
        </header>

        <div v-if="overlay === 'overview'" class="overview-grid">
          <button
            v-for="(slide, index) in demoDeck.slides"
            :key="slide.id"
            class="overview-item"
            :class="{ 'overview-item--active': index === currentIndex }"
            type="button"
            :aria-current="index === currentIndex ? 'page' : undefined"
            @click="jumpFromOverview(index)"
          >
            <span>{{ String(index + 1).padStart(2, '0') }} · {{ slideDuration(slide) }}</span>
            <strong>{{ slideTitle(slide) }}</strong>
          </button>
        </div>

        <div v-else-if="overlay === 'notes'" class="notes-content">
          <span class="notes-content__label">{{ t('app.page', { index: currentIndex + 1 }) }} · {{ slideTitle(currentSlide) }}</span>
          <p>{{ slideNotes(currentSlide) || t('app.noNotes') }}</p>
        </div>

        <dl v-else class="shortcut-list">
          <div><dt><kbd>→</kbd> <kbd>Space</kbd></dt><dd>{{ t('app.shortcuts.next') }}</dd></div>
          <div><dt><kbd>←</kbd></dt><dd>{{ t('app.shortcuts.previous') }}</dd></div>
          <div><dt><kbd>Home</kbd> <kbd>End</kbd></dt><dd>{{ t('app.shortcuts.homeEnd') }}</dd></div>
          <div><dt><kbd>N</kbd></dt><dd>{{ t('app.shortcuts.notes') }}</dd></div>
          <div><dt><kbd>O</kbd></dt><dd>{{ t('app.shortcuts.overview') }}</dd></div>
          <div><dt><kbd>F</kbd></dt><dd>{{ t('app.shortcuts.fullscreen') }}</dd></div>
          <div><dt><kbd>Esc</kbd></dt><dd>{{ t('app.shortcuts.escape') }}</dd></div>
        </dl>
      </section>
    </dialog>

    <div class="toast" :class="{ 'toast--visible': toastMessage }" role="status">{{ toastMessage }}</div>
  </div>
</template>

<style scoped>
.app-shell {
  display: grid;
  width: 100%;
  height: 100dvh;
  grid-template-rows: 64px minmax(0, 1fr) 70px 3px;
  overflow: hidden;
  background: var(--surface-app);
}

.toolbar {
  z-index: 10;
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 28px;
  border-bottom: 1px solid var(--line);
  background: var(--surface-slide);
}

.brand,
.toolbar__actions,
.tool-button,
.navigation__meta,
.navigation__controls {
  display: flex;
  align-items: center;
}

.brand {
  min-width: 0;
  gap: 12px;
}

.brand__mark {
  color: var(--accent);
}

.brand__name {
  font-size: 20px;
  letter-spacing: -0.02em;
}

.brand__name strong {
  color: var(--accent);
}

.brand__divider,
.navigation__divider {
  width: 1px;
  height: 18px;
  background: var(--line);
}

.brand__subtitle {
  overflow: hidden;
  color: var(--ink-muted);
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toolbar__actions {
  flex: none;
  gap: 6px;
}

.tool-button {
  min-width: 44px;
  min-height: 44px;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius-control);
  color: var(--ink-muted);
  font-size: 13px;
}

.tool-button:hover,
.dialog-close:hover {
  color: var(--ink);
  background: var(--surface-muted);
}

.tool-button--icon {
  padding: 8px;
}

.deck-stage {
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  padding: 24px 32px;
}

.navigation {
  z-index: 10;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 20px;
  padding: 0 28px;
  border-top: 1px solid var(--line);
  background: var(--surface-slide);
}

.navigation__meta {
  min-width: 0;
  gap: 12px;
  color: var(--ink-muted);
  font-size: 13px;
}

.navigation__meta strong {
  overflow: hidden;
  color: var(--ink);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.navigation__controls {
  gap: 16px;
}

.nav-button {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 50%;
  color: var(--ink-muted);
  background: var(--surface-slide);
}

.nav-button:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
}

.nav-button--primary {
  border-color: var(--accent);
  color: var(--on-dark);
  background: var(--accent);
}

.nav-button--primary:hover:not(:disabled) {
  color: var(--on-dark);
  background: oklch(0.52 0.16 241);
}

.slide-counter {
  display: flex;
  min-width: 72px;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
  color: var(--ink-muted);
  font-family: var(--font-code);
  font-size: 13px;
}

.slide-counter strong {
  color: var(--ink);
  font-size: 21px;
}

.navigation__hint {
  justify-self: end;
  color: var(--ink-muted);
  font-size: 12px;
}

kbd {
  display: inline-flex;
  min-width: 24px;
  min-height: 24px;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  border: 1px solid var(--line);
  border-bottom-width: 2px;
  border-radius: 5px;
  background: var(--surface-muted);
  font-size: 12px;
}

.progress-track {
  z-index: 11;
  background: var(--line);
}

.progress-track__bar {
  height: 100%;
  background: var(--accent);
  transition: width 180ms ease-out;
}

.app-shell--fullscreen {
  grid-template-rows: minmax(0, 1fr);
}

.app-shell--fullscreen .toolbar,
.app-shell--fullscreen .navigation,
.app-shell--fullscreen .progress-track {
  display: none;
}

.app-shell--fullscreen .deck-stage {
  padding: 0;
  background: var(--surface-dark);
}

.app-shell--fullscreen :deep(.slide-canvas) {
  border: 0;
  border-radius: 0;
  box-shadow: none;
}

.fullscreen-exit {
  position: fixed;
  z-index: 20;
  top: 18px;
  right: 18px;
  display: flex;
  min-height: 44px;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border: 1px solid var(--line-dark);
  border-radius: var(--radius-control);
  color: var(--on-dark);
  background: var(--surface-dark);
  opacity: 0.45;
}

.fullscreen-exit:hover,
.fullscreen-exit:focus-visible {
  opacity: 1;
}

.deck-dialog {
  width: min(1060px, calc(100vw - 48px));
  max-width: none;
  max-height: calc(100dvh - 48px);
  overflow: hidden;
  margin: auto;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 20px;
  color: var(--ink);
  background: var(--surface-slide);
  box-shadow: var(--shadow-slide);
}

.deck-dialog::backdrop {
  background: oklch(0.16 0.04 240 / 0.72);
}

.deck-dialog--notes {
  width: min(680px, calc(100vw - 48px));
}

.deck-dialog--help {
  width: min(580px, calc(100vw - 48px));
}

.dialog-panel {
  display: flex;
  max-height: calc(100dvh - 50px);
  flex-direction: column;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 24px 28px;
  border-bottom: 1px solid var(--line);
}

.dialog-header__kicker {
  color: var(--accent);
  font-size: 12px;
  font-weight: 700;
}

.dialog-header h2 {
  margin-top: 3px;
  font-size: 26px;
  line-height: 1.3;
}

.dialog-close {
  display: grid;
  width: 44px;
  height: 44px;
  flex: none;
  place-items: center;
  border-radius: 50%;
  color: var(--ink-muted);
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  overflow: auto;
  padding: 24px 28px 28px;
}

.overview-item {
  min-height: 124px;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: var(--radius-control);
  color: var(--ink-muted);
  background: var(--surface-muted);
  text-align: left;
}

.overview-item:hover,
.overview-item--active {
  border-color: var(--accent);
  background: var(--surface-accent);
}

.overview-item span {
  display: block;
  margin-bottom: 10px;
  color: var(--accent);
  font-family: var(--font-code);
  font-size: 12px;
}

.overview-item strong {
  color: var(--ink);
  font-size: 16px;
  line-height: 1.5;
}

.notes-content {
  overflow: auto;
  padding: 28px;
}

.notes-content__label {
  display: block;
  margin-bottom: 18px;
  color: var(--accent);
  font-size: 14px;
  font-weight: 700;
}

.notes-content p {
  max-width: 65ch;
  color: var(--ink-muted);
  font-size: 17px;
  line-height: 1.8;
  white-space: pre-line;
}

.shortcut-list {
  overflow: auto;
  padding: 12px 28px 24px;
}

.shortcut-list > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
}

.shortcut-list dd {
  color: var(--ink-muted);
  font-size: 14px;
}

.toast {
  position: fixed;
  z-index: 30;
  bottom: 88px;
  left: 50%;
  max-width: calc(100vw - 32px);
  padding: 10px 18px;
  border-radius: var(--radius-control);
  color: var(--on-dark);
  background: var(--surface-dark);
  box-shadow: var(--shadow-slide);
  font-size: 13px;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, 8px);
  transition: opacity 160ms ease-out, transform 160ms ease-out;
}

.toast--visible {
  opacity: 1;
  transform: translate(-50%, 0);
}

@media (max-width: 900px) {
  .brand__subtitle,
  .brand__divider,
  .navigation__hint {
    display: none;
  }

  .navigation {
    grid-template-columns: 1fr auto;
  }

  .navigation__controls {
    justify-self: end;
  }
}

@media (max-width: 650px) {
  .app-shell {
    grid-template-rows: 56px minmax(0, 1fr) 62px 3px;
  }

  .toolbar,
  .navigation {
    padding: 0 12px;
  }

  .brand {
    display: none;
  }

  .toolbar__actions {
    width: 100%;
    justify-content: space-between;
    gap: 2px;
  }

  .tool-button {
    padding: 8px;
  }

  .tool-button span,
  .navigation__meta {
    display: none;
  }

  .navigation {
    grid-template-columns: 1fr;
  }

  .navigation__controls {
    justify-self: center;
  }

  .deck-stage {
    padding: 8px;
  }

  .overview-grid {
    grid-template-columns: 1fr;
    padding: 16px;
  }

  .dialog-header {
    padding: 18px;
  }

  .fullscreen-exit span {
    display: none;
  }
}
</style>
