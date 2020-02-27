import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import './plugins/element.js'
import router from './router'

Vue.config.productionTip = false
import EleForm from 'vue-ele-form'
import store from './store'

Vue.use(EleForm)

Vue.filter('date', function (value) {
  return new Date(value).toLocaleString();
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
