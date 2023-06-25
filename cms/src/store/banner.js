import { api } from '../helpers'
import { createNamespacedHelpers } from 'vuex'
export const { mapState, mapMutations, mapActions } = createNamespacedHelpers('banner')


export default {
  namespaced: true,
  state: {
    banners: [],
    totalCount: 0,
    page: 1
  },
  mutations: {
    bindData(state, {totalCount, data}) {
      state.totalCount = totalCount
      state.banners = data
    },
    setPage(state, page) {
      page = page <= 0 ? 1 : page
      state.page = page
    }
  },
  actions: {
    async getBanner({state, commit}) {  // 배너 조회(페이지)
      try {
        const response = await api.get(`banner/${state.page}`)
        commit('bindData', response.data)
      } catch (e) {
        console.error('[axios] getBanner')
      }
    },
    async createBanner({dispatch}, formData) {  // 배너 추가
      try {
        await api.post('banner', formData)
        dispatch('getBanner')
        return true
      } catch (e) {
        console.error('[axios] createBanner')
        return false
      }
    },
    async updateBanner({dispatch}, {id, formData}) {  // 배너 수정
      try {
        await api.put(`banner/${id}`, formData)
        dispatch('getBanner')
        return true
      } catch (e) {
        console.error('[axios] updateBanner')
        return false
      }
    },
    async deleteBanner({state, commit, dispatch}, {ids}) {  // 배너 삭제
      try {
        const response = await api.delete('banner', { data: {ids: ids}})
        if (Math.ceil((state.totalCount - response.data) / 10) < state.page) {
          commit('setPage', state.page - 1)
        }
        dispatch('getBanner')
        return true
      } catch (e) {
        console.error('[axios] deleteBanner')
        return false
      }
    }
  }
}