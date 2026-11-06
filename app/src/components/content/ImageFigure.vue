<script setup lang="ts">
import { nextTick, onUnmounted, ref } from 'vue'
import { Maximize2, X } from '@lucide/vue'
import { useI18n } from '../../i18n'

withDefaults(defineProps<{
  src: string
  alt: string
  caption?: string
  fit?: 'contain' | 'cover'
  zoomable?: boolean
}>(), {
  caption: '',
  fit: 'contain',
  zoomable: true,
})

const { t } = useI18n()
const trigger = ref<HTMLButtonElement>()
const dialog = ref<HTMLDialogElement>()
const isOpen = ref(false)

const openPreview = async () => {
  isOpen.value = true
  await nextTick()
  dialog.value?.showModal()
}

const closePreview = () => {
  dialog.value?.close()
}

const onDialogClose = () => {
  isOpen.value = false
  trigger.value?.focus()
}

const onBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) closePreview()
}

onUnmounted(() => {
  if (dialog.value?.open) dialog.value.close()
})
</script>

<template>
  <figure class="image-figure">
    <button
      v-if="zoomable"
      ref="trigger"
      class="image-figure__canvas image-figure__canvas--button"
      type="button"
      :aria-label="t('app.openImage')"
      :title="t('app.openImage')"
      aria-haspopup="dialog"
      @click="openPreview"
    >
      <img :src="src" :alt="alt" :style="{ objectFit: fit }" />
      <span class="image-figure__zoom-icon" aria-hidden="true"><Maximize2 :size="18" /></span>
    </button>
    <div v-else class="image-figure__canvas">
      <img :src="src" :alt="alt" :style="{ objectFit: fit }" />
    </div>
    <figcaption v-if="caption" class="image-figure__caption">{{ caption }}</figcaption>

    <Teleport to="body">
      <dialog
        v-if="isOpen"
        ref="dialog"
        class="image-lightbox"
        :aria-label="alt || t('app.imagePreview')"
        @close="onDialogClose"
        @click="onBackdropClick"
      >
        <div class="image-lightbox__panel" role="document">
          <button
            class="image-lightbox__close"
            type="button"
            :aria-label="t('app.closeImage')"
            :title="t('app.closeImage')"
            @click="closePreview"
          >
            <X :size="24" />
          </button>
          <div class="image-lightbox__canvas">
            <img class="image-lightbox__image" :src="src" :alt="alt" />
          </div>
          <p v-if="caption" class="image-lightbox__caption">{{ caption }}</p>
        </div>
      </dialog>
    </Teleport>
  </figure>
</template>

<style scoped>
.image-figure {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--radius-panel);
  background: var(--surface-muted);
}

.image-figure__canvas {
  position: relative;
  display: flex;
  width: 100%;
  min-height: 0;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.image-figure__canvas--button {
  border-radius: 0;
  cursor: zoom-in;
}

.image-figure__canvas--button:active:not(:disabled) {
  transform: none;
}

.image-figure__canvas--button:focus-visible {
  outline-offset: -4px;
}

.image-figure__canvas img {
  width: 100%;
  max-height: 600px;
}

.image-figure__zoom-icon {
  position: absolute;
  top: 12px;
  right: 12px;
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 1px solid var(--line-dark);
  border-radius: 50%;
  color: var(--on-dark);
  background: var(--surface-dark);
  box-shadow: 0 4px 14px oklch(0.25 0.055 240 / 0.18);
  opacity: 0.76;
  transition: opacity 160ms ease-out, transform 160ms ease-out;
}

.image-figure__canvas--button:hover .image-figure__zoom-icon,
.image-figure__canvas--button:focus-visible .image-figure__zoom-icon {
  opacity: 1;
  transform: scale(1.06);
}

.image-figure__caption {
  padding: 14px 20px;
  border-top: 1px solid var(--line);
  color: var(--ink-muted);
  font-size: 17px;
}

.image-lightbox {
  inset: 0;
  width: 100vw;
  max-width: none;
  height: 100dvh;
  max-height: none;
  margin: 0;
  padding: 56px 24px 24px;
  overflow: hidden;
  border: 0;
  background: transparent;
}

.image-lightbox[open] {
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-lightbox::backdrop {
  background: oklch(0.16 0.04 240 / 0.9);
  backdrop-filter: blur(8px);
}

.image-lightbox__panel {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.image-lightbox__canvas {
  display: flex;
  width: 100%;
  min-height: 0;
  flex: 1;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid var(--line-dark);
  border-radius: var(--radius-panel);
  background: var(--surface-slide);
  box-shadow: 0 24px 72px oklch(0.1 0.03 240 / 0.38);
}

.image-lightbox__image {
  display: block;
  width: 100%;
  max-width: none;
  height: 100%;
  max-height: none;
  object-fit: contain;
}

.image-lightbox__caption {
  max-width: 75ch;
  color: var(--on-dark);
  font-size: 16px;
  line-height: 1.6;
  text-align: center;
}

.image-lightbox__close {
  position: fixed;
  z-index: 1;
  top: 18px;
  right: 18px;
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 50%;
  color: var(--ink);
  background: var(--surface-slide);
  box-shadow: 0 6px 20px oklch(0.1 0.03 240 / 0.24);
}

.image-lightbox__close:hover {
  color: var(--accent);
  background: var(--surface-accent);
}

@media (max-width: 650px) {
  .image-lightbox {
    padding: 56px 12px 16px;
  }

  .image-lightbox__close {
    top: 12px;
    right: 12px;
  }
}
</style>
