<template>
  <div id="signup-form" class="overflow-auto">
    <validation-observer v-slot="{invalid}">
    <v-dialog v-model="errorDialog" width="unset">
      <v-card
        class="p-4"
        @click="errorDialog = false"
        style="cursor: auto"
        :ripple="false"
      >
        <v-card-title><h4>{{$t("error.signup")}}</h4></v-card-title>
        <v-card
      </v-card>
    </v-dialog>
    <form>
      <h3>{{$t("signup")}}</h3>
      <validation-provider
        v-slot="{ errors }"
        rules="required|email"
      >
        <v-text-field
          :label="$t('email')"
          type="email"
          v-model="user.email"
          required
          :error-messages="errors"/>
      </validation-provider>

      <validation-provider
        v-slot="{ errors }"
        rules="required"
      >
        <v-text-field
          :label="$t('password')"
          type="password"
          v-model="user.password"
          required
          :error-messages="errors"/>
      </validation-provider>

      <validation-provider
        v-slot="{ errors }"
        rules="required"
      >
        <v-text-field
          :label="$t('name')"
          v-model="user.name"
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
          <validation-provider
            v-slot="{ errors }"
            rules="required"
          >
            <v-text-field
              v-model="user.birthdate"
              :label="$t('birthdate')"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              required
              :error-messages="errors"/>
          </validation-provider>
        </template>
        <v-date-picker
          v-model="user.birthdate"
          @input="menu2 = false"
          no-title/>
      </v-menu>

      <validation-provider
        v-slot="{ errors }"
        rules="required"
      >
        <v-text-field
          :label="$t('curp')"
          v-model="user.curp"
          required
          :error-messages="errors"/>
      </validation-provider>

      <validation-provider
        v-slot="{ errors }"
        rules="required"
      >
        <v-text-field
          :label="$t('rfc')"
          v-model="user.rfc"
          required
          :error-messages="errors"/>
      </validation-provider>

      <validation-provider
        v-slot="{ errors }"
        rules="required"
      >
        <v-text-field
          :label="$t('address')"
          v-model="user.address"
          required
          :error-messages="errors"/>
      </validation-provider>

      <p>
        {{$t("skills")}}
        <v-btn
          class="ml-2"
          @click="addEmptySkill">+</v-btn>
      </p>
      <v-container>
        <v-row
          v-for="(skill, index) in user.skillList"
          v-bind:key="skill.timestamp"
          align="center"
        >
          <v-col>
            <validation-provider
              v-slot="{ errors }"
              rules="required"
            >
              <v-text-field
                :label="$t('skill.name')"
                v-model="skill.description"
                required
                :error-messages="errors"/>
            </validation-provider>
          </v-col>
          <v-col>
            <validation-provider
              v-slot="{ errors }"
              rules="required"
            >
            <v-select
              :items="ranks"
              :label="$t('skill.rank.select')"
              required
              :error-messages="errors"
              v-model="skill.rank"/>
            </validation-provider>
          </v-col>
          <v-col
            align="center"
            cols="2"
            v-if="user.skillList.length > 1"
          >
            <v-icon @click="removeSkill(skill)">mdi-delete</v-icon>
          </v-col>
        </v-row>
      </v-container>

      <p>
        <v-btn
          class="btn-block"
          @click="attemptSignup(user)"
          :loading="loading"
          :disabled="invalid"
        >{{$t("signup")}}</v-btn>
      </p>
    </form>
    </validation-observer>
  </div>
</template>

<script>
import axios from 'axios';
import {mapActions} from 'vuex';

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
  name: 'Signup',
  components: {
    ValidationProvider,
    ValidationObserver
  },
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
        errorDialog: false,
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
    attemptSignup: function(user) {
      this.loading = true
      this.signup(user)
      .then(res => this.loading = false)
      .catch(err => {
        console.log(err)
        this.errorDialog = true;
        this.loading = false;
      })
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