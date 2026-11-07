<script setup lang="ts">
import { computed } from 'vue'
import Slide from '../../../core/Slide.vue'
import { CodeBlock, CodeDiff, ConfigBlock, TerminalBlock, TwoColumn, Stack } from '../../../components'
import type { DiffLine } from '../../../components/content/CodeDiff.vue'
import type { ConfigEntry } from '../../../components/content/ConfigBlock.vue'
import type { TerminalEntry } from '../../../components/content/TerminalBlock.vue'
import { useI18n } from '../../../i18n'

const { t, tm } = useI18n()
const code = `async function loadUser(id: string) {
  const response = await fetch(\`/api/users/\${id}\`)
  const user = await response.json()
  console.log(user)
  return user
}`
const diffLines: DiffLine[] = [
  { content: 'async function loadUser(id: string) {' },
  { content: '  const response = await fetch(`/api/users/${id}`)' },
  { content: '  const user = await response.json()' },
  { type: 'removed', content: '  console.log(user)' },
  { type: 'added', content: "  logger.debug('User loaded', { id })" },
  { content: '  return user' },
  { content: '}' },
]
const terminalEntries: TerminalEntry[] = [
  { command: 'npm test', output: '✓ 24 tests passed', status: 'success', exitCode: 0 },
  { command: 'npm run build:offline', output: '✓ built in 1.2s\n→ dist/index.html', status: 'success', exitCode: 0 },
]
const configEntries = computed(() => tm<ConfigEntry[]>('deck.slides.developer-code.configEntries'))
</script>

<template>
  <Slide
    :eyebrow="t('deck.slides.developer-code.eyebrow')"
    :title="t('deck.slides.developer-code.title')"
    :subtitle="t('deck.slides.developer-code.subtitle')"
    :footer="t('deck.slides.developer-code.footer')"
    :duration="t('deck.slides.developer-code.duration')"
    content-align="start"
  >
    <TwoColumn ratio="1.08fr 0.92fr" :gap="32" align="start">
      <template #left>
        <Stack :gap="22">
          <CodeBlock
            :code="code"
            language="typescript"
            caption="src/services/user.ts"
            :show-line-numbers="true"
            :highlight-lines="[2, 3]"
            :error-lines="[4]"
          />
          <CodeDiff :lines="diffLines" language="typescript" caption="user.ts" old-label="Before" new-label="After" />
        </Stack>
      </template>
      <template #right>
        <Stack :gap="22">
          <TerminalBlock :entries="terminalEntries" title="PowerShell" :show-exit-code="true" />
          <ConfigBlock :entries="configEntries" format="env" :caption="t('deck.slides.developer-code.configCaption')" />
        </Stack>
      </template>
    </TwoColumn>
  </Slide>
</template>
