<template>
    <div class="project">
        <button @click="navigateToProjects" class="btn btn-primary close_btn"><b-icon-arrow-left></b-icon-arrow-left> Go back to Projects</button>
        <h1>{{project.name}}</h1>
        <div class="settings_button">
          <b-dropdown right>
            <b-dropdown-item v-b-modal.modal-rename-current-project>Rename</b-dropdown-item>
            <b-dropdown-item v-b-modal.modal-edit-current-project><b-icon-pencil></b-icon-pencil> Edit</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="deleteEnv(environment.id)"><b-icon-exclamation-triangle variant="danger"></b-icon-exclamation-triangle> Delete</b-dropdown-item>
          </b-dropdown>
        </div>


        <div class="deploy_method" v-if="!deployMethodDefined">
          <b-button-group>
            <b-dropdown right text="Select Deploy Method" variant="primary">
              <b-dropdown-item @click="addDeployMethod('herkoku')">
                Heroku
              </b-dropdown-item>
              <b-dropdown-item @click="addDeployMethod('s3')">
                (S3)
              </b-dropdown-item>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item>
                Coming soon
              </b-dropdown-item>
            </b-dropdown>
          </b-button-group>
        </div>


        <div class="control_bar" v-if="deployMethodDefined">
          <b-button-group>
            <b-button @click="fakeDeploy()">Test</b-button>
            <b-button @click="deployMethodDefined = false">Add Another Deploying Method</b-button>
            <b-dropdown right text="Run Actions" v-if="this.workflows">
              <b-dropdown-item v-for="workflow in this.workflows" :key="workflow.id" @click="runAction(workflow.id)">
                {{ workflow.name }}
              </b-dropdown-item>
            </b-dropdown>
            <b-dropdown right text="Deploy in ... 🚀" v-if="this.project.environments">
              <b-dropdown-item v-for="env in this.project.environments" :key="env.name" @click="startDeployment(env.name)">
                {{ env.name }} ({{ env.action }})
              </b-dropdown-item>
            </b-dropdown>
            <b-dropdown right text="Environments">
              <router-link 
                tag="b-dropdown-item" 
                :to="'/environment/' + env.id + '/' + project.id" 
                v-for="env in this.project.environments" 
                :key="env.name"
              >
                {{ env.name }}
              </router-link>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item v-b-modal.modal-add-new-env><b-icon-plus-circle></b-icon-plus-circle> Add New </b-dropdown-item>
            </b-dropdown>
            
          </b-button-group>
        </div>
        <hr>
        <div></div>
        <p class="github-url">
          <b-icon-github></b-icon-github> <a :href="project.githubURL" target="_blank">{{ project.githubURL }}</a>
        </p>
        
        <div v-if="deployMethodDefined" class="project_details">
          
          <div class="build_history">
            <h3>Build History</h3>
            <p style="padding: 10px;">Total workflow runs: {{ apiData.total_count }}</p>
            <hr style="color:black;">
            <b-table hover :items="creteTableWithAPIData(apiData.workflow_runs)" v-if="apiData"></b-table>
          </div>

          <div class="stage_view">
            <h3>Stage View</h3>
            <div v-if="deploying">
              <b-table striped hover :items="creteTableForStageView(deployStatus)"></b-table>
              <b-spinner style="width: 3rem; height: 3rem;" class="ml-auto"></b-spinner>
            </div>
          </div>
        </div>
        <div>
        <div class="error_msg">
          <b-alert show variant="danger" v-if="showGetErrorMessage">
            <b-icon-exclamation font-scale="2"></b-icon-exclamation> The App has Trouble accessing GitHub with your given Information. Please Check if your <b>Repository Owner</b>, <b>Repository Name</b> and <b-icon-github></b-icon-github> <b>Token</b> are correct.
          </b-alert>
          <b-alert show variant="danger" v-if="showPostErrorMessage">
            <b-icon-exclamation font-scale="2"></b-icon-exclamation> The App has Trouble accessing GitHub with your given Information. Please Check if your <b>Repository Owner</b>, <b>Repository Name</b> and <b-icon-github></b-icon-github> <b>Token</b> are correct. <b>Especially check if your action Name is correct.</b>
            <router-link 
              tag="a" 
              :to="'/setupguide/' + project.id" 
            >
            Learn More here.
            </router-link>
          </b-alert> 
        </div>

          <!-- MODALS -->
          <b-modal 
            id="modal-add-new-env" 
            title="Adding new Environment"
            @ok="addNewEnv">
            <b-form inline>
                    <label class="sr-only" for="inline-form-input-id">Environment Name</label>
                    <b-form-input
                        id="inline-form-input-name"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="Name"
                        v-model="newEnv.name"
                    ></b-form-input>
                    <label class="sr-only" for="inline-form-input-id">Environment URl</label>
                    <b-form-input
                        id="inline-form-input-name"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="URL"
                        v-model="newEnv.url"
                    ></b-form-input>
                    <label class="sr-only" for="inline-form-input-id">GitHub Action Name</label>
                    <b-icon-question-circle class="question_btn" id="tooltip-text"></b-icon-question-circle>
                    <b-tooltip target="tooltip-text" triggers="hover">
                      For the Deployment to work you have to setup a GitHub Action in your project <b>(in GitHub)</b>. After you have done that provide the Action name here.<br>
                      <router-link 
                        tag="a" 
                        :to="'/setupguide/' + project.id" 
                      >
                        Learn More here.
                      </router-link>
                    </b-tooltip>
                    <b-form-input
                        id="inline-form-input-name"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="GitHub Action Name"
                        v-model="newEnv.action"
                    ></b-form-input>
                </b-form>
            <!-- <b-button class="mt-3" block @click="$bvModal.hide('bv-modal-example')">Close Me</b-button> -->
          </b-modal>

          <b-modal 
            id="modal-edit-current-project" 
            title="Edit Porject">
            <b-form inline>
                    <label class="sr-only" for="inline-form-input-id">Porject Name</label>
                    <b-form-input
                        id="inline-form-input-name"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="Name"
                        v-model="project.name"
                    ></b-form-input>
                    <label class="sr-only" for="inline-form-input-id">Project GitHub URL</label>
                    <b-form-input
                        id="inline-form-input-name"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="URL"
                        v-model="project.githubURL"
                    ></b-form-input>
                </b-form>
          </b-modal>

          <b-modal 
            id="modal-rename-current-project" 
            title="Rename Porject">
            <b-form inline>
                    <label class="sr-only" for="inline-form-input-id">Porject Name</label>
                    <b-form-input
                        id="inline-form-input-name"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="Name"
                        v-model="project.name"
                    ></b-form-input>
                </b-form>
          </b-modal>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProjectView',
  inject: [
    'projects'
  ], 
  components: {

  },
  data() {
    return {
        project: null,
        // deployMethodDefined: false,
        apiData: {},
        showGetErrorMessage: false,
        showPostErrorMessage: false,
        deploying: false,
        deployStatus: [{title: 'Deploying ...'}],
        workflows: [],
        buildHistoryItems: [],
        stageViewItems: [],
        newEnv: {
          name: '', 
          action: '', 
          url: '', 
          id: null,
        }
    }
  },
  computed: {
    deployMethodDefined() {
      return this.project.deployMethod.length > 0;
    }
  },
  methods: {
    navigateToProjects() {
      this.$router.push('/projects');
    },
    creteTableWithAPIData(data) {
      const items = []
      let element = {}
      if(data) {
        for(let index = 0; index < data.length; index++) {
          if (data[index].conclusion === 'failure')
            element._rowVariant = 'danger';
          element = { _rowVariant: data[index].conclusion, name: data[index].name, created: data[index].created_at };
          items.push(element)
        }
      }
      if(items.length === 0){
        items.push({name: '', created: ''});
      }

      return items;
    },
    creteTableForStageView(data) {
      const items = []
      let element = {}
      if(data) {
        for(let index = 0; index < data.length; index++) {
          if (items.length > 1) {
            items[index--] = {Status: '<b-icon-check-circle></b-icon-check-circle>'};
          }
          element = {Job: data[index].title};
          items.push(element)
        }
      }
      if(items.length === 0){
        items.push({Status: ''});
      }

      return items;
    },
    addNewEnv() {
        let envID = 0;
        if(this.project.environments) { 
          envID = this.project.environments.length + 1;
        }
        this.newEnv.id = envID.toString();
        this.project.environments.push(this.newEnv);
    },
    addDeployMethod(methodName) {
      this.project.deployMethod.push(methodName);
      // this.deployMethodDefined = true;
    },
    startDeployment(envName){
    // Trigger GitHub Action in Repo, which deploys the project

      this.deploying = true;
      this.deployStatus.push({title: 'Fetching Repo'});

      // const username = 'leandergebhardti8';
      // const password = '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';
      
    // Fetching workflow ID
      // let workflows = []

      // axios.interceptors.request.use(config => {
      // // perform a task before the request is sent
      // console.log('Requesting workflows from API');

      // return config;
      // }, error => {
      //   // handle the error
      //   return Promise.reject(error);
      // })
      // axios
      //   .get('https://api.github.com/repos/leandergebhardti8/ba-2021/actions/workflows', { 
      //     auth: {
      //       username,
      //       password
      //     }
      //   })
      //   .then(response => (
      //     workflows = response.data.workflows
      //     // this.runs = response.data.workflow_runs
      //   ))
      //   .catch(error => {
      //     this.errorMessage = error.message;
      //     console.error("There was an error!", error);
      // });

      // const workflowToBeExecuted = workflows.find(workflow => workflow.name === workflowName)
      // console.log(`Filtered workflow: ${workflowToBeExecuted}`)

      // // Create workflow dispatcher event
      // axios.interceptors.request.use(config => {
      // // perform a task before the request is sent
      // console.log('Post workflow dispatcher event');

      // return config;
      // }, error => {
      //   // handle the error
      //   return Promise.reject(error);
      // })

      // TODO Fetch info from env
      const owner = this.project.repoOwner;
      const repo = this.project.repoName;
      const token = this.project.githubToken;
      
      // const {
      //   REPO_OWNER: owner,
      //   REPO_NAME: repo,
      //   GITHUB_TOKEN: token,
      // } = process.env;

      if(!owner || !repo || !token || owner === '' || repo === '' || token === '') {
        throw new Error('Owner, repo and token required!');
      }

      const dispatchUrl = `https://api.github.com/repos/${owner}/${repo}/dispatches`;
      const payload = { "event_type": "run-deploy" };

      axios
        .post(dispatchUrl, payload, {
          headers: { 
            Accept: "application/vnd.github.v3+json"
          },
          auth: {
            username: owner,
            password: token
          },
      })
      .then(response => (
        this.handleDeployResponse(response, envName)
      ))
      .catch(error => {
        this.errorMessage = error.message;
        console.error("There was an error while DEPLOYING!", error);
        this.showPostErrorMessage = true;
      });
    },
    handleDeployResponse(response, envName) {
      console.log('Inside handleDeployResponse')
      console.log(response)
      // this.deployStatus.push({title: 'Deploying Porject in Environment ...'});
      // TODO Get Verification action is finished
      // this.deployStatus.push({title: 'Done!'});
      setTimeout(() => { 
        this.deploying = false 
      }, 3000);
      this.updateDeployHistoryInEnv(envName);
    },
    fakeDeploy() {
      this.deploying = true;
      this.deployStatus.push({title: 'Run Action #1'});
      // this.deployStatus.push({title: 'Done!'});
      this.deploying = false;
      setTimeout(() => { 
        this.deploying = false
        this.deployStatus = []; 
      }, 3000);
      // this.deployStatus.push({title: 'Run Action #2'});
      // this.deployStatus.push({title: 'Run Action #3'});
    },
    getCurrentTime() {
      // Get Current Time Stamp
      const today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const dateTime = date+' '+time;
      return dateTime;
    }, 
    updateDeployHistoryInEnv(envName) {
      // Adding Deploy to Env Deploy History
      const currentTime = this.getCurrentTime();
      const environment = this.project.environments.find(env => env.name === envName)
      environment.builds.push(`${currentTime}`);
    },
  },
  mounted () {

    
  },
  created() {
    const projectId = this.$route.params.projectId;
    this.project = this.projects.find(project => project.id === projectId);
    
      const owner = this.project.repoOwner;
      const repo = this.project.repoName;
      const token = this.project.githubToken;
    
      if(!owner || !repo || !token || owner === '' || repo === '' || token === '') {
        throw new Error('Owner, repo and token required');
      }

    // TODO check if API info is alread there
    // if( !this.apiData) {
      // Get Runs from API
      axios.interceptors.request.use(config => {
      // perform a task before the request is sent
      console.log('Requesting runs from API');

      return config;
      }, error => {
        // handle the error
        return Promise.reject(error);
      })
      
      axios
        .get(`https://api.github.com/repos/${owner}/${repo}/actions/runs`, { 
          auth: {
            username: owner,
            password: token
          }
        })
        .then(response => (
          this.apiData = response.data
          // this.runs = response.data.workflow_runs
        ))
        .catch(error => {
          this.errorMessage = error.message;
          console.error("There was an error GETTING RUNS from GitHub!", error);
          this.showGetErrorMessage = true;
      });
    // }

    // TODO check if API info is alread there
    // if( !this.workflows ) {
    // Get Workflows from API
      axios.interceptors.request.use(config => {
        // perform a task before the request is sent
        console.log('Requesting workflows from API');

        return config;
        }, error => {
          // handle the error
          return Promise.reject(error);
        })
        axios
          .get(`https://api.github.com/repos/${owner}/${repo}/actions/workflows`, { 
            auth: {
              username: owner,
              password: token
            }
          })
          .then(response => (
            this.workflows = response.data.workflows
            // this.runs = response.data.workflow_runs
          ))
          .catch(error => {
            this.errorMessage = error.message;
            console.error("There was an error GETTING WORKFLOWS from GitHub!", error);
            this.showGetErrorMessage = true;
        });
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    h1 {
      display: inline-block;
    }
    .settings_button {
      display: inline;
    }
    .github {
    background-color: black;
    color: white;
    padding: 10px;
    margin-left: 5px;
    border-radius: 15px;
  }
  .github-url {
    color: black;
    margin: auto;
    text-decoration: none;
    a{
      background: white;
      padding: 5px;
      border-radius: 5px;
      text-decoration: none;
    }
  }
  .project_details {
    display: grid;
    grid-template-columns: minmax(20%, 25%) 1fr;
  }
  .build_history {
    list-style: none;
    text-align: left;
    background-color: white;
    color: black;
    margin: 2rem;
    -webkit-box-shadow: 10px 10px 19px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 10px 10px 19px 0px rgba(0,0,0,0.75);
    box-shadow: 10px 10px 19px 0px rgba(0,0,0,0.75);
    h3 {
      color: white;
      text-align: center;
      background-color: #1E92CC;
      padding: 15px;
      margin: 0;
      font-weight: 800;
    }
  }
  .stage_view {
    margin: 2rem;
    margin-left: 0;
    background-color: white;
    color: black;
    -webkit-box-shadow: 10px 10px 19px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 10px 10px 19px 0px rgba(0,0,0,0.75);
    box-shadow: 10px 10px 19px 0px rgba(0,0,0,0.75);
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
  .error_msg {
    margin: 2rem;
  }
  .question_btn {
    margin-left: 5px;
    cursor: pointer;
  }
</style>
