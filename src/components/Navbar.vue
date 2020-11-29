<template>
<div>
    <v-app-bar app>
      <v-toolbar-title class="ml-2">
        {{$t("appName")}}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{on, attrs}">
          <v-btn
            dark
            depressed
            text
            v-bind="attrs"
            v-on="on"
          >
          {{$t("appBar.lang")}}
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="lang in langs"
            v-bind:key="lang.value"
            @click="langChange(lang.value)"
          >
            <v-list-item-title>{{lang.label}}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu offset-y>
        <template v-slot:activator="{on, attrs}">
          <v-btn
            dark
            depressed
            text
            v-bind="attrs"
            v-on="on"
          >
          {{$t("appBar.account")}}
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="logout">
            <v-list-item-title>{{$t("appBar.signout")}}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    </div>
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
      ],
      items: [
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me 2' },
      ],
    };
  },
  methods: {
    ...mapActions(['logout']),
    langChange: function(lang) {
      this.$i18n.locale = lang;
      this.$router.push({query: {hl: lang}})
    },
  }
}
</script>