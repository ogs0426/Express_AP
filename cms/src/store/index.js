import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import common from './common'
import banner from './banner'
import channel from './channel'
import program from './program'
import schedule from './schedule'
import board from './board'
import link from './link'


Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common,
    banner,
    channel,
    schedule,
    board,
    program,
    link
  },
  plugins: [
    createPersistedState({
      key: "vuex_persist",
      paths: ['common'],
      storage: window.localStorage
    })
  ]
})