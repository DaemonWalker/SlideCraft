<script setup lang="ts">
import { computed } from 'vue'

export interface HttpRequest {
  method: string
  path: string
  description?: string
  headers?: Record<string, string>
  body?: string
}

export interface HttpResponse {
  status: number | string
  statusText?: string
  headers?: Record<string, string>
  body?: string
  duration?: string
}

const props = withDefaults(defineProps<{
  request: HttpRequest
  response?: HttpResponse
  caption?: string
  requestLabel?: string
  responseLabel?: string
}>(), {
  response: undefined,
  caption: '',
  requestLabel: 'Request',
  responseLabel: 'Response',
})

const requestHeaders = computed(() => Object.entries(props.request.headers ?? {}))
const responseHeaders = computed(() => Object.entries(props.response?.headers ?? {}))
</script>

<template>
  <section class="request-response" :aria-label="caption || `${requestLabel} / ${responseLabel}`">
    <header v-if="caption" class="request-response__caption">{{ caption }}</header>
    <div class="request-response__panels" :class="{ 'request-response__panels--single': !response }">
      <article class="http-panel">
        <header class="http-panel__header">
          <span class="http-panel__label">{{ requestLabel }}</span>
          <div class="http-panel__endpoint">
            <strong class="http-panel__method" :class="`http-panel__method--${request.method.toLowerCase()}`">{{ request.method }}</strong>
            <code>{{ request.path }}</code>
          </div>
          <p v-if="request.description">{{ request.description }}</p>
        </header>
        <div v-if="requestHeaders.length" class="http-panel__section">
          <h3>Headers</h3>
          <dl class="http-panel__headers">
            <template v-for="[key, value] in requestHeaders" :key="key">
              <dt>{{ key }}</dt><dd>{{ value }}</dd>
            </template>
          </dl>
        </div>
        <div v-if="request.body" class="http-panel__section">
          <h3>Body</h3>
          <pre>{{ request.body }}</pre>
        </div>
      </article>

      <article v-if="response" class="http-panel">
        <header class="http-panel__header">
          <div class="http-panel__response-line">
            <span class="http-panel__label">{{ responseLabel }}</span>
            <span v-if="response.duration" class="http-panel__duration">{{ response.duration }}</span>
          </div>
          <div class="http-panel__status" :class="Number(response.status) >= 400 ? 'http-panel__status--error' : 'http-panel__status--success'">
            <strong>{{ response.status }}</strong>
            <span v-if="response.statusText">{{ response.statusText }}</span>
          </div>
        </header>
        <div v-if="responseHeaders.length" class="http-panel__section">
          <h3>Headers</h3>
          <dl class="http-panel__headers">
            <template v-for="[key, value] in responseHeaders" :key="key">
              <dt>{{ key }}</dt><dd>{{ value }}</dd>
            </template>
          </dl>
        </div>
        <div v-if="response.body" class="http-panel__section">
          <h3>Body</h3>
          <pre>{{ response.body }}</pre>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.request-response {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--radius-panel);
  background: var(--surface-slide);
}

.request-response__caption {
  padding: 14px 24px;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
  background: var(--surface-muted);
  font-size: 18px;
  font-weight: 700;
}

.request-response__panels {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.request-response__panels--single {
  grid-template-columns: minmax(0, 1fr);
}

.http-panel {
  min-width: 0;
}

.http-panel + .http-panel {
  border-left: 1px solid var(--line);
}

.http-panel__header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--line);
  background: var(--surface-muted);
}

.http-panel__label {
  display: block;
  margin-bottom: 10px;
  color: var(--ink-muted);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.http-panel__endpoint {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 14px;
}

.http-panel__endpoint code {
  min-width: 0;
  color: var(--ink);
  font-size: 19px;
  overflow-wrap: anywhere;
}

.http-panel__method {
  flex: none;
  padding: 4px 10px;
  border-radius: 6px;
  color: var(--on-dark);
  background: var(--accent);
  font-family: var(--font-code);
  font-size: 15px;
}

.http-panel__method--post { background: var(--success); }
.http-panel__method--put,
.http-panel__method--patch { background: var(--warning); }
.http-panel__method--delete { background: var(--danger); }

.http-panel__header p {
  margin-top: 10px;
  color: var(--ink-muted);
  font-size: 16px;
}

.http-panel__response-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.http-panel__duration {
  color: var(--ink-muted);
  font-family: var(--font-code);
  font-size: 14px;
}

.http-panel__status {
  display: flex;
  align-items: baseline;
  gap: 10px;
  font-family: var(--font-code);
}

.http-panel__status strong {
  font-size: 27px;
}

.http-panel__status--success strong { color: var(--success); }
.http-panel__status--error strong { color: var(--danger); }
.http-panel__status span { color: var(--ink-muted); font-size: 16px; }

.http-panel__section {
  padding: 16px 24px 20px;
}

.http-panel__section + .http-panel__section {
  padding-top: 0;
}

.http-panel__section h3 {
  margin-bottom: 9px;
  color: var(--ink-muted);
  font-family: var(--font-code);
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
}

.http-panel__headers {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  gap: 5px 16px;
  font-family: var(--font-code);
  font-size: 14px;
  line-height: 1.5;
}

.http-panel__headers dt { color: var(--accent); }
.http-panel__headers dd { color: var(--ink-muted); overflow-wrap: anywhere; }

.http-panel__section pre {
  max-height: 220px;
  overflow: auto;
  padding: 16px 18px;
  border-radius: var(--radius-control);
  color: var(--on-dark);
  background: var(--surface-dark);
  font-size: 15px;
  line-height: 1.55;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
