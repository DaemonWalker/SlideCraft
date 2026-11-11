<script setup lang="ts">
import { computed, ref } from 'vue'
import { Download, File } from '@lucide/vue'
import { useI18n } from '../../i18n'

const props = withDefaults(defineProps<{
  src: string
  fileName: string
  description?: string
}>(), {
  description: '',
})

const { locale, t } = useI18n()
const downloadFailed = ref(false)

const fileType = computed(() => {
  const extension = props.fileName.split('.').pop()
  return extension && extension !== props.fileName && extension.length <= 8
    ? extension.toUpperCase()
    : 'FILE'
})

const fileSize = computed(() => {
  const separator = props.src.indexOf(',')
  if (separator < 0 || !props.src.slice(0, separator).startsWith('data:')) return 0
  const base64Length = props.src.length - separator - 1
  const padding = Number(props.src.endsWith('=')) + Number(props.src.endsWith('=='))
  return Math.max(0, base64Length / 4 * 3 - padding)
})

const fileSizeLabel = computed(() => {
  const bytes = fileSize.value
  const maximumFractionDigits = bytes < 1024 ? 0 : 1
  const format = (value: number) => new Intl.NumberFormat(locale.value, { maximumFractionDigits }).format(value)
  if (bytes < 1024) return `${format(bytes)} B`
  if (bytes < 1024 * 1024) return `${format(bytes / 1024)} KiB`
  return `${format(bytes / (1024 * 1024))} MiB`
})

const download = (event: MouseEvent) => {
  if (!props.src.startsWith('data:')) return
  event.preventDefault()
  downloadFailed.value = false

  try {
    const separator = props.src.indexOf(',')
    const metadata = props.src.slice(0, separator)
    if (separator < 0 || !metadata.endsWith(';base64')) throw new Error('Invalid attachment data URL')

    const binary = atob(props.src.slice(separator + 1))
    const bytes = new Uint8Array(binary.length)
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)

    const mimeType = metadata.slice(5, -7) || 'application/octet-stream'
    const url = URL.createObjectURL(new Blob([bytes], { type: mimeType }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = props.fileName
    anchor.style.display = 'none'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  } catch {
    downloadFailed.value = true
  }
}
</script>

<template>
  <section class="attachment-download">
    <div class="attachment-download__icon" aria-hidden="true"><File :size="30" /></div>
    <div class="attachment-download__content">
      <h3 class="attachment-download__name">{{ fileName }}</h3>
      <p v-if="description" class="attachment-download__description">{{ description }}</p>
      <p class="attachment-download__meta">{{ fileType }} · {{ fileSizeLabel }}</p>
    </div>
    <a
      class="attachment-download__action"
      :href="src"
      :download="fileName"
      :aria-label="t('app.downloadAttachment', { fileName })"
      @click="download"
    >
      <Download :size="20" aria-hidden="true" />
      {{ t('app.download') }}
    </a>
    <p v-if="downloadFailed" class="attachment-download__error" role="alert">
      {{ t('app.attachmentDownloadFailed') }}
    </p>
  </section>
</template>

<style scoped>
.attachment-download {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: var(--radius-panel);
  background: var(--surface-muted);
}

.attachment-download__icon {
  display: grid;
  width: 58px;
  height: 58px;
  flex: none;
  place-items: center;
  border-radius: 12px;
  color: var(--accent);
  background: var(--surface-accent);
}

.attachment-download__content {
  min-width: 0;
  flex: 1;
}

.attachment-download__name {
  overflow-wrap: anywhere;
  color: var(--ink);
  font-size: 23px;
  line-height: 1.35;
}

.attachment-download__description {
  margin-top: 5px;
  color: var(--ink-muted);
  font-size: 17px;
  line-height: 1.5;
}

.attachment-download__meta {
  margin-top: 8px;
  color: var(--ink-muted);
  font-family: var(--font-code);
  font-size: 13px;
}

.attachment-download__action {
  display: inline-flex;
  min-height: 46px;
  flex: none;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 10px 18px;
  border-radius: var(--radius-control);
  color: var(--on-dark);
  background: var(--accent);
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 160ms ease-out, transform 160ms ease-out;
}

.attachment-download__action:hover {
  background: oklch(0.52 0.16 241);
}

.attachment-download__action:active {
  transform: scale(0.97);
}

.attachment-download__error {
  flex-basis: 100%;
  color: var(--danger);
  font-size: 15px;
}

@media (prefers-reduced-motion: reduce) {
  .attachment-download__action {
    transition: none;
  }
}
</style>
