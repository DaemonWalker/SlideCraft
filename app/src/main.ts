import { createApp } from 'vue'
import App from './App.vue'
import ShowcaseApp from './showcase/ShowcaseApp.vue'
import './styles/global.css'

const root = import.meta.env.MODE === 'showcase' ? ShowcaseApp : App
createApp(root).mount('#app')
