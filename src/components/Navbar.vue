<template>
<b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#/dashboard">Project Manager</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">

        <b-nav-item-dropdown text="Lang" right>
          <b-dropdown-item
            v-for="lang in langs"
            v-bind:key="lang.value"
            @click="langChange(lang.value)"
          >{{lang.label}}</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown text="Account" right>
          <b-dropdown-item href="#" @click="logout">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
      </b-collapse>
    </b-navbar>
</template>

<script>
import {mapActions} from 'vuex';

export default {
  name: 'Navbar',
  data() {
    return {
      langs: [
        {value: 'es', label: 'Español'},
        {value: 'en', label: 'English'},
      ]
    };
  },
  methods: {
    ...mapActions(['logout']),
    langChange: function(lang) {
      this.$i18n.locale = lang;
      this.$router.push({query: {hl: lang}})
    }
  }
}
</script>