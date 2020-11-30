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
    return axios.post('auth/signup', user)
    .then(res => dispatch('login', {
      email: user.email,
      password: user.password
    }))
  },
  async login({commit}, user) {
    return axios.post('auth/login', user)
    .then(res => commit('setUser', {
        id: res.data.objs.id,
        email: user.email,
        token: res.data.objs.token
      }))
    .then(res => router.push({
      path: '/dashboard',
      query: router.app._route.query
    }))
  },
  async logout({commit}){
    await commit('logout');
    router.push({
      path: '/login',
      query: router.app._route.query
    })
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
