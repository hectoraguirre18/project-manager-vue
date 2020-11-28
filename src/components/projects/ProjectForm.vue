<template>
  <div>
    <Navbar/>
    <form id="projectform" class="card p-3 overflow-auto">
      <h3>{{ title }}</h3>
      <b-form-group >
        <label>Name</label>
        <b-form-input id="pfname" v-model="project.projectName"/>
      </b-form-group>

      <b-form-group>
        <label>Description</label>
        <b-form-input id="pfdesc" v-model="project.projectDescription"/>
      </b-form-group>

      <b-form-group>
        <label>Request Date</label>
        <b-form-datepicker id="pfreqdate" v-model="project.requestDate"/>
      </b-form-group>

      <b-form-group>
        <label>Manager</label>
        <b-form-select id="pfmanager" v-model="project.managerId" :options="managerOptions"/>
      </b-form-group>

      <b-form-group>
        <label>Owner</label>
        <b-form-select id="pfowner" v-model="project.ownerId" :options="ownerOptions"/>
      </b-form-group>

      <label>Team</label>
      <b-container class="p-0">
        <b-row>
          <b-col>
            <b-form-group>
              <b-form-select
                id="pfteam"
                v-model="teamselector"
                :options="teamOptions"
                @change="selected"
              >
                <template #first>
                  <b-form-select-option :value="null" disabled>Add a member</b-form-select-option>
                </template>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col>
            <b-list-group
              v-for="member in project.teamIds"
              v-bind:key="member"
            >
              <b-list-group-item
                class="d-flex justify-content-between align-items-center"
              >{{nameOf(member)}}
                  <b-button 
                    variant="danger"
                    size="sm"
                    @click="removeMember(member)">
                    <b-icon-trash-fill/>
                  </b-button></b-list-group-item>
            </b-list-group>
          </b-col>
        </b-row>
      </b-container>

      <p>
        <b-form-group>
          <label>Set as Started</label>
          <b-form-checkbox
            class="d-inline ml-2"
            switch id="pfstartdate"
            @change="checkboxChanged"
            />
        </b-form-group>
      </p>
      <b-button block @click="postProject(project)">Sign Up</b-button>
    </form>
  </div>
</template>

<script>
import Navbar from '../Navbar'
import {mapActions} from 'vuex'

export default {
  name: 'Project-Form',
  components: {
    Navbar
  },
  data() {
    return {
      title: '',
      project: {
        projectName: '',
        projectDescription: '',
        requestDate: new Date(),
        startDate: null,
        managerId: null,
        ownerId: 'patitoid',
        teamIds: []
      },
      users:[],
      teamselector: null
    };
  },
  methods: {
    ...mapActions(['getUsers', 'postProject']),
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
    }
  },
  computed: {
    managerOptions() {
      return this.users.filter(opt => 
        this.project.teamIds.indexOf(opt.value) === -1 &&
        this.project.ownerId !== opt.value
      )
    },
    ownerOptions() {
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
  },
  created: function() {
    this.title = this.$route.params.id ? 'Edit Project' : 'New Project';
    this.getUsers().then(res => {
      this.users = res.map(u => {
        return {
          value: u._id,
          text: `${u._name} (${u._email})`
        }
      });
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