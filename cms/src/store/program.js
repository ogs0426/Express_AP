import { api } from '../helpers'
import { createNamespacedHelpers } from 'vuex'
export const { mapState, mapMutations, mapActions } = createNamespacedHelpers('program')


export default {
  namespaced: true,
  state: {
    programs: [],
    totalCount: 0,
    page: 1
  },
  mutations: {
    bindData(state, {totalCount, data}) {
      state.totalCount = totalCount
      state.programs = data
    },
    setPage(state, page) {
      page = page <= 0 ? 1 : page
      state.page = page
    }
  },
  actions: {
    async getProgram({state, commit}) {  // 채널 조회(페이지)
      try {
        const response = await api.get(`program/${state.page}`)
        commit('bindData', response.data)
      } catch (e) {
        console.error('[axios] getProgram')
      }
    },
    async createProgram({dispatch}, formData) {  // 채널 추가
      try {
        await api.post('program', formData)
        dispatch('getProgram')
        return true
      } catch (e) {
        console.error('[axios] createProgram')
        console.error(e)
        return false
      }
    },
    async updateProgram({dispatch}, {id, formData}) {  // 채널 수정
      try {
        await api.put(`program/${id}`, formData)
        dispatch('getProgram')
        return true
      } catch (e) {
        console.error('[axios] updateProgram')
        return false
      }
    },
    async deleteProgram({state, commit, dispatch}, {ids}) {  // 채널 삭제
      try {
        const response = await api.delete('program', { data: {ids: ids}})
        if (Math.ceil((state.totalCount - response.data) / 10) < state.page) {
          commit('setPage', state.page - 1)
        }
        dispatch('getProgram')
        return true
      } catch (e) {
        console.error('[axios] deleteProgram')
        return false
      }
    }
  }
}