<template>
  <div class="signup">
    <b-card id="signup-form" class="overflow-auto">
      <form>
        <h3>{{$t("signup")}}</h3>
        <b-form-group>
            <label>{{$t("email")}}</label>
            <b-form-input id="email" type="email" v-model="user.email"/>
        </b-form-group>

        <b-form-group>
            <label>{{$t("password")}}</label>
            <b-form-input id="pass" type="password" v-model="user.password"/>
        </b-form-group>
        <b-form-group>
          
            <label>{{$t("name")}}</label>
            <b-form-input id="name" v-model="user.name"/>
        </b-form-group>

        <b-form-group>
            <label>{{$t("birthdate")}}</label>
            <b-form-datepicker id="birthdate" v-model="user.birthdate"/>
        </b-form-group>
        <b-form-group>
            <label>{{$t("curp")}}</label>
            <b-form-input id="curp" v-model="user.curp"/>
        </b-form-group>

        <b-form-group>
            <label>{{$t("rfc")}}</label>
            <b-form-input id="rfc" v-model="user.rfc"/>
        </b-form-group>
        <b-form-group>

            <label>{{$t("address")}}</label>
            <b-form-input id="address" v-model="user.address"/>
        </b-form-group>

        <p>
          <label>{{$t("skills")}}</label>
          <b-button 
            variant="success"
            size="sm"
            @click="addEmptySkill">+</b-button>
        </p>
        <b-form-group
          v-for="skill in user.skillList"
          v-bind:data="skill"
          v-bind:key="skill.timestamp">
            <b-container class="p-0">
              <b-form-row>
                <b-col>
                  <b-form-input
                    id="skill-desc"
                    :placeholder='$t("skill.name")'
                    v-model="skill.description" />
                </b-col>
                <b-col>
                  <b-form-select
                    :options="ranks"
                    id="skill-rank"
                    v-model="skill.rank"/>
                </b-col>
                  <b-button 
                    variant="danger"
                    size="sm"
                    @click="removeSkill(skill)">
                    <b-icon-trash-fill/>
                  </b-button>
              </b-form-row>
            </b-container>
        </b-form-group>

        <p>
          <b-button block @click="signup(user)">{{$t("signup")}}</b-button>
        </p>
      </form>
    </b-card>
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
        {value: null, text: this.$t('skill.rank.select')},
        {value: 'junior', text: this.$t('skill.rank.junior')},
        {value: 'senior', text: this.$t('skill.rank.senior')},
        {value: 'master', text: this.$t('skill.rank.master')},
      ],
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
    }
  },
  created() {
    this.addEmptySkill();
  }
}
</script>

<style scoped>

#signup-form {
  position: fixed;
  width: 14cm;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 90%;
}

</style>