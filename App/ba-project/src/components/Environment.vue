<template>
    <div class="environments">
      <button @click="navigateToProjects" class="btn btn-primary close_btn"><b-icon-arrow-left></b-icon-arrow-left> Go back to Project</button>
        <h1>{{ environment.name }}</h1>
        <div class="settings_button">  
          <b-dropdown right>
            <b-dropdown-item @click="showRenameTemplate(); showTemplate();">Rename</b-dropdown-item>
            <b-dropdown-item @click="showURLTemplate(); showTemplate();">Reset URL</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="deleteEnv(environment.id)"><b-icon-exclamation-triangle variant="danger"></b-icon-exclamation-triangle> Delete</b-dropdown-item>
          </b-dropdown>
        </div>
        <p><b-icon-arrow-right></b-icon-arrow-right> Visit Here: <a :href="environment.url" target="_blank" class="env_url">{{ environment.url }}</a></p>
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
            <p style="padding: 10px;"><strong>Last Deploy:</strong> {{ latestDeploy }}</p>
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
        project: null,
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
    navigateToProjects() {
      this.$router.push('/project/' + this.project.id);
    },
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
    deleteEnv(envId) {
        if (envId != null && envId != '') {
          const index = this.project.environments.indexOf(envId)
          this.project.environments.splice(index, 1);
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
    //Get Environment ID From route
    const envId = this.$route.params.environmentId;
    const projectId = this.$route.params.projectId;
    console.log(`envID ${envId}`)

    // Get this Environment with Project ID & Environment ID
    this.project = this.projects.find(project => project.id === projectId);
    this.environment = this.project.environments.find(env => env.id === envId);

    if(this.environment.builds)
      this.createDeployTable(this.environment.builds);
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    h1 {
      display: inline-block;
    }
    .env_url {
      background: white;
      padding: 5px;
      border-radius: 5px;
      text-decoration: none;
      :hover {
        color: rgb(134, 134, 255);
      }
    }
    .settings_button {
      display: inline-block;
      padding: 10px;
      cursor: pointer;
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
      h3 {
        color: white;
        text-align: center;
        background-color: #1E92CC;
        padding: 15px;
        margin: 0;
        font-weight: 800;
      }
    }
    .close_btn {
      left: 0;
      float: left;
      position: absolute;
      margin: 1.75rem;
    }
</style>
