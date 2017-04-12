// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import vueDragDrag from 'vue-dragdrag'
Vue.use(vueDragDrag)
// 在导出时调用

import './img/icon-font/iconfont.css'


/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
