<template>
    <div class="environments">
      <button @click="navigateToProject" class="btn btn-primary close_btn"><b-icon-arrow-left></b-icon-arrow-left> Go back to {{ project.name }}</button>
        <h1>{{ environment.name }}</h1>
        <div class="settings_button">  
          <b-dropdown right>
            <b-dropdown-item v-b-modal.modal-rename>Rename</b-dropdown-item>
            <b-dropdown-item v-b-modal.modal-edit-env><b-icon-pencil></b-icon-pencil> Edit</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="deleteEnv(environment._id)"><b-icon-exclamation-triangle variant="danger"></b-icon-exclamation-triangle> Delete</b-dropdown-item>
          </b-dropdown>
        </div>
        <p><b-icon-arrow-right></b-icon-arrow-right> Visit Here: <a :href="environment.url" target="_blank" class="env_url">{{ environment.url }}</a></p>
        <hr>
        <p>Environment Action Name <i>(needed to deploy Project in Environment)</i>: <strong>{{environment.action}}</strong></p>
        
        <!-- MODALS -->
        <b-modal 
            id="modal-edit-env" 
            title="Edit Environment">
            <b-form inline>
                    <label class="sr-only" for="inline-form-input-id">Environment Name</label>
                    <b-form-input
                        id="inline-form-input-name"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="Name"
                        v-model="environment.name"
                    ></b-form-input>
                    <label class="sr-only" for="inline-form-input-id">Environment URl</label>
                    <b-form-input
                        id="inline-form-input-name"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="URL"
                        v-model="environment.url"
                    ></b-form-input>
                    <label class="sr-only" for="inline-form-input-id">GitHub action name</label>
                    <b-form-input
                        id="inline-form-input-name"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="GitHub Actions Name"
                        v-model="environment.action"
                    ></b-form-input>
                </b-form>
          </b-modal>

          <b-modal 
            id="modal-rename" 
            title="Edit Environment">
            <b-form inline>
                    <label class="sr-only" for="inline-form-input-id">Environment Name</label>
                    <b-form-input
                        id="inline-form-input-name"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="Name"
                        v-model="environment.name"
                    ></b-form-input>
                </b-form>
          </b-modal>

        <div class="deploy_history">
            <h3>Deploy History</h3>
            <p style="padding: 10px;"><strong>Last Deploy:</strong> {{ latestDeploy }}</p>
            <hr style="color:black;">
            <b-table hover :items="deployItems" v-if="latestDeploy"></b-table>
        </div>
    </div>
</template>

<script>
import { mapGetters ,mapActions } from 'vuex'   

export default {
  name: 'Environment',
  data() {
    return {
        environment: null,
        apiData: {},
        allEnvs: [],
        newEnvName: '',
        newEnvURL: '',
        deployItems: [],
        deployMethod: [],
        latestDeploy: null,
    }
  },
  computed: {
    ...mapGetters({project: "StateProject"}),
  },
  methods: {
    ...mapActions(['UpdateProject', 'GetProject']),
    navigateToProject() {
      this.$router.push('/project/' + this.project.id + '/' + this.deployMethod.name);
    },
    async deleteEnv(envId) {
        // if (envId != null && envId != '') {
        //   const index = this.project.deployMethods.environments.indexOf(envId)
        //   this.project.deployMethods.environments.splice(index, 1);
        // }
        for(let i=0; i < this.project.deployMethods.length; i++){
          if(this.project.deployMethods[i].name === this.deployMethod.name){
            const index = this.project.deployMethods[i].environments.indexOf(env => env._id === envId);
            this.project.deployMethods[i].environments.splice(index, 1);
          }
        }

        try {
            await this.UpdateProject(this.project);
            console.log(`Updating project`)
        } catch (error) {
            console.error('Something went wrong while trying to update a Project!' + error)
        }

        // Go back to project
        this.$router.push(`/project/${this.project.id}/${this.deployMethod.name}`);
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
    let envId = this.$route.params.environmentId;
    let projectId = this.$route.params.projectId;
    let methodName = this.$route.params.methodName;

    this.GetProject(projectId);
    this.deployMethod = this.project.deployMethods.find(method => method.name === methodName);
    this.environment = this.deployMethod.environments.find(env => env._id === envId);
    if(this.environment.builds) {
      this.createDeployTable(this.environment.builds);
    }
  },
  mounted() {

  }
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
