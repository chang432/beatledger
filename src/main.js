import { createApp } from 'vue/dist/vue.esm-bundler'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import 'vue-universal-modal/dist/index.css'
import VueUniversalModal from 'vue-universal-modal'

library.add(fas)

createApp(App)
  .component('fa', FontAwesomeIcon)
  .use(router, VueUniversalModal, {
    teleportTarget: '#modals'
  })
  .mount('#app')
