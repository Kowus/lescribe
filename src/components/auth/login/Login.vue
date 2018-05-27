<template>
  <div class="login">
    <h2>{{'auth.welcome' | translate}}</h2>
    <form v-model="user" name="login">
      <div class="form-group">
        <div class="input-group">
          <input type="text" id="email" required="required" v-model="user.username"/>
          <label class="control-label" for="email">{{'auth.email' | translate}}</label><i class="bar"></i>
        </div>
      </div>
      <div class="form-group">
        <div class="input-group">
          <input type="password" id="password" required="required" v-model="user.password"/>
          <label class="control-label" for="password">{{'auth.password' | translate}}</label><i class="bar"></i>
        </div>
      </div>
      <div class="d-flex flex-column flex-lg-row align-items-center justify-content-between down-container">
        <button class="btn btn-primary" @click="login()" type="button">
          {{'auth.login' | translate}}
        </button>
        <router-link class='link' :to="{name: 'Signup'}">{{'auth.createAccount' | translate}}</router-link>
      </div>
    </form>
  </div>
</template>

<script>
/* eslint-disable */
import moment from 'moment';
  export default {
    name: 'login',
    data(){
      return{
        user:{
          username: '',
          password: ''
        }
      }
    },
    methods:{
      login() {
            this.$http.post('/login', this.user)
              .then(res => {
                this.$auth.setToken(res.data.token, moment().add(6, "h"));
                if(this.$route.query.redirect){
                  this.$router.push(this.$route.query.redirect)
                }
                else
                  this.$router.push('/dashboard');
              }).catch(error => {
                console.error(error);

                /* this.showToast('Username or password incorrect', {
                icon: 'fa-star-o',
                position: 'top-right',
                duration: 10000,
                fullWidth: false
              }) */
            });
        }
    }
  }
</script>

<style lang="scss">
  @import '../../../sass/variables';
  @import '~bootstrap/scss/mixins/breakpoints';
  @import "~bootstrap/scss/functions";
  @import '~bootstrap/scss/variables';
  .login {
    @include media-breakpoint-down(md) {
      width: 100%;
      padding-right: 2rem;
      padding-left: 2rem;
      .down-container {
        .link {
          margin-top: 2rem;
        }
      }
    }

    h2 {
      text-align: center;
    }
    width: 21.375rem;

    .down-container {
      margin-top: 3.125rem;
    }
  }
</style>
