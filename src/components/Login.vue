<template>
  <div class="login">
    <b-card id="login-form">
      <form>
        <h3>{{$t("login")}}</h3>
        <b-form-group>
            <label>{{$t("email")}}</label>
            <b-form-input id="mail" type="email" v-model="user.email" />
        </b-form-group>

        <b-form-group>
            <label>{{$t("password")}}</label>
            <b-form-input id="pwd" type="password" v-model="user.password" />
        </b-form-group>

        <b-button class="btn-block" @click="login(user)">Login</b-button>

        <p class="forgot-password text-center mt-2 mb-4">
            {{$t("signupPrompt")}} <router-link to="/signup">{{$t("signup")}}</router-link>
        </p>
      </form>
    </b-card>
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
      }
    }
  },
  methods: {
    ...mapActions(['login'])
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