<template>
  <Modal 
    :title="modalTitle"
    :value="visible"
    :closable="false"
    :mask-closable="false"
    @on-visible-change="initData"
    :width="1024"
    class="detail-modal split">
    <Form label-position="top" class="detail-form">
      <FormItem label="링크 주소" :class="{error: validation.hasError('link_url')}">
        <Input v-model="link_url"/>
        <label>{{ validation.firstError('link_url') }}</label>
      </FormItem>
      <FormItem label="프로그램 제목" :class="{error: validation.hasError('title')}">
        <Input v-model="title"/>
        <label>{{ validation.firstError('title') }}</label>
      </FormItem>
      <FormItem label="프로그램 소제목" :class="{error: validation.hasError('sub_title')}">
        <Input v-model="sub_title"/>
        <label>{{ validation.firstError('sub_title') }}</label>
      </FormItem>
      <FormItem label="설명" :class="{error: validation.hasError('contents')}">
        <Input v-model="contents" type="textarea"/>
        <label>{{ validation.firstError('contents') }}</label>
      </FormItem>
      <FormItem label="포스터 이미지(PC)" :class="['with-upload','between']">
        <input id="file_pc" type="file" @change="changeFile(pc, $event)">
        <label for="file_pc">{{ $t('select.image_file') }}</label>
        <img v-show="pc.url" :src="pc.url" style="background-color: #000">
      </FormItem>
      <FormItem label="포스터 이미지(Mobile)" :class="['with-upload','between']">
        <input id="file_mobile" type="file" @change="changeFile(mobile, $event)">
        <label for="file_mobile">{{ $t('select.image_file') }}</label>
        <img v-show="mobile.url" :src="mobile.url" style="background-color: #000">
      </FormItem>
    </Form>
    <Form label-position="top" class="detail-form">
      <FormItem label="출연자1 이름" :class="{error: validation.hasError('actor1')}">
        <Input v-model="actor1.name" type="text"/>
        <label>{{ validation.firstError('actor1') }}</label>
      </FormItem>
      <FormItem label="출연자1 프로필 이미지" :class="['with-upload','between']">
        <input id="actor1_link" type="file" @change="changeFile(actor1, $event)">
        <label for="actor1_link">{{ $t('select.image_file') }}</label>
        <img v-show="actor1.url" :src="actor1.url" style="background-color: #000">
      </FormItem>
      <FormItem label="출연자2 이름" :class="{error: validation.hasError('actor2')}">
        <Input v-model="actor2.name" type="text"/>
        <label>{{ validation.firstError('actor2') }}</label>
      </FormItem>
      <FormItem label="출연자2 프로필 이미지" :class="['with-upload','between']">
        <input id="actor2_link" type="file" @change="changeFile(actor2, $event)">
        <label for="actor2_link">{{ $t('select.image_file') }}</label>
        <img v-show="actor2.url" :src="actor2.url" style="background-color: #000">
      </FormItem>
      <FormItem label="출연자3 이름" :class="{error: validation.hasError('actor3')}">
        <Input v-model="actor3.name" type="text"/>
        <label>{{ validation.firstError('actor3') }}</label>
      </FormItem>
      <FormItem label="출연자3 프로필 이미지" :class="['with-upload','between']">
        <input id="actor3_link" type="file" @change="changeFile(actor3, $event)">
        <label for="actor3_link">{{ $t('select.image_file') }}</label>
        <img v-show="actor3.url" :src="actor3.url" style="background-color: #000">
      </FormItem>
    </Form>
    <div slot="footer">
      <Button @click="close">{{ $t('button.close') }}</Button>
      <Button type="primary" @click="submit">{{ $t('button.apply') }}</Button>
    </div>
  </Modal>
</template>

<script>
import SimpleVueValidation from 'simple-vue-validator'
import _ from 'lodash'
import * as LinkStore from '@/store/link'

const Validator = SimpleVueValidation.Validator

export default {
  props: [
    'visible',
    'params',
    'type'
  ],
  data() {
    return {
      link_url: '',
      title: '',
      sub_title: '',
      contents: '',
      pc: {
        url: '',
        file: null
      },
      mobile: {
        url: '',
        file: null
      },
      actor1: {
        name: '',
        url: '',
        file: null
      },
      actor2: {
        name: '',
        url: '',
        file: null
      },
      actor3: {
        name: '',
        url: '',
        file: null
      },
    }
  },
  computed: {
    modalTitle() {
      return this.type === 'create' ? '링크추가' : '링크편집'
    }
  },
  methods: {
    ...LinkStore.mapActions([
      'createLink',
      'updateLink'
    ]),
    async submit() {
      const isValid = await this.$validate()
      if (isValid) {
        let result = true

        const formData = new FormData()
        formData.append('link_url', _.trim(this.link_url))
        formData.append('title', this.title)
        formData.append('sub_title', this.sub_title)
        formData.append('contents', this.contents)
        formData.append('img_link_url', this.pc.file)
        formData.append('img_link_mobile_url', this.mobile.file)
        formData.append('actor1_name', this.actor1.name)
        formData.append('img_actor1_url', this.actor1.file)
        formData.append('actor2_name', this.actor2.name)
        formData.append('img_actor2_url', this.actor2.file)
        formData.append('actor3_name', this.actor3.name)
        formData.append('img_actor3_url', this.actor3.file)

        if (this.type === 'create') {
          result = await this.createLink(formData)
        } else {
          result = await this.updateLink({
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
    initData(open) {
      if (open) {
        this.link_url = _.trim(this.params.link_url) || ''
        this.title = this.params.title || ''
        this.sub_title = this.params.sub_title || ''
        this.contents = this.params.contents || ''
        this.pc = {
          url: this.params.img_link_url || '',
          file: null
        }
        this.mobile = {
          url: this.params.img_link_mobile_url || '',
          file: null
        }
        this.actor1 = {
          name: this.params.actor1_name || '',
          url: this.params.img_actor1_url || '',
          file: null
        }
        this.actor2 = {
          name: this.params.actor2_name || '',
          url: this.params.img_actor2_url || '',
          file: null
        }
        this.actor3 = {
          name: this.params.actor3_name || '',
          url: this.params.img_actor3_url || '',
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
    link_url: (value) => { 
      value = value || ''
      return Validator.value(value).required()
    },
    title: (value) => { 
      value = value || ''
      return Validator.value(value).required() 
    },
    sub_title: (value) => { 
      value = value || ''
      return Validator.value(value).required() 
    }
  }
}
</script>

<style lang="less">

</style>