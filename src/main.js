import { createApp } from 'vue/dist/vue.esm-bundler'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'font-awesome-animation/css/font-awesome-animation.min.css'

import 'vue-universal-modal/dist/index.css'
import VueUniversalModal from 'vue-universal-modal'

import store from './store/store.js'
import Storage from 'vue-ls';

const storage_options = {
  namespace: 'vuejs__', // key prefix
  name: 'ls', // name variable Vue.[ls] or this.[$ls],
  storage: 'session', // storage name session, local, memory
};

library.add(fas)

const app = createApp(App)
app.component('fa', FontAwesomeIcon)
app.use(router, VueUniversalModal, {
  teleportTarget: '#modals'
})
app.use(store)
app.use(Storage, storage_options);
app.mount('#app')
