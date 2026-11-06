import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { DeckDefinition, SlideDefinition } from './types'

interface UseDeckOptions {
  getDeckTitle?: () => string
  getSlideTitle?: (slide: SlideDefinition) => string
}

export function useDeck(deck: DeckDefinition, options: UseDeckOptions = {}) {
  const clamp = (index: number) => Math.min(Math.max(index, 0), deck.slides.length - 1)
  const indexFromHash = () => {
    const match = window.location.hash.match(/^#\/(\d+)$/)
    return match ? clamp(Number(match[1]) - 1) : 0
  }

  const currentIndex = ref(indexFromHash())
  const currentSlide = computed(() => deck.slides[currentIndex.value])
  const progress = computed(() => ((currentIndex.value + 1) / deck.slides.length) * 100)
  const canGoPrevious = computed(() => currentIndex.value > 0)
  const canGoNext = computed(() => currentIndex.value < deck.slides.length - 1)

  const updateLocation = () => {
    const hash = `#/${currentIndex.value + 1}`
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', hash)
    }
    const deckTitle = options.getDeckTitle?.() ?? deck.title
    const slideTitle = options.getSlideTitle?.(currentSlide.value) ?? currentSlide.value.title
    document.title = `${String(currentIndex.value + 1).padStart(2, '0')}｜${slideTitle}｜${deckTitle}`
  }

  const goTo = (index: number) => {
    currentIndex.value = clamp(index)
    updateLocation()
  }
  const next = () => goTo(currentIndex.value + 1)
  const previous = () => goTo(currentIndex.value - 1)
  const onHashChange = () => {
    currentIndex.value = indexFromHash()
    updateLocation()
  }

  onMounted(() => {
    updateLocation()
    window.addEventListener('hashchange', onHashChange)
  })
  onUnmounted(() => window.removeEventListener('hashchange', onHashChange))

  return {
    currentIndex,
    currentSlide,
    progress,
    canGoPrevious,
    canGoNext,
    goTo,
    next,
    previous,
    updateLocation,
  }
}
