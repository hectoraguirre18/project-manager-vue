<template>
  <div class="signup">
    <b-card id="signup-form" class="overflow-auto">
      <form>
        <h3>Sign Up</h3>
        <b-form-group>
            <label>Email</label>
            <b-form-input id="mail" type="email" v-model="user.email"/>
        </b-form-group>

        <b-form-group>
            <label>Password</label>
            <b-form-input id="pwd" type="password" v-model="user.password"/>
        </b-form-group>
        <b-form-group>
          
            <label>Name</label>
            <b-form-input id="name" v-model="user.name"/>
        </b-form-group>

        <b-form-group>
            <label>Birthdate</label>
            <b-form-datepicker id="birthdate" v-model="user.birthdate"/>
        </b-form-group>
        <b-form-group>
            <label>CURP</label>
            <b-form-input id="curp" v-model="user.curp"/>
        </b-form-group>

        <b-form-group>
            <label>RFC</label>
            <b-form-input id="rfc" v-model="user.rfc"/>
        </b-form-group>
        <b-form-group>

            <label>Address</label>
            <b-form-input id="address" v-model="user.address"/>
        </b-form-group>

        <p>
          <label>Skills</label>
          <b-button 
            variant="success"
            size="sm"
            @click="addEmptySkill">+</b-button>
        </p>
        <b-form-group v-for="skill in user.skills">
            <b-container>
              <b-form-row>
                <b-col>
                  <b-form-input
                    id="skill-desc"
                    placeholder="Skill name"
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
          <b-button block @click="signup">Sign Up</b-button>
        </p>
      </form>
    </b-card>
  </div>
</template>

<script>
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
        skills: [],
      },
      ranks: [
        {value: null, text: 'Select a rank'},
        {value: 'junior', text: 'Junior'},
        {value: 'senior', text: 'Senior'},
        {value: 'master', text: 'Master'},
      ],
    }
  },
  methods: {
    signup: function(event){
      console.log(this.user);
    },
    addEmptySkill: function(event) {
      this.user.skills.push({
        description: '',
        rank: null
      });
    },
    removeSkill: function(skill) {
      const index = this.user.skills.indexOf(skill);
      this.user.skills.splice(index, 1);
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
  width: 12cm;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 90%;
}

</style>