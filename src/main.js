// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue/dist/bootstrap-vue.esm';
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import VueI18n from 'vue-i18n'
import vuetify from '@/plugins/vuetify'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import './assets/css/style.css'

import locale_en from './locales/en'
import locale_es from './locales/es'

axios.defaults.baseURL = 'http://54.89.103.209/'
axios.interceptors.request.use(
  function(config) {
    const token = store.getters.token;
    if(token != null) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
)

Vue.config.productionTip = false
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'en',
  messages: {en: locale_en, es: locale_es}
})

new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
  i18n,
  vuetify
})

export { i18n };