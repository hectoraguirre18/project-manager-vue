<template>
  <div id="login-form" class="login">
    <validation-observer
      ref="observer"
      v-slot="{ invalid }"
    >
    <v-container>
      <v-row justify="center">
        <v-img
          :src="logo"
          max-width="75%"
        ></v-img>
      </v-row>
    </v-container>
    <form @submit.prevent="submit">
      <h3>{{$t("login")}}</h3>
      <validation-provider
        v-slot="{ errors }"
        rules="required|email"
      >
        <v-text-field
          :label="$t('email')"
          type="email"
          v-model="user.email"
          required
          :error-messages="errors"
        />
      </validation-provider>
      <validation-provider
        v-slot="{ errors }"
        rules="required"
      >
        <v-text-field
          :label="$t('password')"
          type="password"
          v-model="user.password"
          required
          :error-messages="errors"
          @submit="attemptLogin(user)"
        />
      </validation-provider>

      <v-btn
        class="btn-block"
        @click="attemptLogin(user)"
        :loading="loading"
        type="submit"
        :disabled="invalid"
      >Login</v-btn>

      <p class="forgot-password text-center mt-2 mb-4">
          {{$t("signupPrompt")}} <router-link to="/signup">{{$t("signup")}}</router-link>
      </p>
    </form>
    </validation-observer>
  </div>
</template>

<script>

import axios from 'axios';
import {mapGetters, mapActions} from 'vuex';
import image from '../assets/images/logo.png';

import { required, digits, email, max, regex } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'

setInteractionMode('eager')

extend('required', {
  ...required,
  message: 'This field can not be empty'
})

extend('email', {
  ...email,
  message: 'This email is invalid'
})

export default {
  name: 'Login',
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data () {
    return {
      user: {
        email: '',
        password: '',
      },
      loading: false,
      logo: image,
    }
  },
  methods: {
    ...mapActions(['login']),
    attemptLogin: function(user) {
      this.loading = true
      this.login(user)
      .then(res => this.loading = false)
    },
    submit () {
      this.$refs.observer.validate()
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