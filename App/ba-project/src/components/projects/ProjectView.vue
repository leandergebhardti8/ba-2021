<template>
    <div class="project">
        <button @click="navigateToDeployMethods" class="btn btn-primary close_btn"><b-icon-arrow-left></b-icon-arrow-left> Go back to Deploy Methods</button>
        <h1>{{project.name}} ({{ deployMethod.name }})</h1>

        <div class="control_bar">
          <b-button-group>
            <div class="info" id="tooltip-text-action">
                <b-icon-info id="tooltip-text-action"></b-icon-info> Info
            </div>
            <b-dropdown right text="Run Actions" v-if="this.workflows">
              <b-dropdown-item v-for="workflow in this.workflows" :key="workflow.id" @click="runAction(workflow.name)">
                {{ workflow.name }}
              </b-dropdown-item>
            </b-dropdown>
            <b-tooltip target="tooltip-text-action" triggers="hover">
              You need to have the respository_dispatch event in your GitHub Action set up. 
              Here is an Example: 
              repository_dispatch:
                types: [{workflowName}]
            </b-tooltip>
            
            <b-dropdown right text="Deploy in ... 🚀">
              <b-dropdown-item v-for="env in this.deployMethod.environments" :key="env.name" @click="startDeployment(env.name)">
                {{ env.name }} ({{ env.action }})
              </b-dropdown-item>
            </b-dropdown>
            <b-dropdown right text="Environments">
              <router-link 
                tag="b-dropdown-item" 
                :to="'/environment/' + env._id + '/' + deployMethod.name + '/' + project._id" 
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
              to="/setupguide" 
            >
            Learn More here.
            </router-link>
          </b-alert> 
        </div>


        <div class="project_details">

          <!-- Workflow History -->
          
          <div class="build_history">
            <h3>Workflow History</h3>
            <p style="padding: 10px;">Total workflow runs: {{ runs.total_count }}</p>
            <hr style="color:black;">
            <b-table hover :items="creteTableWithAPIData(runs.workflow_runs)" v-if="runs"></b-table>
          </div>


          <!-- Stage View -->

          <div class="stage_view">
            <h3>Stage View</h3>
            <Pipelines v-if="!deploying && !action" :workflows="workflows" :runs="runs" :running="running"/>

            <div v-if="deploying">
              <b-table striped hover :items="creteTableForStageView(deployStatus)"></b-table>
              <b-spinner style="width: 3rem; height: 3rem;" class="ml-auto"></b-spinner>
            </div>

            <div v-if="action">
              <b-table striped hover :items="creteTableForStageView(actionStatus)"></b-table>
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
                        to="/setupguide"
                        target="_blank" 
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

import Pipelines from '../pipeline/Pipelines.vue'

export default {
  name: 'ProjectView',
  components: {
    Pipelines: Pipelines,
  },
  data() {
    return {
        methodName: undefined,
        projectId: undefined,
        deployMethod: undefined,
        runs: {},
        branches: [{ text: 'Select a branch', value: null}],
        showGetErrorMessage: false,
        showPostErrorMessage: false,
        deploying: false,
        action: false,
        running: false,
        deployStatus: [{title: 'Deploying ...'}],
        actionStatus: [{title: 'Running Action ...'}],
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
    mounted () {

  },
  created() {
    this.projectId = this.$route.params.projectId;
    this.methodName = this.$route.params.deployName;

    this.GetProject(this.projectId);
    this.updateProjectView();
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
          // Coloring depending on run conclusion
          if (data[index].conclusion === 'failure'){
            element._rowVariant = 'danger'
          } 
          else if(data[index].conclusion === 'success'){
            element._rowVariant = 'success'
          }
          else if(data[index].conclusion === 'canceld'){
            element._rowVariant = 'secondary'
          }
          element = { name: data[index].name, started: this.getEuropeanTime(data[index].created_at) ,Branch: data[index].head_branch };
          items.push(element)
        }
      }
      // Create empty table for projects with no runs
      if(items.length === 0){
        items.push({name: '', created: ''});
      }

      return items;
    },
    getEuropeanTime(dateString) {
      var date = new Date(dateString);
      if(date.getMinutes()< 10)
        return date.getDate()+"."+(date.getMonth() + 1)+"."+date.getFullYear()+" "+date.getHours()+":0"+date.getMinutes();
      return date.getDate()+"."+(date.getMonth() + 1)+"."+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
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
    async addNewEnv() {
      try {
        let projectCopy = this.project;
        for(let i=0; i < projectCopy.deployMethods.length; i++){
          if(projectCopy.deployMethods[i].name === this.methodName){
            projectCopy.deployMethods[i].environments.push(this.newEnv);
          }
        }
        await this.UpdateProject(projectCopy);
        this.deployMethod = this.project.deployMethods.find(method => method.name === this.methodName);
        console.log(`Updating project`)
        this.newEnv = {
          name: '', 
          action: '', 
          url: '', 
          builds: [],
        }
      } catch (error) {
        console.error('Something went wrong while trying to update a Project!')
      }
    },
    runAction(actionName) {
      this.action = true;

      const owner = this.project.repoOwner;
      const repo = this.project.repoName;
      const token = this.project.githubToken;

      this.checkAuthData(owner, repo, token);

      const dispatchUrl = `https://api.github.com/repos/${owner}/${repo}/dispatches`;
      const payload = { "event_type": actionName };

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
        this.handleActionsResponse(response, actionName)
      ))
      .catch(error => {
        this.errorMessage = error.message;
        console.error("There was an error while executing an ACTION!", error);
        this.showPostErrorMessage = true;
      });
    },
    startDeployment(envName){
    // Trigger GitHub Action in Repo, which deploys the project

      this.deploying = true;
      this.deployStatus.push({title: 'Fetching Repo'});
      
      const owner = this.project.repoOwner;
      const repo = this.project.repoName;
      const token = this.project.githubToken;

      this.checkAuthData(owner, repo, token);

      // Getting Event Type from Environment
      let event_type = null;
      for(let i = 0; i < this.deployMethod.environments.length; i ++) {
        if(this.deployMethod.environments[i].name === envName)
          event_type = this.deployMethod.environments[i].action;
      }

      const dispatchUrl = `https://api.github.com/repos/${owner}/${repo}/dispatches`;
      const payload = { "event_type": event_type };

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
      console.log(response)
      this.running = true
      this.updateProjectView()
      this.updateDeployHistoryInEnv(envName);
    },
    handleActionsResponse(response) {
      console.log(response)
      this.running = true;
      this.updateProjectView();
      this.action = false
    },
    getCurrentTime() {
      // Get Current Time Stamp
      const today = new Date();
      var date = today.getFullYear()+'-'+today.getMonth()+'-'+today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const dateTime = date+' '+time;
      return dateTime;
    }, 
    updateDeployHistoryInEnv(envName) {
      // Adding Deploy to Env Deploy History
      const currentTime = this.getCurrentTime();

      let projectCopy = this.project;
      for(let i = 0; i < projectCopy.deployMethods.length; i++) {
        if(projectCopy.deployMethods[i].name === this.methodName){
          projectCopy.deployMethods[i].environments
            .find(env => env.name === envName)
              .builds.push(`${currentTime}`)
        }
      }

      this.updateProjectData(projectCopy)
    },
    getRunsFromGHApi(owner, repo, token) {
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
          this.runs = response.data
        ))
        .catch(error => {
          this.errorMessage = error.message;
          console.error("There was an error GETTING RUNS from GitHub!", error);
          this.showGetErrorMessage = true;
      });
    },
    getWorkflowsFromGHApi(owner, repo, token) {
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
    async updateProjectData(project){
      try {
        await this.UpdateProject(project);
        console.log(`Updating project`)
      } catch (error) {
        console.error('Something went wrong while trying to update a Project!')
      }
    },
    async updateProjectView() {
      try {
        await this.GetProject(this.project._id);
        console.log(`Updating project`)

        const owner = this.project.repoOwner;
        const repo = this.project.repoName;
        const token = this.project.githubToken;

        this.deployMethod = this.project.deployMethods.find(method => method.name === this.methodName);

        // Get Data from GitHub API
        this.checkAuthData(owner, repo, token);
        if(!this.showGetErrorMessage && !this.showPostErrorMessage) {
          this.getRunsFromGHApi(owner, repo, token);
          this.getWorkflowsFromGHApi(owner, repo, token);
          this.getBranchesFromGHApi(owner, repo, token);
        }
      } catch (error) {
        console.error('Something went wrong while trying to update the Project!')
      }
    },
  },
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
  .info {
    margin: auto 15px;
  }

  
</style>
