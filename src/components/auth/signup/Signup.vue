<template>
  <div class="signup">
    <h2>{{'auth.createNewAccount' | translate}}</h2>
    <form name="signup" v-model="user">
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
      <vuestic-checkbox
        :id="'checkbox1'"
        v-model="checkboxOneModel">
        <template slot="label">{{'auth.agree' | translate}}
          <router-link to="">{{'auth.termsOfUse' | translate}}</router-link>
        </template>
      </vuestic-checkbox>
      <div class="d-flex flex-column flex-lg-row align-items-center justify-content-between down-container">
        <button class="btn btn-primary" type="submit">
          {{'auth.signUp' | translate}}
        </button>
        <router-link class='link' :to="{name: 'Login'}">{{'auth.alreadyJoined' | translate}}</router-link>
      </div>
    </form>
  </div>
</template>

<script>
/* eslint-disable */
  export default {
    name: 'signup',
    data () {
      return {
        checkboxOneModel: true,
        user:{
          username: '',
          password: ''
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '../../../sass/variables';
  @import '~bootstrap/scss/mixins/breakpoints';
  @import "~bootstrap/scss/functions";
  @import '~bootstrap/scss/variables';

  .signup {
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
      margin-top: 2.6875rem;
    }
  }
</style>
