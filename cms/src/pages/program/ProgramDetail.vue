<template>
  <Modal 
    :title="modalTitle"
    :value="visible"
    :closable="false"
    :mask-closable="false"
    @on-visible-change="initData"
    class="detail-modal">
    <Form :label-width="150" label-position="left" class="detail-form">
      <FormItem label="출력 순서" :class="{error: validation.hasError('order')}">
        <Input v-model="order" type="number"/>
        <label>{{ validation.firstError('order') }}</label>
      </FormItem>
      <FormItem label="프로그램 제목" :class="{error: validation.hasError('title')}">
        <Input v-model="title"/>
        <label>{{ validation.firstError('title') }}</label>
      </FormItem>
      <FormItem label="내용" :class="{error: validation.hasError('contents')}">
        <Input v-model="contents" type="textarea"/>
        <label>{{ validation.firstError('contents') }}</label>
      </FormItem>
      <FormItem label="타입" :class="{error: validation.hasError('genre')}">
        <Input v-model="genre" type="text"/>
        <label>{{ validation.firstError('genre') }}</label>
      </FormItem>
      <FormItem label="이미지" :class="['with-upload','between']">
        <input id="file_program" type="file" @change="changeFile(program, $event)">
        <label for="file_program">{{ $t('select.image_file') }}</label>
        <img v-show="program.url" :src="program.url" style="background-color: #000">
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
import * as ProgramStore from '@/store/program'

const Validator = SimpleVueValidation.Validator

export default {
  props: [
    'visible',
    'params',
    'type'
  ],
  data() {
    return {
      order: '',
      title: '',
      contents: '',
      genre: '',
      program: {
        url: '',
        file: null
      },
    }
  },
  computed: {
    modalTitle() {
      return this.type === 'create' ? '프로그램추가' : '프로그램편집'
    }
  },
  methods: {
    ...ProgramStore.mapActions([
      'createProgram',
      'updateProgram'
    ]),
    async submit() {
      const isValid = await this.$validate()
      if (isValid) {
        let result = true

        const formData = new FormData()
        formData.append('order', this.order)
        formData.append('title', this.title)
        formData.append('genre', this.genre)
        formData.append('contents', this.contents)
        formData.append('img_program_url', this.program.file)

        if (this.type === 'create') {
          result = await this.createProgram(formData)
        } else {
          result = await this.updateProgram({
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
        this.order = this.params.order || ''
        this.title = this.params.title || ''
        this.number = this.params.number || ''
        this.genre = this.params.genre || ''
        this.contents = this.params.contents || ''
        this.program = {
          url: this.params.img_program_url || '',
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
    order: (value) => { 
      value = value || ''
      return Validator.value(value).integer().greaterThan(0).required()
    },
    title: (value) => { 
      value = value || ''
      return Validator.value(value).required() 
    },
    contents: (value) => { 
      value = value || ''
      return Validator.value(value).required() 
    }
  }
}
</script>

<style lang="less">

</style>