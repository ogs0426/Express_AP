import { api } from '../helpers'
import { createNamespacedHelpers } from 'vuex'
export const { mapState, mapMutations, mapActions } = createNamespacedHelpers('board')

export default {
  namespaced: true,
  state: {
    boards: [],
    totalCount: 0,
    page: 1
  },
  mutations: {
    bindData(state, {totalCount, data}) {
      state.totalCount = totalCount
      state.boards = data
    },
    setPage(state, page) {
      page = page <= 0 ? 1 : page
      state.page = page
    }
  },
  actions: {
    async getBoard({state, commit}) {  // 게시글 조회(페이지)
      try {
        const response = await api.get(`board?page=${state.page}`)
        commit('bindData', response.data)
      } catch (e) {
        console.error('[axios] getBoard')
      }
    },
    async createBoard({dispatch}, formData) {  // 게시글 추가
      try {
        await api.post('board', formData)
        dispatch('getBoard')
        return true
      } catch (e) {
        console.error('[axios] createBoard')
        return false
      }
    },
    async updateBoard({dispatch}, {id, formData}) {  // 게시글 수정
      try {
        await api.put(`board/${id}`, formData)
        dispatch('getBoard')
        return true
      } catch (e) {
        console.error('[axios] updateBoard')
        return false
      }
    },
    async deleteBoard({state, commit, dispatch}, {ids}) {  // 게시글 삭제
      try {
        const response = await api.delete('board', { data: {ids: ids}})
        if (Math.ceil((state.totalCount - response.data) / 10) < state.page) {
          commit('setPage', state.page - 1)
        }
        dispatch('getBoard')
        return true
      } catch (e) {
        console.error('[axios] deleteBoard')
        return false
      }
    },
    async downloadAttachedFile({commit}, name) {  // 첨부파일 다운로드
      try {
        const response = await api.get(`board/download/${name}`, { responseType: 'blob' })
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')

        fileLink.href = fileURL
        fileLink.setAttribute('download', name)
        document.body.appendChild(fileLink)
        fileLink.click()

      } catch (e) {
        console.error('[axios] downloadAttachedFile')
      }
    }
  }
}