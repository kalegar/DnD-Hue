<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="/images/dnd-logo.png"
          transition="scale-transition"
          width="40"
        />

        <h1 class="vecna-font">D&D Hue</h1>
      </div>

      <v-spacer></v-spacer>

      <v-switch
        v-model="allLights"
        dark
      ></v-switch>
    </v-app-bar>

    <v-main class="background">
      <Dashboard/>
    </v-main>
  </v-app>
</template>

<script>
import Dashboard from './components/Dashboard';

export default {
  name: 'App',

  components: {
    Dashboard,
  },

  data: () => ({
    allLights: true
  }),
};
</script>

<style>
@font-face {
  font-family: "Vecna";
  src: local("Vecna"),
    url('./fonts/Vecna/VecnaBold.ttf') format("truetype");
}

.vecna-font {
  font-family: "Vecna", Helvetica, Arial;
}

</style>

<style scoped>
.background {
  background-image: url('/images/background.jpg');
  background-size: cover;
}
</style>
