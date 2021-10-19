<template>
  <v-container>
    <!-- <v-row class="text-center">
      <v-col v-for="(light,index) in lights" v-bind:key="index">
        <v-btn
          @click="toggleLight(light)"
        >Toggle {{light.name}}</v-btn>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <h2>Groups:</h2>
      <v-col v-for="(group,index) in groups" v-bind:key="index">
        <p>{{group.name}}</p>
      </v-col>
    </v-row> -->
    <v-row>
      <v-col>
        <Scenes :lights="lights"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import axios from 'axios';
  import {LightsService} from '../services/Lights.service';
  import {GroupsService} from '../services/Groups.service';
import Scenes from './Scenes.vue';

  export default {
  components: { Scenes },
    name: 'Dashboard',

    computed: {
      baseURL: function() {
        return process.env.VUE_APP_HUE_BRIDGE_ADDRESS + 'api/' + process.env.VUE_APP_HUE_USER;
      }
    },

    methods: {
      getLights: function() {
        LightsService.getLights().then((res) => this.lights = res, (rej) => console.log(rej));
      },
      getGroups: function() {
        GroupsService.getGroups().then((res) => this.groups = res, (rej) => console.log(rej));
      },
      toggleLight: function(light) {
        light.state.on = !light.state.on;
        const url = this.baseURL + `/lights/${light.index}/state`;
        axios.put(url, { on: light.state.on, transitiontime: 1 }).then((res) => {
          console.log(res);
        }).catch(err => {
          console.log(err);
        });
      }
    },

    data: () => ({
      lightIndex: 1,
      light: false,
      lights: [],
      groups: []
    }),

    mounted: function() {
      this.getLights();
      this.getGroups();
    }
  }
</script>
