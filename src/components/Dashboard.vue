<template>
  <div>
    <Navbar/>
    <b-button variant="success" @click="onPressedNewProject">New Project</b-button>
    <b-table id="projectsTable"
      striped hover
      :items="projects"
      :fields="fields"
      tbody-tr-class="projectrow"
      @row-clicked="rowClicked">
    </b-table>
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
      projects: []
    }
  },
  methods: {
    ...mapActions(['logout', 'getProjects']),
    rowClicked: function(project) {
      this.$router.push(`/project/${project._id}`)
    },
    loadProjects: function(event){
      this.getProjects()
      .then(projects => this.projects = projects)
      .catch(err => console.error(err))
    },
    onPressedNewProject: function(event) {
      this.$router.push('/project/new')
    } 
  },
  beforeCreate: function() {
    document.body.className = 'home';
  },
  created: function() {
    this.loadProjects()
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