<script setup lang="ts">
import { computed } from 'vue'
import Slide from '../../../core/Slide.vue'
import Stack from '../../../components/layout/Stack.vue'
import DataTable from '../../../components/content/DataTable.vue'
import TagList from '../../../components/content/TagList.vue'
import { useI18n } from '../../../i18n'

const { t, tm } = useI18n()
const columns = computed(() => tm<string[]>('deck.slides.library.columns'))
const rows = computed(() => tm<string[][]>('deck.slides.library.rows'))
const tags = computed(() => tm<string[]>('deck.slides.library.tags'))
</script>

<template>
  <Slide
    :eyebrow="t('deck.slides.library.eyebrow')"
    :title="t('deck.slides.library.title')"
    :subtitle="t('deck.slides.library.subtitle')"
    :footer="t('deck.slides.library.footer')"
    :duration="t('deck.slides.library.duration')"
  >
    <Stack :gap="30">
      <DataTable :columns="columns" :rows="rows" />
      <TagList :items="tags" />
    </Stack>
  </Slide>
</template>
