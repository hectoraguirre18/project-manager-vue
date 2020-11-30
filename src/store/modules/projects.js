import axios from 'axios';
import router from '@/router/index'
import async from 'async'

const state = {
};

const getters = {
};

const actions = {
  async getDashboard({dispatch}, options) {
    return axios.get('projects', {
      params: options
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
  async getProjectById({dispatch}, id) {
    return axios.get(`projects/id/${id}`)
    .then(res => res.data.objs)
    .catch(err => {
      console.log(err)
      alert('Project fetching failed')
    })
  },
  async updateProject({dispatch}, options) {
    axios.put(`projects/${options.id}`, options.project)
    .then(res => {
      router.push('/dashboard')
    })
    .catch(err => {
      console.log(err)
      alert('Project updating failed')
    })
  },
  async postProject({dispatch}, project) {
    axios.post('projects', project)
    .then(res => {
      router.push('/dashboard')
    })
    .catch(err => {
      console.log(err)
      alert('Project creation failed')
    })
  },
  async deleteProject({dispatch}, id) {
    return axios.delete(`projects/${id}`)
    .then(res => res.data)
    .catch(err => {
      console.log(err)
      alert('Project deleting failed')
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
