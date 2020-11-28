<template>
  <div>
    <Navbar/>
    <form id="projectform" class="card p-3 overflow-auto">
      <h3>{{ editing ? $t("projectForm.title.edit") : $t("projectForm.title.new") }}</h3>
      <b-form-group >
        <label>{{$t("projectForm.name")}}</label>
        <b-form-input id="pfname" v-model="project.projectName"/>
      </b-form-group>

      <b-form-group>
        <label>{{$t("projectForm.description")}}</label>
        <b-form-input id="pfdesc" v-model="project.projectDescription"/>
      </b-form-group>

      <b-form-group>
        <label>{{$t("projectForm.requestDate")}}</label>
        <b-form-datepicker id="pfreqdate" v-model="project.requestDate"/>
      </b-form-group>

      <b-form-group>
        <label>{{$t("projectForm.manager")}}</label>
        <b-form-select id="pfmanager" v-model="project.managerId" :options="managerOptions"/>
      </b-form-group>

      <b-form-group>
        <label>{{$t("projectForm.owner")}}</label>
        <b-form-select id="pfowner" v-model="project.ownerId" :options="ownerOptions"/>
      </b-form-group>

      <label>{{$t("projectForm.team")}}</label>
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
                  <b-form-select-option :value="null" disabled>{{$t("projectForm.addMember")}}</b-form-select-option>
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
          <label>{{$t("projectForm.started")}}</label>
          <b-form-checkbox
            class="d-inline ml-2"
            switch id="pfstartdate"
            @change="checkboxChanged"
            />
        </b-form-group>
      </p>
      <b-button block @click="onSave">{{$t("projectForm.save")}}</b-button>
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
      editing: false,
      project: {
        projectName: '',
        projectDescription: '',
        requestDate: new Date(),
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