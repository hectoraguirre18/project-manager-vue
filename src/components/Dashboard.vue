<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">NavBar</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">

        <b-nav-item-dropdown text="Lang" right>
        <b-dropdown-item href="#">EN</b-dropdown-item>
        <b-dropdown-item href="#">ES</b-dropdown-item>
        <b-dropdown-item href="#">RU</b-dropdown-item>
        <b-dropdown-item href="#">FA</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown right>
        <template #button-content>
          <span>Account</span>
        </template>
        <b-dropdown-item href="#" @click="logout">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-table id="projectsTable"
      striped hover
      :items="projects"
      :fields="fields"
      tbody-tr-class="projectrow"
      @row-clicked="rowClicked"></b-table>
  </div>
</template>

<script>
import dateFormat from 'dateformat';
import axios from 'axios';
import {mapActions} from 'vuex';

export default {
  data() {
    return {
      fields: [
        {key: '_projectName', label: 'Name'},
        {key: '_projectDescription', label: 'Description'},
        {key: '_managerId', label: 'Manager'},
        {key: '_ownerId', label: 'Owner'},
        {key: '_teamIds', label: 'Members'},
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
      projects: [
        {
          _id: '1fajkfnkjwa',
          _projectName: 'Project1',
          _requestDate: Date(),
          _startDate: Date(),
          _projectDescription: 'My Project',
          _managerId: 'abc',
          _ownerId: '123',
          _teamIds: [],
        },
      ]
    }
  },
  methods: {
    ...mapActions(['logout']),
    rowClicked: function(event) {
      console.log('row')
    },
    loadProjects: function(event){
      axios.get('http://localhost:3000/projects')
      .then(res => {
        this.projects = res.data.objs.docs
      })
      .catch(err => console.error(err))
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