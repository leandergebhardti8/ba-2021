<template>
  <div id="app">
    <Header msg="Welcome to Your Vue.js App"/>
    <!-- <hr> -->
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './components/Header.vue'

export default {
  name: 'App',
  components: {
    Header
  }, 
  data() {
    return{
      projects: [
              { name: 'BA - Projekt', id: '1', github: true, githubURL: 'https://github.com/leandergebhardti8/ba-2021.git', environments: [{name: 'Heroku', action: 'Heroku Deploy', id: '1', url: 'https://ba-2021.herokuapp.com/', builds: ["03.07.2021 11:12:40"]}, {name: 'Dev', action: 'Dev Deploy', id: '2'}]},
              { name: 'ExampleName', id: '2', github: false, environments: [] },
          ],
    }
  },
  provide() {
    return {
      projects: this.projects,
    }
  }
}
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    /* color: black; */
    color: white;
    -webkit-font-smoothing: antialiased;
  }
  body {
    background: linear-gradient(90deg, #1CB5E0 0%, #000851 100%);
  }
  h1 {
      padding: 20px;
  }
</style>
