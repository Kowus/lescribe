// Polyfills
import 'es6-promise/auto';
import 'babel-polyfill';

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VeeValidate from 'vee-validate';
import Auth from './plugins/auth';
import App from './App';
import store from './store';
import router from './router';
import { sync } from 'vuex-router-sync';
import VuesticPlugin from 'vuestic-theme/vuestic-plugin';
import './i18n';
import YmapPlugin from 'vue-yandex-maps';

Vue.use(VuesticPlugin);
Vue.use(YmapPlugin);
Vue.use(VueAxios, axios);
Vue.use(Auth);
Vue.axios.defaults.baseURL = process.env.API;
Vue.axios.interceptors.request.use(
  function(config) {
    store.commit('setLoading', true);
    // Do something before request is sent
    let token = Vue.auth.getToken();
    if (token) {
      config.headers.common['Authorization'] = `Bearer ${token}`;
    }
    console.log(config);
    return config;
  },
  function(error) {
    // Do something with request error
    store.commit('setLoading', false);
    return Promise.reject(error);
  }
);
Vue.axios.interceptors.response.use(
  function(response) {
    store.commit('setLoading', false);
    return response;
  },
  function(error) {
    // Do something with response error
    store.commit('setLoading', false);
    return Promise.reject(error);
  }
);
// NOTE: workaround for VeeValidate + vuetable-2
Vue.use(VeeValidate, { fieldsBagName: 'formFields' });

sync(store, router);

let mediaHandler = () => {
  if (window.matchMedia(store.getters.config.windowMatchSizeLg).matches) {
    store.dispatch('toggleSidebar', true);
  } else {
    store.dispatch('toggleSidebar', false);
  }
};

router.beforeEach((to, from, next) => {
  store.commit('setLoading', true);
  if (to.matched.some(record => record.meta.guest) && Vue.auth.loggedIn()) {
    next({ path: '/dashboard' });
  } else if (
    to.matched.some(record => record.meta.auth) &&
    !Vue.auth.loggedIn()
  ) {
    next({
      path: '/auth/login',
      query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
  // next();
});

router.afterEach((to, from) => {
  mediaHandler();
  store.commit('setLoading', false);
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
