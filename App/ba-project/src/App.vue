<template>
  <div id="app">
    <Header/>
    <!-- <b-breadcrumb :items="items"></b-breadcrumb> -->
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
                { 
                name: 'BA - Projekt', 
                id: '1', 
                githubURL: 'https://github.com/leandergebhardti8/ba-2021.git', 
                repoOwner: 'leandergebhardti8', 
                repoName: 'ba-2021', 
                githubToken: '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', 
                deployMethod: [
                    'Heroku'
                ], 
                environments: [
                      {
                        name: 'Heroku', 
                        action: 'run-deploy', 
                        id: '1', 
                        url: 'https://ba-2021.herokuapp.com/', 
                        builds: ["07.03.2021 11:12:40"]
                      }, 
                      {
                        name: 'Dev', 
                        action: 'Dev Deploy', 
                        id: '2'
                      }
                    ]
                },
                { 
                  name: 'ExampleName', 
                  id: '2', 
                  githubURL: 'test.test.test.git',
                  epoOwner: '', 
                  repoName: '', 
                  githubToken: '', 
                  environments: [],
                  deployMethod: [] 
                  },
      ],
      items: [
        {
          text: 'Home',
          href: '/'
        },
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
