<script setup lang="ts">
import { computed } from 'vue'
import Slide from '../../../core/Slide.vue'
import { RequestResponse } from '../../../components'
import type { HttpRequest, HttpResponse } from '../../../components/content/RequestResponse.vue'
import { useI18n } from '../../../i18n'

const { t } = useI18n()
const request = computed<HttpRequest>(() => ({
  method: 'POST',
  path: '/api/orders',
  description: t('deck.slides.api-design.requestDescription'),
  headers: {
    'Content-Type': 'application/json',
    'X-Correlation-Id': 'req-8f42c1',
  },
  body: `{
  "customerId": "C-1024",
  "items": [
    { "sku": "BOOK-01", "quantity": 2 }
  ]
}`,
}))
const response = computed<HttpResponse>(() => ({
  status: 201,
  statusText: 'Created',
  duration: '48 ms',
  headers: { 'Content-Type': 'application/json' },
  body: `{
  "orderId": "ORD-2026-0042",
  "status": "PENDING",
  "total": 128.00
}`,
}))
</script>

<template>
  <Slide
    :eyebrow="t('deck.slides.api-design.eyebrow')"
    :title="t('deck.slides.api-design.title')"
    :subtitle="t('deck.slides.api-design.subtitle')"
    :footer="t('deck.slides.api-design.footer')"
    :duration="t('deck.slides.api-design.duration')"
    content-align="start"
  >
    <RequestResponse
      :request="request"
      :response="response"
      :caption="t('deck.slides.api-design.caption')"
      request-label="Request"
      response-label="Response"
    />
  </Slide>
</template>
