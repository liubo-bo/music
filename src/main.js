import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//样式表
import './assets/css/base.css'
import 'element-ui/lib/theme-chalk/index.css'

import './plugin/element'
import elementUI from 'element-ui'
// import { request } from "./network/request"
// Vue.prototype.$request = request;

import http from './http'
Vue.prototype.$http = http;

Vue.use(elementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
