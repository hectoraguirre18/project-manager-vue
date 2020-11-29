<template>
  <div id="signup-form" class="overflow-auto">
    <form>
      <h3>{{$t("signup")}}</h3>
      <v-text-field :label="$t('email')" type="email" v-model="user.email"/>
      <v-text-field :label="$t('password')" type="password" v-model="user.password"/>
      <v-text-field :label="$t('name')" v-model="user.name"/>
      <v-menu
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="user.birthdate"
            :label="$t('birthdate')"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="user.birthdate"
          @input="menu2 = false"
          no-title
        >
        </v-date-picker>
      </v-menu>
      <v-text-field :label="$t('curp')" v-model="user.curp"/>
      <v-text-field :label="$t('rfc')" v-model="user.rfc"/>
      <v-text-field :label="$t('address')" v-model="user.address"/>

      <p>
        {{$t("skills")}}
        <v-btn
          class="ml-2"
          @click="addEmptySkill">+</v-btn>
      </p>
      <v-container>
        <v-row
          v-for="skill in user.skillList"
          v-bind:key="skill.timestamp"
          align="center"
        >
          <v-col>
            <v-text-field :label="$t('skill.name')" v-model="skill.description"/>
          </v-col>
          <v-col>
            <v-select
              :items="ranks"
              :label="$t('skill.rank.select')"
              v-model="skill.rank"/>
          </v-col>
          <v-col
            align="center"
            cols="2"
          >
            <v-icon @click="removeSkill(skill)">mdi-delete</v-icon>
          </v-col>
        </v-row>
      </v-container>

      <p>
        <v-btn
          class="btn-block"
          @click="signup(user)"
          :loading="loading"
        >{{$t("signup")}}</v-btn>
      </p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import {mapActions} from 'vuex';

export default {
  name: 'Signup',
  data () {
    return {
      user: {
        email: '',
        password: '',
        name: '',
        birthdate: '',
        curp: '',
        rfc: '',
        address: '',
        skillList: [],
      },
      ranks: [
        {value: 'junior', text: this.$t('skill.rank.junior')},
        {value: 'senior', text: this.$t('skill.rank.senior')},
        {value: 'master', text: this.$t('skill.rank.master')},
      ],
      loading: false,
    }
  },
  methods: {
    ...mapActions(['signup']),
    addEmptySkill: function(event) {
      this.user.skillList.push({
        description: '',
        rank: null,
        timestamp: new Date().getTime()
      });
    },
    removeSkill: function(skill) {
      const index = this.user.skillList.indexOf(skill);
      this.user.skillList.splice(index, 1);
    },
    attemptLogin: function(user) {
      this.loading = true
      this.signup(user)
      .then(res => this.loading = false)
    },
  },
  created() {
    this.addEmptySkill();
  }
}
</script>

<style scoped>

#signup-form {
  position: fixed;
  width: 16cm;
  padding-right: 2mm;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 90%;
}

</style>