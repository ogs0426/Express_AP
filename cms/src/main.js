import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import { router, i18n, error_message } from './helpers'
import store from './store'

// import iView from 'iview'
// import locale from 'iview/dist/locale/en-US'
// import 'iview/dist/styles/iview.css'
import ViewUI from 'view-design'
import locale from 'view-design/dist/locale/en-US'
import 'view-design/dist/styles/iview.css'

import SimpleVueValidation from 'simple-vue-validator'

import './assets/css/example.less'

Vue.config.productionTip = false

Vue.use(ViewUI, {locale})

SimpleVueValidation.extendTemplates(error_message)
Vue.use(SimpleVueValidation, {mode: 'manual'})  // manual: $validate() 호출했을 때만 검사

new Vue({
  render: h => h(App),
  router,
  i18n,
  store
}).$mount('#app')
