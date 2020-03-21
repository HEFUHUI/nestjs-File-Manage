import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import './plugins/element.js'
import router from './router'

Vue.config.productionTip = false
import EleForm from 'vue-ele-form'
import store from './store'

import {
  Message
} from "element-ui"


Vue.use(EleForm)

Vue.filter('date', function (value) {
  return new Date(value).toLocaleString();
})


Vue.mixin({
  methods: {
    alert_success(str) {
      Message({
        type: 'success',
        message: str || "操作成功"
      })
    },
    alert_error(str) {
      Message({
        type: "error",
        message: str || "操作错误"
      })
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')