<template>
<div class="home">
    <h1>Home</h1>
    <button @click="navigateToProjects" class="btn btn-primary space-medium">Go to Projects</button>
    <div class="build_history">
        <h3>Recent Builds</h3>
        <p v-if="builds" style="padding: 10px;">Total Builds: {{ builds.length }}</p>
        <b-table v-if="builds" hover :items="builds"></b-table>
    </div>
</div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Home',
  created: function () {
    this.GetProjects(this.user);
    this.createTableWithBuilds()
  },
  mounted () {
  
  },
  computed: {
    ...mapGetters({user: "StateUser"}),
    ...mapGetters({projects: "StateProjects"}),
  },
  data() {
    return {
      buildsFromProjects: [],
      builds: [] 
    }
  },
   methods: {
     ...mapActions(['GetProjects']),
    navigateToProjects() {
        this.$router.push('/projects');
    },
    getBuildsFromProjects() {
      // Itarating through projects
      for(let index = 0; index < this.projects.length; index++) {
        // Itarate through deploy Methods
        for(let deployIndex = 0; deployIndex < this.projects[index].deployMethods.length; deployIndex++) {
          // Itarate through Environments
          for(let envIndex = 0; envIndex < this.projects[index].deployMethods[deployIndex].environments.length; envIndex++) {
            let builds = {};
            const currentEnvironment = this.projects[index].deployMethods[deployIndex].environments[envIndex]; 
        
            if(currentEnvironment.builds.length != 0) {
              builds.builds = currentEnvironment.builds;
              builds.project = this.projects[index].name;
              builds.deployMethod = this.projects[index].deployMethods[deployIndex].name;
              builds.environment = currentEnvironment.name;
            }
            if(Object.keys(builds).length != 0) {
              this.buildsFromProjects.push(builds);
            }
          }
        } 
      }

    },
    createTableWithBuilds() {
      if(this.buildsFromProjects.length === 0 && typeof this.projects != undefined)
        this.getBuildsFromProjects();

      const allBuilds = this.buildsFromProjects;
      let element = {}

      // Create Table Element based on Entries stored in allBuilds
      if(allBuilds) {
        for(let index = 0; index < allBuilds.length; index++) {
          // There is one build entry
          if(allBuilds[index].builds.length <= 1 && allBuilds[index].environment != null){
            element = {
              Project: allBuilds[index].project, 
              DeployMethod: allBuilds[index].deployMethod, 
              Environment: allBuilds[index].environment, 
              'Build Timestamp': allBuilds[index].builds[0]};
            this.builds.push(element)
          }
          // There are more then one build entries in the same environment of a project. Make multiple entries in the table for this project & environment.
          else {
            for(let buildIndex = 0; buildIndex < allBuilds[index].builds.length; buildIndex++) {
              let buildElement = {}
              buildElement = {
                Project: allBuilds[index].project, 
                DeployMethod: allBuilds[index].deployMethod, 
                Environment: allBuilds[index].environment, 
                'Build Timestamp': allBuilds[index].builds[buildIndex]};
              this.builds.push(buildElement)
            }
          }
        }
      }
      this.builds.reverse();
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
    margin: 2rem 2rem 0 15px;
    width: 50%;
    margin: auto;
    color: black;
    border-radius: 15px 15px 0 0;
    h3{
      color: white;
      padding: 20px;
      background-color: #2B1DAE;
      border-radius: 12px 12px 0 0;
    }
  }

  .stage_view {
    margin: 2rem 2rem 0 15px;
    margin-left: 0;
    background-color: white;
    color: black;
    border-radius: 15px 15px 0 0;
    h3 {
      color: white;
      text-align: center;
      background-color: #2B1DAE;
      padding: 20px;
      font-weight: 800;
      border-radius: 12px 12px 0 0;
    }
  }
</style>
