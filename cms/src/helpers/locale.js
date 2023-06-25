import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: "ko",
  messages: {
    en: Object.assign(require("./i18n/common_en.json")),
    ko: Object.assign(require("./i18n/common_ko.json"))
  }
})