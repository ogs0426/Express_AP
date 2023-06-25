<template>
  <div id="schedulePage" class="page">
    <h2>편성표 관리</h2>
    <Form class="detail-form">
      <FormItem label="" class="with-upload">
        <input id="file" type="file" @change="changeFile">
        <label for="file">{{ $t('select.file') }}</label>
        <label>{{ file == null ? '' : file.name }}</label>
        <Button v-show="file != null" type="primary" @click="submit">{{ $t('button.apply') }}</Button>
      </FormItem>
      <FormItem label="">
        <Input v-model="displayResult" size="large" type="textarea" :rows="10"/>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import SimpleVueValidation from 'simple-vue-validator'
import * as ScheduleStore from '@/store/schedule'
const Validator = SimpleVueValidation.Validator

export default {
  data() {
    return {
      file: null
    }
  },
  computed: {
    ...ScheduleStore.mapState([
      'result'
    ]),
    displayResult() {
      return this.result != '' ? this.result + '\n입력완료' : ''
    }
  },
  methods: {
    ...ScheduleStore.mapMutations([
      'setResult'
    ]),
    ...ScheduleStore.mapActions([
      'uploadSchedule'
    ]),
    changeFile(e) {
      this.file = e.target.files[0];
      this.setResult('')
    },
    async submit() {
      const formData = new FormData()
      formData.append('file', this.file)

      const result = await this.uploadSchedule(formData)
    }
  }
}
</script>

<style lang="less">
#schedulePage {
  .ivu-form-item.with-upload {
    .ivu-form-item-content {
      input[type="file"] + label {
        display: inline-block;
      }

      > label, button {
        margin-right: 24px;
      }      
    }
  } 
}
</style>