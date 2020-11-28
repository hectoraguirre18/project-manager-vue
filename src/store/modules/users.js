import axios from 'axios';
import router from '@/router/index'

const state = {
};

const getters = {
};

const actions = {
  async getUsers({dispatch}, user) {
    return axios.get('users')
    .then(res => res.data.objs.docs)
    .catch(err => {
      console.log(err);
      return null;
    })
  },
  async getUserName({dispatch}, id) {
    return axios.get(`users/id/${id}`)
    .then(res => res.data.objs._name)
    .catch(err => {
      console.log(err);
      return null;
    })
  }
};

const mutations = {
};

export default {
  state,
  getters,
  actions,
  mutations
};
