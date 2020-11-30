<template>
  <div>
    <Navbar/>
    <form id="projectform">
      <h3>{{ editing ? $t("projectForm.title.edit") : $t("projectForm.title.new") }}</h3>
      <v-text-field :label="$t('projectForm.name')" type="email" v-model="project.projectName"/>
      <v-text-field :label="$t('projectForm.description')" type="email" v-model="project.projectDescription"/>
      
      <!-- <b-form-group>
        <label>{{$t("projectForm.requestDate")}}</label>
        <b-form-datepicker id="pfreqdate" v-model="project.requestDate"/>
      </b-form-group> -->

      <v-menu
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="formattedDate"
            :label="$t('projectForm.requestDate')"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="project.requestDate"
          no-title
        >
        </v-date-picker>
      </v-menu>

      <v-select
        :items="managerItems"
        :label="$t('projectForm.manager')"
        v-model="project.managerId"/>

      <v-select
        :items="ownerItems"
        :label="$t('projectForm.owner')"
        v-model="project.ownerId"/>

      <!-- <v-menu
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="formattedDate"
            :label="$t('projectForm.requestDate')"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-list>
          <v-list-item
            v-for="member in teamOptions"
            v-bind:key="member.value"
            @click="selected(member.value)"
          >
            <v-list-item-content>
              <v-list-item-title v-text="member.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu> -->

      {{$t("projectForm.team")}}
      <v-container class="p-0">
        <v-row no-gutters>
          <v-col>
            <v-select
              :items="teamOptions"
              :label="$t('projectForm.addMember')"
              v-model="teamselector"
              @change="selected"
            >
            </v-select>
          </v-col>
          <v-col>
            <v-list v-if="project.teamIds.length !== 0">
              <v-list-item
                v-for="member in project.teamIds"
                v-bind:key="member"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="nameOf(member)"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="removeMember(member)">
                    <v-icon >mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>

      <v-container>
        <v-row align-content="center">
          {{$t('projectForm.started')}}
          <v-switch
            class="mt-0 pt-0 ml-2"
            @change="checkboxChanged"/>
        </v-row>
      </v-container>
      <b-button block @click="onSave">{{$t("projectForm.save")}}</b-button>
    </form>
  </div>
</template>

<script>
import Navbar from '../Navbar'
import {mapActions} from 'vuex'
import dateFormat from 'dateformat';

export default {
  name: 'Project-Form',
  components: {
    Navbar
  },
  data() {
    return {
      title: '',
      editing: false,
      project: {
        projectName: '',
        projectDescription: '',
        requestDate: new Date().toISOString().substr(0, 10),
        startDate: null,
        managerId: null,
        ownerId: null,
        teamIds: []
      },
      users:[],
      teamselector: null
    };
  },
  methods: {
    ...mapActions(['getUsers', 'postProject', 'getProjectById', 'updateProject']),
    checkboxChanged: function(checked) {
      this.project.startDate = checked ? new Date() : null;
    },
    selected: function(value) {
      this.project.teamIds.push(value)
      this.teamselector = null
    },
    removeMember: function(member) {
      const index = this.project.teamIds.indexOf(member);
      this.project.teamIds.splice(index, 1);
    },
    nameOf: function(id) {
      return this.users.find(u => u.value === id).text
    },
    onSave: function() {
      if(this.editing) {
        console.log(this.project)
        this.updateProject({
          id: this.$route.params.id,
          project: this.project
        });
      } else {
        this.postProject(this.project)
      }
    }
  },
  computed: {
    managerItems() {
      return this.users.filter(opt => 
        this.project.teamIds.indexOf(opt.value) === -1 &&
        this.project.ownerId !== opt.value
      )
    },
    ownerItems() {
      return this.users.filter(opt => 
        this.project.teamIds.indexOf(opt.value) === -1 &&
        this.project.managerId !== opt.value
      )
    },
    teamOptions() {
      return this.users.filter(opt => 
        this.project.teamIds.indexOf(opt.value) === -1 &&
        this.project.ownerId !== opt.value &&
        this.project.managerId !== opt.value
      )
    },
    formattedDate() {
      return dateFormat(this.project.requestDate, "mmmm d, yyyy")
    }
  },
  created: function() {
    this.editing = this.$route.params.id != undefined;
    this.getUsers().then(res => {
      this.users = res.map(u => {
        return {
          value: u._id,
          text: `${u._name} (${u._email})`
        }
      });
      if(this.$route.params.id) {
        this.getProjectById(this.$route.params.id)
        .then(project => this.project = {
          projectName: project._projectName,
          projectDescription: project._projectDescription,
          requestDate: project._requestDate,
          startDate: project._startDate,
          managerId: project._managerId,
          ownerId: project._ownerId,
          teamIds: project._teamIds
        })
      }
    });
  }
}
</script>

<style scoped>

#projectform {
  position: fixed;
  width: 18cm;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 90%;
  max-width: 60%;
}

</style>