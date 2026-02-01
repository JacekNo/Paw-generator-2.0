import { createApp } from 'vue'
import { createPinia } from 'pinia' // <--- DODAJ TO
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia()) // <--- I TO
app.use(router)

app.mount('#app')