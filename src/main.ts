import { createApp, h } from 'vue'
import { RouterView } from 'vue-router'
import './style.css'
import router from './app/routes'

createApp({ render: () => h(RouterView) })
  .use(router)
  .mount('#app')