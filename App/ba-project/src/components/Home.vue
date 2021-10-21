<template>
<div class="home">
    <h1>Home</h1>
    <hr>
    <button @click="navigateToProjects" class="btn btn-primary">Go to Projects</button>
    <hr>
    <div class="build_history">
        <h3>Recent Builds</h3>
        <p v-if="allBuilds" style="padding: 10px;">Total Builds: {{ allBuilds.length }}</p>
        <hr style="color:black;">
        <b-table v-if="allBuilds" hover :items="createTableWithAllBuilds()"></b-table>
    </div>
</div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Home',
  created: function () {
    this.GetProjects(this.user);
  },
  mounted () {
    
  },
  computed: {
    ...mapGetters({projects: "StateProjects"}),
    ...mapGetters({user: "StateUser"}),
  },
  data() {
    return {
      allBuilds: [],
    }
  },
   methods: {
     ...mapActions(['GetProjects']),
    navigateToProjects() {
        this.$router.push('/projects');
    },
    getAllBuildsFromProjects() {
      for(let index = 0; index < this.projects.length; index++) {
        for(let deployIndex = 0; deployIndex < this.projects[index].deployMethods.length; deployIndex++) {
          for(let envIndex = 0; envIndex < this.projects[index].deployMethods[deployIndex].environments.length; envIndex++) {
            let builds = {};
        
            if(this.projects[index].deployMethods[deployIndex].environments[envIndex].builds.length != 0) {
              builds.builds = this.projects[index].deployMethods[deployIndex].environments[envIndex].builds;
              builds.project = this.projects[index].name;
              builds.deployMethod = this.projects[index].deployMethods[deployIndex].name;
              builds.environment = this.projects[index].deployMethods[deployIndex].environments[envIndex].name;
            }
            if(Object.keys(builds).length != 0) {
              this.allBuilds.push(builds);
            }
          }
        } 
      }

    },
    createTableWithAllBuilds() {
      if(this.allBuilds.length === 0 && typeof this.projects != undefined)
        this.getAllBuildsFromProjects();

      const items = []
      let element = {}

      // Create Table Element based on Entries stored in allBuilds
      if(this.allBuilds) {
        for(let index = 0; index < this.allBuilds.length; index++) {
          // There is one build entry
          if(this.allBuilds[index].builds.length <= 1 && this.allBuilds[index].environment != null){
            element = {
              Project: this.allBuilds[index].project, 
              DeployMethod: this.allBuilds[index].deployMethod, 
              Environment: this.allBuilds[index].environment, 
              'Build Timestamp': this.allBuilds[index].builds[0]};
            items.push(element)
          }
          // There are more then one build entries in the same environment of a project. Make multiple entries in the table for this project & environment.
          else {
            for(let buildIndex = 0; buildIndex < this.allBuilds[index].builds.length; buildIndex++) {
              let buildElement = {}
              buildElement = {
                Project: this.allBuilds[index].project, 
                DeployMethod: this.allBuilds[index].deployMethod, 
                Environment: this.allBuilds[index].environment, 
                'Build Timestamp': this.allBuilds[index].builds[buildIndex]};
              items.push(buildElement)
            }
          }
        }
      }

      return items;
    },
  }
}
</script>

<style scoped lang="scss">
  h1 {
    padding: 20px;
  }

  .build_history {
    background: white;
    padding: 20px;
    margin: 2rem;
    width: 50%;
    margin: auto;
    -webkit-box-shadow: 10px 10px 19px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 10px 10px 19px 0px rgba(0,0,0,0.75);
    box-shadow: 10px 10px 19px 0px rgba(0,0,0,0.75);
    color: black;
    h3{
      color: black;
      padding: 15px;
    }
  }
</style>
