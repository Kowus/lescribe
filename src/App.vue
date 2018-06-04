<template>
  <div id="app" class="app">
    <layout v-if="!isAuth"/>
    <!-- <auth-layout v-else></auth-layout> -->
    <router-view v-else/>>
  </div>
</template>

<script>
/* eslint-disable */
  import Layout from 'components/layout/Layout'
  import AuthLayout from 'components/layout/AuthLayout'
  import VuesticPreLoader from 'vuestic-components/vuestic-preloader/VuesticPreLoader.vue'

  export default {
    name: 'app',
    components: {
      VuesticPreLoader,
      AuthLayout,
      Layout
    },
    created(){
      this.getCurrentUser()
    },
    computed: {
      isAuth () {
        return this.$route.path.match('auth')
      }
    },
    methods: {

      getCurrentUser(){
        if(this.$auth.loggedIn()){
          this.$http
          .get('/user/me')
          .then(res => {
            this.$store.commit('setCurrentUser', res.data);
          })
          .catch(res => {
            this.$store.commit('clearCurrentUser');
          });
      }
      else {
        this.$store.commit('clearCurrentUser');
      }
      }
    },
    watch:{
      $route: 'getCurrentUser'
    }
  }
</script>

<style lang="scss">
  @import "sass/main";

  body {
    height: 100%;
    #app {
      height: 100%;
    }
  }
</style>
