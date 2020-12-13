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
export function DefaultNewLesson() {
  return {
    page: 1,
    juz: 1,
    mistakes: 0,
    assigned: false,
    completed: false,
  };
}

export function DefaultCurrentLesson() {
  return {
    portion: "current",
    assigned: false,
    recited: false
  };
}

export function DefaultRevision() {
  return {
    juz: 1,
    mistakes: 0,
  };
}


