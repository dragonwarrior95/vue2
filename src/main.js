import Vue from 'vue'
import App from './App.vue'
import router from "./router";

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })

import '@/icons'
// import '@/permission' // permission control

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  render: h => h(App)
}).$mount('#app')
