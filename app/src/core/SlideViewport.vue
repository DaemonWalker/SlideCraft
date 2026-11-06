<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080

const viewport = ref<HTMLDivElement>()
const scale = ref(1)
const frameWidth = ref(DESIGN_WIDTH)
const frameHeight = ref(DESIGN_HEIGHT)
let observer: ResizeObserver | undefined

const updateScale = () => {
  const element = viewport.value
  if (!element) return

  const nextScale = Math.min(
    1,
    element.clientWidth / DESIGN_WIDTH,
    element.clientHeight / DESIGN_HEIGHT,
  )
  scale.value = Math.max(nextScale, 0.01)
  frameWidth.value = DESIGN_WIDTH * scale.value
  frameHeight.value = DESIGN_HEIGHT * scale.value
}

onMounted(() => {
  updateScale()
  observer = new ResizeObserver(updateScale)
  if (viewport.value) observer.observe(viewport.value)
  window.addEventListener('resize', updateScale)
})

onUnmounted(() => {
  observer?.disconnect()
  window.removeEventListener('resize', updateScale)
})

defineExpose({ scale, updateScale })
</script>

<template>
  <div ref="viewport" class="slide-viewport">
    <div
      class="slide-frame"
      :style="{ width: `${frameWidth}px`, height: `${frameHeight}px` }"
      :data-scale="scale.toFixed(4)"
    >
      <div
        class="slide-canvas"
        :style="{ transform: `scale(${scale})` }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-viewport {
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.slide-frame {
  position: relative;
  flex: none;
}

.slide-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  transform-origin: top left;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-slide);
  background: var(--surface-slide);
  box-shadow: var(--shadow-slide);
}
</style>
