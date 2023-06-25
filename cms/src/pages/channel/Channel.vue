<template>
  <div class="page">
    <h2>채널관리</h2>
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
import DetailPage from './ChannelDetail'
import * as ChannelStore from '@/store/channel'
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
        {title: '채널 이름', key: 'name', align: 'center'},
        {title: '채널 번호', key: 'number', align: 'center'},
        // {title: '이미지', key: 'img_channel_url', align: 'center', render: (h, params) => {
        //     return h('img', {
        //       attrs: {
        //         src: params.row.img_channel_url,
        //         width: _.isNil(params.row.img_channel_url) ? 0 : 120,
        //         height: 'auto'
        //       },
        //       style: {
        //         backgroundColor: '#000'
        //       }
        //     })
        //   }
        // },
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
    ...ChannelStore.mapState([
      'channels',
      'totalCount',
      'page'
    ]),
    tableData() {
      return this.channels
    }
  },
  async created() {
    await this.getData()
  },
  methods: {
    ...ChannelStore.mapMutations({
      setPage: 'setPage'
    }),
    ...ChannelStore.mapActions({
      getData: 'getChannel',
      deleteData: 'deleteChannel'
    })
  }
}
</script>

<style>

</style>