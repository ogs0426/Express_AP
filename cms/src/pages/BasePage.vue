<template>
  
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      visible: false,
      detailType: '',
      detailData: {},
      selectIndex: []
    }
  },
  methods: {
    showDetail(event, rowData) {  // 디테일 팝업 오픈(params 없으면 추가, 있으면 편집)
      rowData = rowData || {}

      this.detailType = _.size(rowData) === 0 ? 'create' : 'update'
      this.detailData = _.cloneDeep(rowData)
      this.visible = true
    },
    closeDetail() {  // 팝업 닫힌 후, 선택된 detailData 초기화
      this.visible = false
      this.detailData = {}
    },
    selectRow(list) {
      this.selectIndex = []

      _.forEach(list, (row) => { 
        this.selectIndex.push(row['id'])
      })
    },
    async changePage(index) {
      this.setPage(index)
      await this.getData()
    },
    removeRows() {
      if (_.size(this.selectIndex) === 0) {
        this.$Message.warning(this.$t('select.row'))
        return
      }

      const result = this.deleteData({ids: this.selectIndex})
      if (result) {
        this.selectIndex = []
      } else {
        this.$Message.error(this.$t('axios.fail.delete'))
      }
    }
  }
}
</script>

<style>

</style>