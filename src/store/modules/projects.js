import axios from 'axios';
import router from '@/router/index'

const state = {
};

const getters = {
};

const actions = {
  async postProject({dispatch}, user) {
    axios.post('projects', user)
    .then(res => {
      router.push('/dashboard')
    })
    .catch(err => {
      console.log(err)
      alert('Project creation failed')
    })
  },
};

const mutations = {
};

export default {
  state,
  getters,
  actions,
  mutations
};
