<template>
  <div>
    <Navbar/>
    <b-table id="projectsTable"
      striped hover
      :items="dashboard.docs"
      :fields="fields"
      v-if="dashboard != null"
      tbody-tr-class="projectrow"
      @row-clicked="rowClicked">
      <template #cell(edit)="data">
        <b-button @click="editClicked(data.index)">Edit</b-button>
      </template>
      <template #head(edit)="data">
        <b-button @click="onPressedNewProject" variant="success">New</b-button>
      </template>
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
        {key: '_projectName', label: 'Name', class: 'align-middle'},
        {key: '_projectDescription', label: 'Description', class: 'align-middle'},
        {key: 'managerName', label: 'Manager', class: 'align-middle'},
        {key: 'ownerName', label: 'Owner', class: 'align-middle'},
        {
          key: 'teamNames',
          label: 'Members',
          formatter: val => val.reduce((acc, value) => `${acc}, ${value}`),
          class: 'align-middle'
        },
        {
          key: '_requestDate',
          label: 'Requested on', 
          formatter: val => dateFormat(val, "mmmm d, yyyy"),
          class: 'text-center align-middle'
        },
        {
          key: '_startDate',
          label: 'Started on', 
          formatter: val => val ? dateFormat(val, "mmmm d, yyyy") : '-',
          class: 'text-center align-middle'
        },
        {key: 'edit', label: '', class: 'text-right align-middle'},
      ],
      dashboard: null
    }
  },
  methods: {
    ...mapActions(['logout', 'getDashboard']),
    rowClicked: function(project) {
      this.$router.push(`/project/${project._id}`)
    },
    editClicked: function(index) {
      const id = this.dashboard.docs[index]._id
      this.$router.push(`/project/edit/${id}`)
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