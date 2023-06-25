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
      <FormItem label="채널 이름" :class="{error: validation.hasError('name')}">
        <Input v-model="name"/>
        <label>{{ validation.firstError('name') }}</label>
      </FormItem>
      <FormItem label="채널 번호" :class="{error: validation.hasError('number')}">
        <Input v-model="number" type="number"/>
        <label>{{ validation.firstError('number') }}</label>
      </FormItem>
      <!-- <FormItem label="이미지" :class="['with-upload','between']">
        <input id="file_channel" type="file" @change="changeFile(channel, $event)">
        <label for="file_channel">{{ $t('select.image_file') }}</label>
        <img v-show="channel.url" :src="channel.url" style="background-color: #000">
      </FormItem> -->
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
import * as ChannelStore from '@/store/channel'

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
      name: '',
      number: '',
      channel: {
        url: '',
        file: null
      },
    }
  },
  computed: {
    modalTitle() {
      return this.type === 'create' ? '채널추가' : '채널편집'
    }
  },
  methods: {
    ...ChannelStore.mapActions([
      'createChannel',
      'updateChannel'
    ]),
    async submit() {
      const isValid = await this.$validate()
      if (isValid) {
        let result = true

        const formData = new FormData()
        formData.append('order', this.order)
        formData.append('name', this.name)
        formData.append('number', this.number)
        formData.append('img_channel_url', this.channel.file)

        if (this.type === 'create') {
          result = await this.createChannel(formData)
        } else {
          result = await this.updateChannel({
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
        this.name = this.params.name || ''
        this.number = this.params.number || ''
        this.channel = {
          url: this.params.img_channel_url || '',
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
    name: (value) => { 
      value = value || ''
      return Validator.value(value).required() 
    },
    number: (value) => { 
      value = value || ''
      return Validator.value(value).required() 
    }
  }
}
</script>

<style lang="less">

</style>