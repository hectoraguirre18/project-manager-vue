<template>
  <div>
    <Navbar/>
    <b-button variant="success" @click="onPressedNewProject">New Project</b-button>
    <b-table id="projectsTable"
      striped hover
      :items="dashboard.docs"
      :fields="fields"
      v-if="dashboard != null"
      tbody-tr-class="projectrow"
      @row-clicked="rowClicked">
    </b-table>
    <b-pagination-nav
      v-if="dashboard != null"
      :link-gen="linkGen"
      :number-of-pages="dashboard.totalPages"
      use-router
    ></b-pagination-nav>
  </div>
</template>

<script>
import dateFormat from 'dateformat';
import axios from 'axios';
import {mapActions} from 'vuex';
import async from 'async';

import Navbar from './Navbar'


export default {
  components: {
    Navbar
  },
  data() {
    return {
      fields: [
        {key: '_projectName', label: 'Name'},
        {key: '_projectDescription', label: 'Description'},
        {key: 'managerName', label: 'Manager'},
        {key: 'ownerName', label: 'Owner'},
        {
          key: 'teamNames',
          label: 'Members',
          formatter: val => val.reduce((acc, value) => `${acc}, ${value}`)
        },
        {
          key: '_requestDate',
          label: 'Requested on', 
          formatter: val => dateFormat(val, "mmmm d, yyyy")
        },
        {
          key: '_startDate',
          label: 'Started on', 
          formatter: val => dateFormat(val, "mmmm d, yyyy")
        },
      ],
      dashboard: null
    }
  },
  methods: {
    ...mapActions(['logout', 'getDashboard']),
    rowClicked: function(project) {
      this.$router.push(`/project/${project._id}`)
    },
    loadProjects: function(page){
      this.getDashboard(page)
      .then(dashboard => this.dashboard = dashboard)
      .catch(err => console.error(err))
    },
    onPressedNewProject: function(event) {
      this.$router.push('/project/new')
    },
    linkGen(pageNum) {
      return pageNum === 1 ? '?' : `?page=${pageNum}`
    }
  },
  beforeCreate: function() {
    document.body.className = 'home';
  },
  created: function() {
    this.loadProjects(this.$route.query.page)
  },
  watch: {
    $route (to, from) {
      this.loadProjects(to.query.page)
    }
  }
}
</script>

<style scoped>
#projectsTable {
  margin: 1%;
  width: 98%;
  background-color: white !important;
}

#projectsTable >>> .projectrow {
  cursor: pointer;
}
</style>