import { router, api } from '../helpers'
import { createNamespacedHelpers } from 'vuex'
export const { mapState, mapActions } = createNamespacedHelpers('common')

export default {
  namespaced: true,
  state: {
    isLogin: false,
    access_token: ''
  },
  mutations: {
    setIsLogin(state, flag) {
      state.isLogin = flag
    },
    setAccessToken(state, data) {
      state.access_token = data
    }
  },
  getters: {
    IS_LOGIN: (state) => state.isLogin
  },
  actions: {
    async login({commit}, data) {
      try {
        const response = await api.post('user/login', data)
        commit('setIsLogin', true)
        commit('setAccessToken', response.data.access_token)
        router.replace('/')
      } catch (e) {
        console.error('[axios] login')
        return false
      }
    },
    logout({commit}, flag) {
      console.log('# logout!')
      commit('setIsLogin', false)
      commit('setAccessToken', '')
      router.replace({
        name: 'login',
        params: { permissionDenied: flag || false }
      })
    }
  }
}