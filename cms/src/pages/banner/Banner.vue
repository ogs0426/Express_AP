<template>
  <div class="page">
    <h2>배너관리</h2>
    <div class="page_info">
      <p> *이미지 기준: PC - 1920*550px  |  Mobile - 765*800px </p>
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
import DetailPage from './BannerDetail'
import * as BannerStore from '@/store/banner'
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
        {title: '시작', key: 'start_date', align: 'center'},
        {title: '종료', key: 'end_date', align: 'center'},
        {title: '출력 순서', key: 'order', align: 'center'},
        {title: '출력 여부', key: 'use', align: 'center', render: (h, params) => {
            return h('div', params.row.use ==  true ? 'Yes' : 'No')
          }
        },
        {title: '이미지(PC)', key: 'img_banner_url', align: 'center', render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.img_banner_url,
                width: _.isNil(params.row.img_banner_url) ? 0 : 150,
                height: 'auto'
              }
            })
          }
        },
        {title: '이미지(Mobile)', key: 'img_banner_mobile_url', align: 'center', render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.img_banner_mobile_url,
                width: _.isNil(params.row.img_banner_mobile_url) ? 0 : 50,
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
    ...BannerStore.mapState([
      'banners',
      'totalCount',
      'page'
    ]),
    tableData() {
      return this.banners
    }
  },
  async created() {
    await this.getData()
  },
  methods: {
    ...BannerStore.mapMutations({
      setPage: 'setPage'
    }),
    ...BannerStore.mapActions({
      getData: 'getBanner',
      deleteData: 'deleteBanner'
    })
  }  
}
</script>