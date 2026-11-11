import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { attachmentLimits } from './attachment-limits'

export default defineConfig({
  base: './',
  plugins: [attachmentLimits(), vue(), viteSingleFile()],
  server: {
    host: '0.0.0.0',
    port: 7100,
    strictPort: false,
  },
  build: {
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
})
