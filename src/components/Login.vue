<template>
  <div class="login">
    <b-card id="login-form">
      <form>
        <h3>Login</h3>
        <b-form-group>
            <label>Email address</label>
            <b-form-input id="mail" type="email" v-model="user.email" />
        </b-form-group>

        <b-form-group>
            <label>Password</label>
            <b-form-input id="pwd" type="password" v-model="user.password" />
        </b-form-group>

        <b-button class="btn-block" @click="login">Login</b-button>

        <p class="forgot-password text-center mt-2 mb-4">
            Don't have an account? <router-link to="/signup">Sign up</router-link>
        </p>
      </form>
    </b-card>
  </div>
</template>

<script>

import axios from 'axios';

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
    login: function(event){
      axios.post('http://localhost:3000/auth/login', this.user)
      .then(res => {
        this.$router.push('dashboard')
      })
      .catch(err => alert('Authentication failed'))
    }
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