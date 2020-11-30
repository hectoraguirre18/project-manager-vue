<template>
  <div>
    <Navbar/>
    <v-data-table
      class="row-pointer mt-2"
      :headers="headers"
      :items="dashboard.docs"
      v-if="dashboard != null"
      :loading="loading"
      :options.sync="pageOptions"
      :server-items-length="dashboard.totalDocs"
      disable-sort
      @click:row="rowClicked"
      :footer-props="{
        'items-per-page-options': [10]
      }"
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
      <template v-slot:item._requestDate="{item}">
        {{formatDate(item._requestDate)}}
      </template>
      <template v-slot:item._startDate="{item}">
        {{formatDate(item._startDate)}}
      </template>
      <template v-slot:item.teamNames="{item}">
        {{formatArray(item.teamNames)}}
      </template>
      <template v-slot:item.edit="{item}">
        <v-btn
        @click.stop="editClicked(item)">
          {{$t("dashboard.edit")}}
        </v-btn>
      </template>
      <template v-slot:item.delete="{item}">
        <v-icon
          @click.stop="deleteItem(item)"
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
import {i18n} from '../main'

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
      pageOptions: {},
      dialog: false,
      dialogDelete: false,
      deletingId: null,
    }
  },
  methods: {
    ...mapActions(['logout', 'getDashboard', 'deleteProject']),
    rowClicked: function(project) {
      this.$router.push({
        path: `/project/${project._id}`,
        query: this.$route.query
      })
    },
    editClicked: function(item) {
      const index = this.dashboard.docs.indexOf(item)
      const id = this.dashboard.docs[index]._id
      this.$router.push({
        path: `/project/edit/${id}`,
        query: this.$route.query
      })
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
      this.$router.push({
        path: '/project/new',
        query: this.$route.query
      })
    },
    deleteItem (item) {
      this.deletingId = item._id
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      this.deleteProject(this.deletingId)
      .then(res => {
        this.closeDelete()
        this.loadProjects(this.pageOptions)
      })
    },
    closeDelete() {
      this.deletingId = null
      this.dialogDelete = false;
    },
    formatDate(date) {
      if(date)
        return dateFormat(date, "mmmm d, yyyy")
      else
        return '-'
    },
    formatArray(array) {
      if(array && array.length > 0)
        return array.reduce((prev, current) => `${prev}, ${current}`)
      else
        return '-'
    },
  },
  computed: {
    locale() {
      return i18n.locale
    },
    headers() {
      return [
        {value: '_projectName', text: this.$t('dashboard.name'), class: 'align-middle'},
        {value: '_projectDescription', text: this.$t('dashboard.description'), class: 'align-middle'},
        {
          value: 'managerName',
          text: this.$t('dashboard.manager'),
          class: 'align-middle',
          align: 'center'
        },
        {
          value: 'ownerName',
          text: this.$t('dashboard.owner'),
          class: 'align-middle',
          align: 'center'
        },
        {
          value: 'teamNames',
          text: this.$t('dashboard.members'),
          class: 'align-middle',
          align: 'center'
        },
        {
          value: '_requestDate',
          text: this.$t('dashboard.requestDate'), 
          class: 'text-center align-middle',
          align: 'center'
        },
        {
          value: '_startDate',
          text: this.$t('dashboard.startDate'), 
          class: 'text-center align-middle',
          align: 'center'
        },
        {value: 'edit', text:'', class: 'text-right align-middle', sortable: false},
        {value: 'delete', text:'', class: 'text-right align-middle', sortable: false},
      ];
    },
  },
  mounted: function() {
    dateFormat.i18n = this.$t('i18n');
    this.loadProjects(this.pageOptions)
  },
  watch: {
    locale(val) {
      dateFormat.i18n = this.$t('i18n');
    },
    pageOptions: {
      handler() {
        const options = {
          page: this.pageOptions.page,
          limit: this.pageOptions.itemsPerPage
        };
        this.loadProjects(options)
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

<style scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>