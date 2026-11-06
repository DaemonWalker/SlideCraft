import type { Component } from 'vue'

export interface SlideDefinition {
  id: string
  title: string
  section: string
  duration?: string
  component: Component
  notes?: string
}

export interface DeckDefinition {
  title: string
  subtitle: string
  slides: SlideDefinition[]
}
