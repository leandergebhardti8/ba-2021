<template>
    <div class="project">
        <button @click="navigateToDeployMethods" class="btn btn-primary close_btn"><b-icon-arrow-left></b-icon-arrow-left> Go back to Deploy Methods</button>
        <h1>{{project.name}} ({{ deployMethod.name }})</h1>
        <div class="settings_button">
          <b-dropdown right>
            <b-dropdown-item v-b-modal.modal-rename-current-project>Rename</b-dropdown-item>
            <b-dropdown-item v-b-modal.modal-edit-current-project><b-icon-pencil></b-icon-pencil> Edit</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="deleteEnv(environment.id)"><b-icon-exclamation-triangle variant="danger"></b-icon-exclamation-triangle> Delete</b-dropdown-item>
          </b-dropdown>
        </div>

        <div class="control_bar">
          <b-button-group>
            <b-button @click="fakeDeploy()">Test</b-button>
            <b-dropdown right text="Run Actions" v-if="this.workflows">
              <b-dropdown-item v-for="workflow in this.workflows" :key="workflow.id" @click="runAction(workflow.id)">
                {{ workflow.name }}
              </b-dropdown-item>
            </b-dropdown>
            <b-dropdown right text="Deploy in ... 🚀">
              <b-dropdown-item v-for="env in this.deployMethod.environments" :key="env.name" @click="startDeployment(env.name)">
                {{ env.name }} ({{ env.action }})
              </b-dropdown-item>
            </b-dropdown>
            <b-dropdown right text="Environments">
              <router-link 
                tag="b-dropdown-item" 
                :to="'/environment/' + env._id + '/' + deployMethod.name + '/' + project.id" 
                v-for="env in this.deployMethod.environments" 
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
        
        <div class="project_details">
          
          <div class="build_history">
            <h3>Workflow History</h3>
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
          </b-modal>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { mapGetters ,mapActions } from 'vuex';

export default {
  name: 'ProjectView',
  components: {

  },
  data() {
    return {
        methodName: undefined,
        projectId: undefined,
        project: null,
        deployMethod: undefined,
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
          builds: [],
        }
    }
  },
  computed: {
    ...mapGetters({project: "StateProject"}),
  },
  methods: {
    ...mapActions(['UpdateProject', 'GetProject']),
    navigateToDeployMethods() {
      this.$router.push('/deployjob/' + this.project.id);
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
        for(let i=0; i < this.project.deployMethods.length; i++){
          if(this.project.deployMethods[i].name === this.methodName){
            this.project.deployMethods[i].environments.push(this.newEnv);
          }
        }

        axios.put(`http://localhost:8080/api/project/${this.project._id}`, this.project)
        .then(response => {
            this.project.id = response.data.id;
            console.log(`Updating project ${response.data}`)
            this.softUpdateProject();
        })
        .catch(err => {
            console.log(err);
        })
    },
    getEnvironments() {
      for(let i=0; i < this.project.deployMethods.length; i++){
        if(this.project.deployMethods[i].name === this.methodName){
          return this.project.deployMethods[i].environments;
        }
      }
    },
    // deleteEnv(envId){
        
    // },
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

      this.checkAuthData(owner, repo, token);

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
      const environment = this.project.deployMethods.environments.find(env => env.name === envName)
      environment.builds.push(`${currentTime}`);
    },
    getRunsFromGHApi(owner, repo, token) {
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
    },
    getWorkflowsFromGHApi(owner, repo, token) {
      // TODO check if API info is alread there
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
    },
    checkAuthData(owner, repo, token) {
      if(!owner || !repo || !token || owner === '' || repo === '' || token === '') {
        throw new Error('Owner, repo and token required');
      }
    },
    updateProject() {
      axios.get(`http://localhost:8080/api/project/${this.projectId}`)
      .then(response => {
          this.project = response.data;

          let owner = this.project.repoOwner;
          let repo = this.project.repoName;
          let token = this.project.githubToken;

          this.deployMethod = this.project.deployMethods.find(method => method.name === this.methodName);

          // Get Data from GH
          this.checkAuthData(owner, repo, token)
          this.getRunsFromGHApi(owner, repo, token);
          this.getWorkflowsFromGHApi(owner, repo, token);
      })
      .catch(err => {
          console.log(err);
      })
    },
    softUpdateProject() {
      axios.get(`http://localhost:8080/api/project/${this.projectId}`)
      .then(response => {
          this.project = response.data;
          this.deployMethod = this.project.deployMethods.find(method => method.name === this.methodName);
      })
      .catch(err => {
          console.log(err);
      })
    }
  },
  mounted () {
      this.projectId = this.$route.params.projectId;
      this.methodName = this.$route.params.deployName;

      this.updateProject();    
  },
  created() {
    
  }
}
</script>

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
