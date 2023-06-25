<template>
  <div class="page">
    <h2>링크페이지관리</h2>
    <div class="page_info">
      <p> *이미지 기준: PC - 1080*370px  |  Mobile - 705*350px </p>
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
import DetailPage from './LinkDetail'
import * as LinkStore from '@/store/link'
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
        {title: '링크 주소', key: 'link_url', align: 'center' , render: (h, params) => {
          return h('div', `/event/?link=${params.row.link_url}`)
        }},
        {title: '프로그램 제목', key: 'title', align: 'center'},
        {title: '프로그램 소제목', key: 'sub_title', align: 'center'},
        // {title: '프로그램 설명', key: 'number', align: 'center'},
        {title: '이미지(PC)', key: 'img_link_url', align: 'center', render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.img_link_url,
                width: _.isNil(params.row.img_link_url) ? 0 : 120,
                height: 'auto'
              },
              style: {
                backgroundColor: '#000'
              }
            })
          }
        },
        {title: '이미지(Mobile)', key: 'img_link_mobile_url', align: 'center', render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.img_link_mobile_url,
                width: _.isNil(params.row.img_link_mobile_url) ? 0 : 50,
                height: 'auto'
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
    ...LinkStore.mapState([
      'links',
      'totalCount',
      'page'
    ]),
    tableData() {
      return this.links
    }
  },
  async created() {
    await this.getData()
  },
  methods: {
    ...LinkStore.mapMutations({
      setPage: 'setPage'
    }),
    ...LinkStore.mapActions({
      getData: 'getLink',
      deleteData: 'deleteLink'
    })
  }
}
</script>

<style>

</style>