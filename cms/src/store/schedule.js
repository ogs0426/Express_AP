import _ from 'lodash'
import { api } from '../helpers'
import { createNamespacedHelpers } from 'vuex'
export const { mapState, mapMutations, mapActions } = createNamespacedHelpers('schedule')


export default {
  namespaced: true,
  state: {
    result: ''
  },
  mutations: {
    bindData(state, data) {
      state.result = data
    },
    setResult(state, data) {
      state.result = data
    }
  },
  actions: {
    async uploadSchedule({commit}, formData) {
      try {
        const response = await api.post('schedule/upload', formData)
        commit('bindData', response.data)
        return true
      } catch (e) {
        console.error('[axios] uploadSchedule')
        return false
      }
    }
  }
}