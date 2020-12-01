<template>

  <div>
    <Navbar/>
          <br/>
          <input v-model= newColumn.name />
          <button @click="postColumn()">Create</button >
          <br><br>
          <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
          <v-flex v-for="actor in actors" xs${response.data.objs.docs.lenght}>
        <v-card dark color="secondary">
          <v-card-text class="px-0" @click="deleteItem()">{{ actor._name }}</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
  </div>
</template>

<script>
import Navbar from '../Navbar'
import axios from 'axios';
import router from '@/router/index'
import {mapActions} from 'vuex';
import async from 'async'


var Something = ' ';

export default {
  
  name: 'Board',
  
  data(){
    return{
      
      newColumn : {
        name : 'newColumn ',
        projectId : ''
      },
      actors : []
      
    }
  },
  
  methods :{
    
    async postColumn() {
    axios.post('http://54.89.103.209/columns', {
      body : {
        name : this.newColumn
      }
    })
    .catch(err => {
      console.log(err)
      alert('Column creation failed')
    })
   },
   async deleteItem() {
     axios.delete('http://54.89.103.209/columns',{
       params : response.data.objs.docs[this.actors._id]
     })
     .catch(err => {
      console.log(err)
      alert('Column delete failed')
    })
   }
  },

  components: {

    Navbar
  },
  created(){
    //codes at the begining of the app
    axios
    .get('http://54.89.103.209/columns')
    .then(response => {
        console.log(response)
        this.actors = response.data.objs.docs
      })
    .catch(error => console.log(error))
  }
}
</script>

<style scoped>
h5 {
  color: white;
}
</style>