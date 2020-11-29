<template>
  <div id="login-form" class="login">
    <form>
      <h3>{{$t("login")}}</h3>
      <v-text-field :label="$t('email')" type="email" v-model="user.email"/>
      <v-text-field :label="$t('password')" type="password" v-model="user.password"/>

      <v-btn
        class="btn-block"
        @click="attemptLogin(user)"
        :loading="loading"
      >Login</v-btn>

      <p class="forgot-password text-center mt-2 mb-4">
          {{$t("signupPrompt")}} <router-link to="/signup">{{$t("signup")}}</router-link>
      </p>
    </form>
  </div>
</template>

<script>

import axios from 'axios';
import {mapGetters, mapActions} from 'vuex';

export default {
  name: 'Login',
  data () {
    return {
      user: {
        email: '',
        password: '',
      },
      loading: false
    }
  },
  methods: {
    ...mapActions(['login']),
    attemptLogin: function(user) {
      this.loading = true
      this.login(user)
      .then(res => this.loading = false)
    },
  }
}
</script>

<style scoped>

#login-form {
  position: fixed;
  width: 12cm;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

</style>