<template>
  <Modal 
    :title="modalTitle"
    :value="visible"
    :closable="false"
    :mask-closable="false"
    @on-visible-change="initData"
    :width="800"
    class="detail-modal split">
    <Form label-position="top" class="detail-form" style="width: calc(60% - 12px)">
      <FormItem label="타입" :class="{error: validation.hasError('board_type')}">
        <Select v-model="board_type">
          <Option v-for="item in boardTypeList" :value="item.value" :key="item.value">
            {{ item.label }}
          </Option>
        </Select>
        <label>{{ validation.firstError('board_type') }}</label>
      </FormItem>
      <FormItem label="제목" :class="{error: validation.hasError('title')}">
        <Input v-model="title"/>
        <label>{{ validation.firstError('title') }}</label>
      </FormItem>
      <FormItem label="내용" :class="{error: validation.hasError('content')}">
        <Input v-model="content" type="textarea" :rows="12"/>
        <label>{{ validation.firstError('content') }}</label>
      </FormItem>
      <FormItem label="게시글 상단고정">
        <i-switch v-model="top_fix" size="large">
          <span slot="open">Yes</span>
          <span slot="close">No</span>
        </i-switch>
      </FormItem>
      <FormItem label="이미지 하단노출">
        <i-switch v-model="bottom_img" size="large">
          <span slot="open">Yes</span>
          <span slot="close">No</span>
        </i-switch>
      </FormItem>
    </Form>
    <Form label-position="top" class="detail-form" style="width: calc(40% - 12px)">
      <FormItem label="이미지 1" :class="['with-upload','between']">
        <input id="image1" type="file" @change="changeImgFile(image1, $event)">
        <label for="image1">{{ $t('select.image_file') }}</label>
        <img v-show="image1.url" :src="image1.url">
      </FormItem>
      <FormItem label="이미지 2" :class="['with-upload','between']">
        <input id="image2" type="file" @change="changeImgFile(image2, $event)">
        <label for="image2">{{ $t('select.image_file') }}</label>
        <img v-show="image2.url" :src="image2.url">
      </FormItem>
      <FormItem label="이미지 3" :class="['with-upload','between']">
        <input id="image3" type="file" @change="changeImgFile(image3, $event)">
        <label for="image3">{{ $t('select.image_file') }}</label>
        <img v-show="image3.url" :src="image3.url">
      </FormItem>
      <FormItem label="첨부파일 1" :class="['with-upload','between']">
        <input id="file1" type="file" @change="changeFile(file1, $event)">
        <label for="file1">{{ $t('select.file') }}</label>
        <label class="filename" @click="downloadFile(file1.name)">{{ file1.name }}</label>
      </FormItem>
      <FormItem label="첨부파일 2" :class="['with-upload','between']">
        <input id="file2" type="file" @change="changeFile(file2, $event)">
        <label for="file2">{{ $t('select.file') }}</label>
        <label class="filename" @click="downloadFile(file2.name)">{{ file2.name }}</label>
      </FormItem>
      <FormItem label="첨부파일 3" :class="['with-upload','between']">
        <input id="file3" type="file" @change="changeFile(file3, $event)">
        <label for="file3">{{ $t('select.file') }}</label>
        <label class="filename" @click="downloadFile(file3.name)">{{ file3.name }}</label>
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
import * as BoardStore from '@/store/board'

import SimpleVueValidation from 'simple-vue-validator'
const Validator = SimpleVueValidation.Validator

export default {
  props: [
    'visible',
    'params',
    'type',
    'boardTypeList'
  ],
  data() {
    return {
      board_type: '',
      top_fix: false,
      bottom_img: false,
      title: '',
      content: '',
      image1: { url: '', file: null },
      image2: { url: '', file: null },
      image3: { url: '', file: null },
      file1: { name: '', file: null },
      file2: { name: '', file: null },
      file3: { name: '', file: null }
    }
  },
  computed: {
    modalTitle() {
      return this.type === 'create' ? '게시글 추가' : '게시글 편집'
    }
  },
  methods: {
    ...BoardStore.mapActions([
      'createBoard',
      'updateBoard',
      'downloadAttachedFile'
    ]),
    async submit() {
      const isValid = await this.$validate()
      if (isValid) {
        let result = true

        const formData = new FormData()
        formData.append('board_type', this.board_type)
        formData.append('top_fix', this.top_fix)
        formData.append('bottom_img', this.bottom_img)
        formData.append('title', this.title)
        formData.append('content', this.content)

        formData.append('img_url1', this.image1.file)
        formData.append('img_url2', this.image2.file)
        formData.append('img_url3', this.image3.file)

        formData.append('file1', this.file1.file)
        formData.append('file2', this.file2.file)
        formData.append('file3', this.file3.file)

        if (this.type === 'create') {
          result = await this.createBoard(formData)
        } else {
          result = await this.updateBoard({
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
        this.board_type = this.params.board_type || ''
        this.top_fix = this.params.top_fix || false
        this.bottom_img = this.params.bottom_img || false
        this.title = this.params.title || ''
        this.content = this.params.content || ''

        this.image1 = {
          url: this.params.img_url1 || '',
          file: null
        }
        this.image2 = {
          url: this.params.img_url2 || '',
          file: null
        }
        this.image3 = {
          url: this.params.img_url3 || '',
          file: null
        }
        this.file1 = {
          name: this.params.file1 || '',
          file: null
        }
        this.file2 = {
          name: this.params.file2 || '',
          file: null
        }
        this.file3 = {
          name: this.params.file3 || '',
          file: null
        }
      }
    },
    async downloadFile(fileName) {
      if (this.type !== 'create') {
        await this.downloadAttachedFile(fileName)
      }
    },
    changeImgFile(obj, e) {
      if (obj.file) {
        URL.revokeObjectURL(obj.file)
      }

      obj.file = e.target.files[0]
      obj.url = URL.createObjectURL(obj.file)
    },
    changeFile(obj, e) {
      obj.file = e.target.files[0]
      obj.name = obj.file.name
    }
  },
  validators: {
    board_type: (value) => { 
      value = value || ''
      return Validator.value(value).required() 
    },
    title: (value) => { 
      value = value || ''
      return Validator.value(value).required() 
    },
    content: (value) => { 
      value = value || ''
      return Validator.value(value).required() 
    }
  }
}
</script>