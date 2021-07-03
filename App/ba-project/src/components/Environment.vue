<template>
    <div class="environments">
        <h1>{{ environment.name }}</h1>
        <div class="settings_button">  
          <b-dropdown right>
            <b-dropdown-item @click="showRenameTemplate(); showTemplate();">Rename</b-dropdown-item>
            <b-dropdown-item @click="showURLTemplate(); showTemplate();">Reset URL</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="deleteEnv(environment.id)"><b-icon-exclamation-triangle variant="danger"></b-icon-exclamation-triangle> Delete</b-dropdown-item>
          </b-dropdown>
        </div>
        <p><b-icon-arrow-right></b-icon-arrow-right> Visit Here: <a :href="environment.url" target="_blank">{{ environment.url }}</a></p>
        <hr>
        <div class="detail_area">
          <!-- <button v-if="templateOpen" @click="closeTemplate" class="btn btn-primary close_button">
                  <b-icon-x></b-icon-x>
          </button> -->
          <div class="template" v-if="renameTemplate && templateOpen">
              <b-form inline>
                  <strong>Rename Environment</strong>
                  <b-form-input
                      id="inline-form-input-name"
                      class="mb-2 mr-sm-2 mb-sm-0"
                      v-model="environment.name"
                      readonly
                  ></b-form-input>
                  <div>
                      <b-form-input
                          id="inline-form-input-name"
                          class="mb-2 mr-sm-2 mb-sm-0"
                          placeholder="New Name"
                          v-model="newEnvName"
                      ></b-form-input>
                  </div>
                  <b-button variant="primary" @click="renameEnv">Save</b-button>
                  <b-button variant="primary" @click="closeTemplate">Cancel</b-button>
              </b-form>
          </div>

          <div class="template" v-if="URLTemplate && templateOpen">
              <b-form inline>
                  <strong>Reset Environment URL</strong>
                  <b-form-input
                      id="inline-form-input-name"
                      class="mb-2 mr-sm-2 mb-sm-0"
                      v-model="environment.url"
                      readonly
                  ></b-form-input>
                  <div>
                      <b-form-input
                          id="inline-form-input-name"
                          class="mb-2 mr-sm-2 mb-sm-0"
                          placeholder="New Environment URL"
                          v-model="newEnvURL"
                      ></b-form-input>
                  </div>
                  <b-button variant="primary" @click="resetEnvURL">Save</b-button>
                  <b-button variant="primary" @click="closeTemplate">Cancel</b-button>
              </b-form>
          </div>
        </div>

        <div class="deploy_history">
            <h3>Deploy History</h3>
            <p style="padding: 10px;"><strong>Last deploy:</strong> {{ latestDeploy }}</p>
            <hr style="color:black;">
            <b-table hover :items="deployItems" v-if="latestDeploy"></b-table>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Environment',
  inject: [
    'projects'
  ], 
  data() {
    return {
        environment: null,
        projectId: '',
        apiData: {},
        allEnvs: [],
        templateOpen: false,
        renameTemplate: false,
        URLTemplate: false,
        newEnvName: '',
        newEnvURL: '',
        deployItems: [],
        latestDeploy: null,
    }
  },
  methods: {
    showTemplate() {
      this.templateOpen = true;
    },
    closeTemplate() {
      this.templateOpen = false;
    },
    showRenameTemplate() {
      this.URLTemplate = false;
      this.renameTemplate = true;
    },
    showURLTemplate() {
      this.renameTemplate = false;
      this.URLTemplate = true;
    },
    renameEnv() {
      this.environment.name = this.newEnvName;
      this.closeTemplate();
    },
    resetEnvURL() {
      this.environment.url = this.newEnvURL;
      this.closeTemplate();
    },
    deleteEnv(id) {
      this.environment = null;
      for(let projectIndex = 0; projectIndex < this.projects.length; projectIndex++) {
      for(let envIndex = 0; envIndex < this.projects[projectIndex].environments.length; envIndex++){
        const envToRemove = this.projects[projectIndex].environments[envIndex]
        if (envToRemove.id === id) {
          const index = this.projects[projectIndex].environments.indexOf(envToRemove)
          this.projects[projectIndex].environments.splice(index, 1);
        }
      }
    }
      this.$router.push('/projects');
    },
    getLatestBuildDate(builds) {
      new Date(Math.max(...builds.map(build => this.latestDeploy = new Date(build))));
    },
    createDeployTable(builds) {
      const items = []
      let element = {}

      this.getLatestBuildDate(builds)
      for(let index = 0; index < builds.length; index++) {
        element = { Date: builds[index]};
        items.push(element)
      }
      this.deployItems = items;
    },
  },
  created() {
    const envId = this.$route.params.environmentId;

    console.log(`envID ${envId}`)

    for(let projectIndex = 0; projectIndex < this.projects.length; projectIndex++) {
      for(let envIndex = 0; envIndex < this.projects[projectIndex].environments.length; envIndex++){
        this.allEnvs.push(this.projects[projectIndex].environments[envIndex]);
      }
    }

    this.environment = this.allEnvs.find(env => env.id === envId);
    console.log(`envFound ${this.environment}`)

    this.createDeployTable(this.environment.builds);
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    h1 {
      display: inline-block;
    }
    a {
      color: white;
      &:hover{
        color: white;
        background: grey;
        border-radius: 5px;
      }
    }
    .settings_button {
      display: inline-block;
      padding: 10px;
      cursor: pointer;
      // float: right;
    }
    .template {
      width: 45%;
      margin: auto;
      button {
        margin: 1rem;
      }
    }
    .deploy_history {
      color: black;
      background: white;
      width: 50%;
      margin: auto;
    }
</style>
