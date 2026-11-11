import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { Plugin } from 'vite'

export interface AttachmentLimitsOptions {
  maxFileSize?: number
  maxTotalSize?: number
  warningThreshold?: number
}

const mib = 1024 * 1024
const mimeTypes: Record<string, string> = {
  '.7z': 'application/x-7z-compressed',
  '.csv': 'text/csv;charset=utf-8',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.gif': 'image/gif',
  '.gz': 'application/gzip',
  '.html': 'text/html;charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript;charset=utf-8',
  '.json': 'application/json;charset=utf-8',
  '.md': 'text/markdown;charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.svg': 'image/svg+xml;charset=utf-8',
  '.ts': 'text/typescript;charset=utf-8',
  '.txt': 'text/plain;charset=utf-8',
  '.vue': 'text/plain;charset=utf-8',
  '.webp': 'image/webp',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.xml': 'application/xml;charset=utf-8',
  '.yaml': 'application/yaml;charset=utf-8',
  '.yml': 'application/yaml;charset=utf-8',
  '.zip': 'application/zip',
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < mib) return `${(bytes / 1024).toFixed(1)} KiB`
  return `${(bytes / mib).toFixed(1)} MiB`
}

const isAttachment = (id: string) => {
  const query = id.split('?')[1]
  return query ? new URLSearchParams(query).has('attachment') : false
}

export function attachmentLimits(options: AttachmentLimitsOptions = {}): Plugin {
  const maxFileSize = options.maxFileSize ?? 10 * mib
  const maxTotalSize = options.maxTotalSize ?? 30 * mib
  const warningThreshold = options.warningThreshold ?? 0.8
  const files = new Map<string, number>()
  const warnings = new Set<string>()
  let root = process.cwd()

  return {
    name: 'slidecraft:attachment-limits',
    enforce: 'pre',
    configResolved(config) {
      root = config.root
    },
    buildStart() {
      files.clear()
      warnings.clear()
    },
    async load(id) {
      if (!isAttachment(id)) return null

      const filePath = id.split('?')[0]
      const displayPath = path.relative(root, filePath).replace(/\\/g, '/')
      const content = await readFile(filePath)
      const size = content.byteLength

      if (size > maxFileSize) {
        this.error([
          `单个附件超过 ${formatSize(maxFileSize)} 上限。`,
          `文件：${displayPath}`,
          `实际大小：${formatSize(size)}`,
          `超出：${formatSize(size - maxFileSize)}`,
          '请压缩或精简附件，或在 attachmentLimits() 中显式调整 maxFileSize。',
        ].join('\n'))
      }

      files.set(filePath, size)
      const totalSize = [...files.values()].reduce((total, value) => total + value, 0)
      if (totalSize > maxTotalSize) {
        const largestFiles = [...files.entries()]
          .sort(([, left], [, right]) => right - left)
          .slice(0, 5)
          .map(([file, bytes]) => `  ${path.relative(root, file).replace(/\\/g, '/')}: ${formatSize(bytes)}`)
          .join('\n')
        this.error([
          `课件附件总量超过 ${formatSize(maxTotalSize)} 上限。`,
          `实际总量：${formatSize(totalSize)}`,
          `超出：${formatSize(totalSize - maxTotalSize)}`,
          '主要附件：',
          largestFiles,
          '请压缩或移除附件，或在 attachmentLimits() 中显式调整 maxTotalSize。',
        ].join('\n'))
      }

      if (size >= maxFileSize * warningThreshold && !warnings.has(`file:${filePath}`)) {
        warnings.add(`file:${filePath}`)
        this.warn(`附件 ${displayPath} 已达到单文件上限的 ${warningThreshold * 100}%（${formatSize(size)} / ${formatSize(maxFileSize)}）。`)
      }
      if (totalSize >= maxTotalSize * warningThreshold && !warnings.has('total')) {
        warnings.add('total')
        this.warn(`课件附件总量已达到上限的 ${warningThreshold * 100}%（${formatSize(totalSize)} / ${formatSize(maxTotalSize)}）。`)
      }

      const mimeType = mimeTypes[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream'
      const dataUrl = `data:${mimeType};base64,${content.toString('base64')}`
      return `export default ${JSON.stringify(dataUrl)}`
    },
  }
}
