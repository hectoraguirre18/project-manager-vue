<template>
  <div>
    <Navbar/>
    <v-data-table
      :headers="headers"
      :items="dashboard.docs"
      v-if="dashboard != null"
      :loading="loading"
      :options.sync="options"
      :server-items-length="dashboard.totalDocs"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{$t("dashboard.title")}}</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="onPressedNewProject"
          >
            {{$t("dashboard.new")}}
          </v-btn>
          <v-dialog v-model="dialogDelete" width="unset">
            <v-card>
              <v-card-title class="headline">{{$t("dashboard.deletePrompt")}}</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.edit="{item}">
        <v-btn
        @click="editClicked(item)">
          {{$t("dashboard.edit")}}
        </v-btn>
      </template>
      <template v-slot:item.delete="{item}">
        <v-icon
          @click="deleteItem(item)"
        >mdi-delete</v-icon>
      </template>
    </v-data-table>
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
      dashboard: {
        docs: []
      },
      loading: true,
      options: {},
      dialog: false,
      dialogDelete: false,
      deletingIndex: null,
    }
  },
  methods: {
    ...mapActions(['logout', 'getDashboard']),
    rowClicked: function(project) {
      this.$router.push(`/project/${project._id}`)
    },
    editClicked: function(item) {
      const index = this.dashboard.docs.indexOf(item)
      const id = this.dashboard.docs[index]._id
      this.$router.push(`/project/edit/${id}`)
    },
    loadProjects: function(page){
      this.loading = true;
      this.getDashboard(page)
      .then(dashboard => {
        this.loading = false;
        this.dashboard = dashboard;
      })
      .catch(err => console.error(err))
    },
    onPressedNewProject: function(event) {
      this.$router.push('/project/new')
    },
    linkGen(pageNum) {
      return pageNum === 1 ? '?' : `?page=${pageNum}`
    },
    deleteItem (item) {
      this.deletingIndex = this.dashboard.docs.indexOf(item)
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      this.dashboard.docs.splice(this.deletingIndex, 1)
      this.closeDelete()
    },
    closeDelete() {
      this.dialogDelete = false;
    },
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
    },
    headers() {
      return [
        {value: '_projectName', text: this.$t('dashboard.name'), class: 'align-middle'},
        {value: '_projectDescription', text: this.$t('dashboard.description'), class: 'align-middle'},
        {value: 'managerName', text: this.$t('dashboard.manager'), class: 'align-middle'},
        {value: 'ownerName', text: this.$t('dashboard.owner'), class: 'align-middle'},
        {
          value: 'teamNames',
          text: this.$t('dashboard.members'),
          formatter: val => val.reduce((acc, value) => `${acc}, ${value}`),
          class: 'align-middle'
        },
        {
          value: '_requestDate',
          text: this.$t('dashboard.requestDate'), 
          formatter: val => dateFormat(val, "mmmm d, yyyy"),
          class: 'text-center align-middle'
        },
        {
          value: '_startDate',
          text: this.$t('dashboard.startDate'), 
          formatter: val => val ? dateFormat(val, "mmmm d, yyyy") : '-',
          class: 'text-center align-middle'
        },
        {value: 'edit', text:'', class: 'text-right align-middle', sortable: false},
        {value: 'delete', text:'', class: 'text-right align-middle', sortable: false},
      ];
    }
  },
  beforeCreate: function() {
    document.body.className = 'home';
  },
  mounted: function() {
    this.loadProjects(this.$route.query.page)
  },
  watch: {
    $route (to, from) {
      this.loadProjects(to.query.page)
    },
    options: {
      handler() {
        this.loadProjects(this.$route.query.page)
      },
      deep: true,
    },
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    }
  }
}
</script>