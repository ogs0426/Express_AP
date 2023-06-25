import { api } from '../helpers'
import { createNamespacedHelpers } from 'vuex'
export const { mapState, mapMutations, mapActions } = createNamespacedHelpers('channel')


export default {
  namespaced: true,
  state: {
    channels: [],
    totalCount: 0,
    page: 1
  },
  mutations: {
    bindData(state, {totalCount, data}) {
      state.totalCount = totalCount
      state.channels = data
    },
    setPage(state, page) {
      page = page <= 0 ? 1 : page
      state.page = page
    }
  },
  actions: {
    async getChannel({state, commit}) {  // 채널 조회(페이지)
      try {
        const response = await api.get(`channel/${state.page}`)
        commit('bindData', response.data)
      } catch (e) {
        console.error('[axios] getChannels')
      }
    },
    async createChannel({dispatch}, formData) {  // 채널 추가
      try {
        await api.post('channel', formData)
        dispatch('getChannel')
        return true
      } catch (e) {
        console.error('[axios] createChannel')
        return false
      }
    },
    async updateChannel({dispatch}, {id, formData}) {  // 채널 수정
      try {
        await api.put(`channel/${id}`, formData)
        dispatch('getChannel')
        return true
      } catch (e) {
        console.error('[axios] updateChannel')
        return false
      }
    },
    async deleteChannel({state, commit, dispatch}, {ids}) {  // 채널 삭제
      try {
        const response = await api.delete('channel', { data: {ids: ids}})
        if (Math.ceil((state.totalCount - response.data) / 10) < state.page) {
          commit('setPage', state.page - 1)
        }
        dispatch('getChannel')
        return true
      } catch (e) {
        console.error('[axios] deleteChannel')
        return false
      }
    }
  }
}