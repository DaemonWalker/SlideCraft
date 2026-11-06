<script setup lang="ts">
withDefaults(defineProps<{
  columns: string[]
  rows: string[][]
  caption?: string
}>(), { caption: '' })
</script>

<template>
  <table class="data-table">
    <caption v-if="caption">{{ caption }}</caption>
    <thead><tr><th v-for="column in columns" :key="column">{{ column }}</th></tr></thead>
    <tbody>
      <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
        <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.data-table {
  width: 100%;
  border-collapse: collapse;
  color: var(--ink-muted);
  font-size: 22px;
  line-height: 1.55;
  text-align: left;
}

.data-table caption {
  margin-bottom: 16px;
  color: var(--ink);
  font-size: 24px;
  font-weight: 700;
  text-align: left;
}

.data-table th,
.data-table td {
  padding: 20px 24px;
  border-bottom: 1px solid var(--line);
  vertical-align: top;
}

.data-table th {
  color: var(--ink);
  background: var(--surface-muted);
  font-size: 18px;
  font-weight: 700;
}

.data-table td:first-child {
  color: var(--accent);
  font-family: var(--font-code);
  font-size: 19px;
  font-weight: 650;
}
</style>
