<template>
  <div id="loginPage">
    <img src="../../assets/images/example_logo_menu@2x.png" style="margin-left: -35px">
    <Form label-position="top" class="form">
      <FormItem>
        <div class="group">
          <input type="text" v-model="id" required>
          <span class="highlight"></span>
          <span class="bar"></span>
          <label>ID</label>
        </div>
      </FormItem>
      <FormItem>
        <div class="group">
          <input type="password" v-model="password" required @keyup.enter="submit">
          <span class="highlight"></span>
          <span class="bar"></span>
          <label>Password</label>
        </div>
      </FormItem>
      <FormItem>
        <Button class="submit_btn" @click.prevent="submit" size="large">LOG IN</Button>
      </FormItem>
    </Form>
    <Modal 
      :value="visible"
      :width="350"
      :closable="false"
      :mask-closable="false"
      :footer-hide="true">
      <p>{{ modalContent }}</p>
      <p style="display: flex; justify-content: flex-end; margin-top: 10px;">
        <Button type="primary" @click="visible = false">{{ $t('button.confirm') }}</Button>
      </p>
    </Modal>
  </div>
</template>

<script>
import _ from 'lodash'
import * as CommonStore from '@/store/common'

import SimpleVueValidation from 'simple-vue-validator'
const Validator = SimpleVueValidation.Validator

export default {
  name: 'login',
  components: {},
  data() {
    return {
      id: '',
      password: '',
      modalContent: '',
      visible: false
    }
  },
  computed: {
    ...CommonStore.mapState([
      'isLogin'
    ])
  },
  mounted() {
    console.log('# mounted! : ', this.$route.params.permissionDenied)
    const denied = this.$route.params.permissionDenied || false
    if (denied) showAlert(this.$t('login.expireInLogon'))
  },
  methods: {
    ...CommonStore.mapActions([
      'login'
    ]),
    async submit() {
      const isValid = await this.$validate()
      if (isValid) {
        const response = await this.login({ id: this.id, password: this.password })

        if (!response) {
          this.showAlert(this.$t('login.invalid'))
        }
      } else {
        this.showAlert(this.$t('login.invalid'))
      }
    },
    showAlert(message) {
      this.modalContent = message
      this.visible = true
    }
  },
  validators: {
    id: (value) => { 
      value = value || ''
      return Validator.value(value).required() 
    },
    password: (value) => {
      value = value || '' 
      return Validator.value(value).required() 
    }
  }
}
</script>

<style lang="less">
#loginPage {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .form {
    width: 36rem;
    height: 20rem;
    margin-top: 5rem;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .group {
      position: relative;
      margin: 20px 0;

      input {
        background: none;
        color: #000;
        font-size: 18px;
        padding: 10px 10px 10px 5px;
        display: block;
        border: none;
        border-radius: 0;
        border-bottom: 1px solid #000;
      }
      input:focus { outline: none }
      input:focus ~ label, input:valid ~ label {
        top: -14px;
        font-size: 12px;
        color: #FF4171;
      }
      input:focus ~ .bar:before {
        width: 100%;
      }

      input[type="password"] {
        letter-spacing: .3em;
      }

      label {
        color: #000;
        font-size: 20px;
        font-weight: normal;
        position: absolute;
        pointer-events: none;
        left: 5px;
        top: 10px;
        transition: 300ms ease all;
      }

      .bar {
        position: relative;
        display: block;
        width: 100%;
      }
      .bar:before {
        content: '';
        height: 2px;
        width: 0;
        bottom: 0px;
        position: absolute;
        background: #FF4171;
        transition: 300ms ease all;
        left: 0%;
      }
    }

    input, button {
      width: 33rem;
      background: #FF4171;
      color: #FFFFFF;
      border: none;
    }

    .ivu-form-item:last-child {
      margin-top: 24px;
      margin-bottom: 0;
    }
  }
}
</style>