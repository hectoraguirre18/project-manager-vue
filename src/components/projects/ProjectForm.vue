<template>
  <div>
    <Navbar/>
    <v-progress-circular
      indeterminate
      v-if="loading"
      class="centered"
    ></v-progress-circular>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <form
        class="centered"
        v-if="!loading"
      >
        <v-container>
          <v-row>
            <h3>{{ editing ? $t("projectForm.title.edit") : $t("projectForm.title.new") }}</h3>
            <v-spacer/>
            <v-switch
              class="mt-0 pt-0 ml-2"
              v-if="!previouslyStarted"
              @change="checkboxChanged"/>
            {{$t(previouslyStarted ? 'projectForm.started' : 'projectForm.startnow')}}
          </v-row>
        </v-container>
        <validation-provider v-slot="{ errors }" rules="required">
          <v-text-field
            :label="$t('projectForm.name')"
            v-model="project.projectName"
            required
            :error-messages="errors"/>
        </validation-provider>
        <validation-provider v-slot="{ errors }" rules="required">
          <v-text-field
            :label="$t('projectForm.description')"
            v-model="project.projectDescription"
            required
            :error-messages="errors"/>
        </validation-provider>

        <v-menu
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <validation-provider v-slot="{ errors }" rules="required">
              <v-text-field
                :value="formattedDate"
                :label="$t('projectForm.requestDate')"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              required
              :error-messages="errors"/>
            </validation-provider>
          </template>
          <v-date-picker
            v-model="project.requestDate"
            no-title
          >
          </v-date-picker>
        </v-menu>

        <validation-provider v-slot="{ errors }" rules="required">
          <v-select
            :items="managerItems"
            :label="$t('projectForm.manager')"
            required
            :error-messages="errors"
            v-model="project.managerId"/>
        </validation-provider>

        <validation-provider v-slot="{ errors }" rules="required">
          <v-select
            :items="ownerItems"
            :label="$t('projectForm.owner')"
            required
            :error-messages="errors"
            v-model="project.ownerId"/>
        </validation-provider>

        {{$t("projectForm.team")}}
        <v-container class="p-0">
          <v-row>
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
              <v-list class="no-bg" v-if="project.teamIds.length !== 0">
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
        <b-button block @click="onSave">{{$t("projectForm.save")}}</b-button>
      </form>
    </validation-observer>
  </div>
</template>

<script>
import Navbar from '../Navbar'
import {mapActions} from 'vuex'
import dateFormat from 'dateformat';

import { required, digits, email, max, regex } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'

setInteractionMode('eager')

extend('required', {
  ...required,
  message: 'This field can not be empty'
})

extend('email', {
  ...email,
  message: 'This email is invalid'
})

export default {
  name: 'Project-Form',
  components: {
    Navbar,
    ValidationProvider,
    ValidationObserver
  },
  data() {
    return {
      title: '',
      editing: false,
      previouslyStarted: false,
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
      teamselector: null,
      loading: true,
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
      if(this.project.requestDate) {
        return new Date(this.project.requestDate).toISOString().substring(0, 10)
      } else {
        return ''
      }
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
        .then(project => {
          this.project = {
            projectName: project._projectName,
            projectDescription: project._projectDescription,
            requestDate: project._requestDate,
            startDate: project._startDate,
            managerId: project._managerId,
            ownerId: project._ownerId,
            teamIds: project._teamIds
          }
          this.previouslyStarted = this.editing && this.project.startDate != null
          this.loading = false;
        })
      } else {
        this.loading = false;
      }
    });
  }
}
</script>

<style scoped>

.centered {
  position: fixed;
  width: 18cm;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 90%;
  max-width: 60%;
}

.no-bg{
  background-color: transparent;
}

</style>