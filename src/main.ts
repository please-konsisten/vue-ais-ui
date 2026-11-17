import { createApp, h } from 'vue'
import { createPinia } from 'pinia'
import { RouterView } from 'vue-router'
import router from './app/routes'
import './style.css'

const app = createApp({
  render: () => h(RouterView),
})

app.use(createPinia())
app.use(router)
app.mount('#app')
