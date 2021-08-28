import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
Vue.config.productionTip = false

new Vue({
  store: store,
  router,
  render: h => h(App),
}).$mount('#app')

/* eslint-disable vue/no-unused-components, no-unused-vars */


export let portions = {
  "h1":"1st Half",
  "h2":"2nd Half",
  "q1":"1st Quarter",
  "q2":"2nd Quarter",
  "q3":"3rd Quarter",
  "q4":"4th Quarter",
  "full" : "Full Juz",
  "current": "Current Juz"
}

/*
const fs = require('fs')
const packageJson = fs.readFileSync('./package.json')
export const version = JSON.parse(packageJson).version || 0
*/

