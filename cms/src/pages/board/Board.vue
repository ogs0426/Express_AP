<template>
  <div class="page">
    <h2>공지/이벤트 관리</h2>
    <div class="button-group">
      <Button @click="showDetail">{{ $t('button.add') }}</Button>
      <Button @click="removeRows">{{ $t('button.delete') }}</Button>
    </div>
    <Table
      :columns="columns"
      :data="tableData"
      @on-selection-change="selectRow"></Table>
    <div class="pagination">
      <Page :total="totalCount" :current="page" @on-change="changePage"></Page>
    </div>
    <DetailPage 
      :visible="visible" 
      :params="detailData" 
      :type="detailType" 
      :board-type-list="boardTypeList"
      @close="closeDetail" 
      ></DetailPage>
  </div>
</template>

<script>
import BasePageMixin from '../BasePage'
import DetailPage from './BoardDetail'
import * as BoardStore from '@/store/board'

export default {
  mixins: [BasePageMixin],
  components: {
    DetailPage
  },
  data() {
    return {
      boardTypeList: [
        {label: '공지', value: 1},
        {label: '이벤트', value: 2}
      ],
      columns: [
        {type: 'selection', align: 'center', maxWidth: 80},
        {title: '타입', key: 'board_type', align: 'center', render: (h, params) => {
            return h('div', _.find(this.boardTypeList, (b) => { return b.value === params.row.board_type }).label)
          }
        },
        {title: '제목', key: 'title', align: 'center'},
        {title: '상단 고정', key: 'top_fix', align: 'center', render: (h, params) => {
            return h('div', params.row.top_fix ==  true ? 'Yes' : 'No')
          }
        },
        {title: '등록일자', key: 'created_at', align: 'center'},
        {title: '수정', key: 'action', align: 'center', maxWidth: 80, render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  shape: 'circle',
                  icon: 'md-create',
                },
                on: {
                  click: (evt) => { this.showDetail(evt, params.row) }
                }
              })
            ])
          }
        }
      ]
    }
  },
  computed: {
    ...BoardStore.mapState([
      'boards',
      'totalCount',
      'page'
    ]),
    tableData() {
      return this.boards
    }
  },
  async created() {
    await this.getData()
  },
  methods: {
    ...BoardStore.mapMutations({
      setPage: 'setPage'
    }),
    ...BoardStore.mapActions({
      getData: 'getBoard',
      deleteData: 'deleteBoard'
    })
  }
}
</script>

<style>

</style>