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
        <b-button @click="editClicked(data.index)">{{$t("dashboard.edit")}}</b-button>
      </template>
      <template #head(edit)="data">
        <b-button @click="onPressedNewProject" variant="success">{{$t("dashboard.new")}}</b-button>
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
  computed: {
    fields() {
      return [
        {key: '_projectName', label: this.$t('dashboard.edit'), class: 'align-middle'},
        {key: '_projectDescription', label: this.$t('dashboard.description'), class: 'align-middle'},
        {key: 'managerName', label: this.$t('dashboard.manager'), class: 'align-middle'},
        {key: 'ownerName', label: this.$t('dashboard.owner'), class: 'align-middle'},
        {
          key: 'teamNames',
          label: this.$t('dashboard.members'),
          formatter: val => val.reduce((acc, value) => `${acc}, ${value}`),
          class: 'align-middle'
        },
        {
          key: '_requestDate',
          label: this.$t('dashboard.requestDate'), 
          formatter: val => dateFormat(val, "mmmm d, yyyy"),
          class: 'text-center align-middle'
        },
        {
          key: '_startDate',
          label: this.$t('dashboard.startDate'), 
          formatter: val => val ? dateFormat(val, "mmmm d, yyyy") : '-',
          class: 'text-center align-middle'
        },
        {key: 'edit', class: 'text-right align-middle'},
      ];
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