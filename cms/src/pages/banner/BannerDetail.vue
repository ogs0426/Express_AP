<template>
  <Modal
    id="bannerDetail"
    :title="modalTitle"
    :value="visible"
    :closable="false"
    :mask-closable="false"
    @on-visible-change="initData"
    :width="1024"
    class="detail-modal split">
    <Form label-position="top" class="detail-form">
      <FormItem label="기간" :class="{error: validation.hasError('daterange')}">
        <DatePicker type="daterange" v-model="daterange" separator="   ~   " format="yyyy-MM-dd"></DatePicker>
        <label>{{ validation.firstError('daterange') }}</label>
      </FormItem>
      <FormItem label="출력 순서" :class="{error: validation.hasError('order')}">
        <Input v-model="order" type="number"/>
        <label>{{ validation.firstError('order') }}</label>
      </FormItem>
      <FormItem label="출력 여부">
        <i-switch v-model="use" size="large">
          <span slot="open">Yes</span>
          <span slot="close">No</span>
        </i-switch>
      </FormItem>
      <FormItem label="이미지 - PC" :class="['with-upload','between']">
        <input id="file_pc" type="file" @change="changeFile(pc, $event)">
        <label for="file_pc">{{ $t('select.image_file') }}</label>
        <img v-show="pc.url" :src="pc.url">
      </FormItem>
      <FormItem label="이미지 - Mobile" :class="['with-upload','between']">
        <input id="file_mobile" type="file" @change="changeFile(mobile, $event)">
        <label for="file_mobile">{{ $t('select.image_file') }}</label>
        <img v-show="mobile.url" :src="mobile.url">
      </FormItem>
     </Form>
      <Form label-position="top" class="detail-form">
        <FormItem label="제목" :class="{error: validation.hasError('title')}">
        <Input v-model="title" type="text"/>
        <label>{{ validation.firstError('title') }}</label>
      </FormItem>
      <FormItem label="소제목" :class="{error: validation.hasError('sub_title')}">
        <Input v-model="sub_title" type="text"/>
        <label>{{ validation.firstError('sub_title') }}</label>
      </FormItem>
      <FormItem label="내용" :class="{error: validation.hasError('contents')}">
        <Input v-model="contents" type="textarea"/>
        <label>{{ validation.firstError('contents') }}</label>
      </FormItem>
          <FormItem label="링크" :class="{error: validation.hasError('link')}">
        <Input v-model="link" type="text"/>
        <label>{{ validation.firstError('link') }}</label>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button @click="close">{{ $t('button.close') }}</Button>
      <Button type="primary" @click="submit">{{ $t('button.apply') }}</Button>
    </div>
  </Modal>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import * as BannerStore from '@/store/banner'

import SimpleVueValidation from 'simple-vue-validator'
const Validator = SimpleVueValidation.Validator

export default {
  props: [
    'visible',
    'params',
    'type'
  ],
  data() {
    return {
      daterange: '',
      order: '',
      use: false,
      title: '',
      sub_title: '',
      contents: '',
      link: '',
      pc: {
        url: '',
        file: null
      },
      mobile: {
        url: '',
        file: null
      },
    }
  },
  computed: {
    modalTitle() {
      return this.type === 'create' ? '배너추가' : '배너편집'
    },
  },
  methods: {
    ...BannerStore.mapActions([
      'createBanner',
      'updateBanner'
    ]),
    async submit() {
      const isValid = await this.$validate()
      if (isValid) {
        let result = true

        const formData = new FormData()
        formData.append('start_date', moment(this.daterange[0]).format('YYYY-MM-DD'))
        formData.append('end_date', moment(this.daterange[1]).format('YYYY-MM-DD'))
        formData.append('order', this.order)
        formData.append('use', this.use)
        formData.append('title', this.title)
        formData.append('sub_title', this.sub_title)
        formData.append('contents', this.contents)
        formData.append('link', this.link)
        formData.append('img_banner_url', this.pc.file)
        formData.append('img_banner_mobile_url', this.mobile.file)

        if (this.type === 'create') {
          result = await this.createBanner(formData)
        } else {
          result = await this.updateBanner({
            id: this.params.id,
            formData: formData
          })
        }

        if (result) {
          this.$Message.success(this.$t('axios.success.set'))
          this.close()
        } else {
          this.$Message.error(this.$t('axios.fail.set'))
        }
      }
    },
    close() {
      this.validation.reset()
      this.$emit('close')
    },
    async initData(open) {
      if (open) {
        this.daterange = [this.params.start_date, this.params.end_date]
        this.order = this.params.order || ''
        this.use = this.params.use || false
        this.title = this.params.title || ''
        this.sub_title = this.params.sub_title || ''
        this.contents = this.params.contents || ''
        this.link = this.params.link || ''
        this.pc = {
          url: this.params.img_banner_url || '',
          file: null
        }
        this.mobile = {
          url: this.params.img_banner_mobile_url || '',
          file: null
        }
      }
    },
    changeFile(obj, e) {
      if (obj.file) {
        URL.revokeObjectURL(obj.file)
      }

      obj.file = e.target.files[0]
      obj.url = URL.createObjectURL(obj.file)
    }
  },
  validators: {
    daterange: (value) => {
      return Validator.custom(() => {
        const isInvalid = _.some(value, (v) => { return _.isUndefined(v) })
        if (isInvalid) return '필수입력 항목입니다.'
      })
    },
    order: (value) => { 
      value = value || ''
      return Validator.value(value).integer().greaterThan(0).required()
    },
    // title: (value) => { 
    //   value = value || ''
    //   return Validator.value(value).required() 
    // },
    // sub_title: (value) => { 
    //   value = value || ''
    //   return Validator.value(value).required() 
    // },
  }
}
</script>

<style lang="less">
#bannerDetail {
  .with-upload.mobile {
    img { width: 50px; }
  }
}
</style>