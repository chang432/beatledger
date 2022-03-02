import { createApp } from 'vue/dist/vue.esm-bundler'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import 'vue-universal-modal/dist/index.css'
import VueUniversalModal from 'vue-universal-modal'

import Arweave from "arweave"

library.add(fas)

const app = createApp(App)
app.config.globalProperties.arweave = Arweave.init({
  host: "localhost",
  port: 1984,
  protocol: "http",
});
app.component('fa', FontAwesomeIcon)
app.use(router, VueUniversalModal, {
  teleportTarget: '#modals'
})
app.mount('#app')
