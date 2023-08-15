import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import Home from './routes/Home.vue'
import Fullscreen from './routes/Fullscreen.vue'
import Autoplay from './routes/Autoplay.vue'
import 'video.js/dist/video-js.css'
import './custom-video-js.css'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/fullscreen',
      name: 'Fullscreen',
      component: Fullscreen,
    },
    {
      path: '/autoplay',
      name: 'Autoplay',
      component: Autoplay,
    },
  ],
})

const app = createApp(App)
app.use(router)

app.mount('#app')
