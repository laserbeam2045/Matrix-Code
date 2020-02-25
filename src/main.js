import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = true

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
