<template>
  <div class="page">
    <h2>프로그램관리</h2>
    <div class="page_info">
      <p> *이미지 기준: 242*342px </p>
    </div>
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
      @close="closeDetail"
      ></DetailPage>
  </div>
</template>

<script>
import BasePageMixin from '../BasePage'
import DetailPage from './ProgramDetail'
import * as ProgramStore from '@/store/program'
import _ from 'lodash'

export default {
  mixins: [BasePageMixin],
  components: {
    DetailPage
  },
  data() {
    return {
      columns: [
        {type: 'selection', align: 'center', maxWidth: 80},
        {title: '출력 순서', key: 'order', align: 'center'},
        {title: '프로그램 제목', key: 'title', align: 'center'},
        {title: '내용', key: 'contents', align: 'center'},
        {title: '장르', key: 'genre', align: 'center'},
        {title: '이미지', key: 'img_program_url', align: 'center', render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.img_program_url,
                width: _.isNil(params.row.img_program_url) ? 0 : 120,
                height: 'auto'
              },
              style: {
                backgroundColor: '#000'
              }
            })
          }
        },
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
    ...ProgramStore.mapState([
      'programs',
      'totalCount',
      'page'
    ]),
    tableData() {
      return this.programs
    }
  },
  async created() {
    await this.getData()
  },
  methods: {
    ...ProgramStore.mapMutations({
      setPage: 'setPage'
    }),
    ...ProgramStore.mapActions({
      getData: 'getProgram',
      deleteData: 'deleteProgram'
    })
  }
}
</script>

<style>

</style>