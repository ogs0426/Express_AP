import { api } from '../helpers'
import { createNamespacedHelpers } from 'vuex'
export const { mapState, mapMutations, mapActions } = createNamespacedHelpers('link')


export default {
  namespaced: true,
  state: {
    links: [],
    totalCount: 0,
    page: 1
  },
  mutations: {
    bindData(state, {totalCount, data}) {
      state.totalCount = totalCount
      state.links = data
    },
    setPage(state, page) {
      page = page <= 0 ? 1 : page
      state.page = page
    }
  },
  actions: {
    async getLink({state, commit}) {  // 링크 조회(페이지)
      try {
        const response = await api.get(`link/${state.page}`)
        commit('bindData', response.data)
      } catch (e) {
        console.error('[axios] getLink')
      }
    },
    async createLink({dispatch}, formData) {  // 링크 추가
      try {
        await api.post('link', formData)
        dispatch('getLink')
        return true
      } catch (e) {
        console.error('[axios] createLink')
        return false
      }
    },
    async updateLink({dispatch}, {id, formData}) {  // 링크 수정
      try {
        await api.put(`link/${id}`, formData)
        dispatch('getLink')
        return true
      } catch (e) {
        console.error('[axios] updateLink')
        return false
      }
    },
    async deleteLink({state, commit, dispatch}, {ids}) {  // 채널 삭제
      try {
        const response = await api.delete('link', { data: {ids: ids}})
        if (Math.ceil((state.totalCount - response.data) / 10) < state.page) {
          commit('setPage', state.page - 1)
        }
        dispatch('getLink')
        return true
      } catch (e) {
        console.error('[axios] deleteLink')
        return false
      }
    }
  }
}