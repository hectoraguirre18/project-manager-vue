import axios from 'axios';
import router from '@/router/index'
import async from 'async'

const state = {
};

const getters = {
};

const actions = {
  async getDashboard({dispatch}, page) {
    console.log('page', page)
    return axios.get('projects', {
      params: {
        page: page
      }
    })
    .then(async res => {
      return {
        ...res.data.objs,
        docs: await async.parallel(res.data.objs.docs.map(project => function(callback) {
          dispatch('addNamesToProject', project).then(res => callback(null, res))
        }))
      }
    })
  },
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
  async addNamesToProject({dispatch},project) {
    return async.parallel({
      managerName: function(callback) {
        dispatch('getUserName', project._managerId)
        .then(res => callback(null, res))
      },
      ownerName: function(callback) {
        dispatch('getUserName', project._ownerId)
        .then(res => callback(null, res))
      },
      teamNames: function(cb) {
        async.parallel(project._teamIds.map(id => function(callback) {
          dispatch('getUserName', id).then(res => callback(null, res))
        }))
        .then(names => cb(null, names))
      },
    })
    .then(res => {
      return {...project, ...res}
    })
    .catch(err => {
      console.log(err)
      return project
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
