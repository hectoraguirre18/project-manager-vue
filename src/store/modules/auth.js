import axios from 'axios';
import router from '@/router/index'

const state = {
  user: null
};

const getters = {
  isAuthenticated: state => (state.user != null),
  token: state => state.user != null ? state.user.token : null,
  email: state => state.user != null ? state.user.email : null,
  user: state => state.user,
};

const actions = {
  async signup({dispatch}, user) {
    axios.post('auth/signup', user)
    .then(res => dispatch('login', {
      email: user.email,
      password: user.password
    }))
    .catch(err => {
      console.log(err)
      alert('Signup failed')
    })
  },
  async login({commit}, user) {
    axios.post('auth/login', user)
    .then(res => commit('setUser', {
        email: user.email,
        token: res.data.objs
      }))
    .then(res => router.push('/dashboard'))
    .catch(err => {
      console.log(err)
      alert('Authentication failed')
    })
  },
  async logout({commit}){
    await commit('logout');
    router.push('/login');
  }
};

const mutations = {
  setUser(state, user){
    state.user = user
  },
  logout(state){
    state.user = null
  },
};

export default {
  state,
  getters,
  actions,
  mutations
};
