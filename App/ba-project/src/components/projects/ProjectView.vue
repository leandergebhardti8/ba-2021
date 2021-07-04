<template>
    <div class="project">
        <h1>{{project.name}}</h1>
        <div class="settings_button">
          <b-dropdown right>
            <b-dropdown-item>Rename</b-dropdown-item>
            <b-dropdown-item><b-icon-pencil></b-icon-pencil> Edit Project</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="deleteEnv(environment.id)"><b-icon-exclamation-triangle variant="danger"></b-icon-exclamation-triangle> Delete</b-dropdown-item>
          </b-dropdown>
        </div>
        <div class="control_bar">
          <b-button-group>
            <b-button @click="fakeDeploy()">Test</b-button>
            <b-dropdown right text="Run Actions">
              <b-dropdown-item v-for="workflow in this.workflows" :key="workflow.id" @click="runAction(workflow.id)">
                {{ workflow.name }}
              </b-dropdown-item>
            </b-dropdown>
            <b-dropdown right text="Deploy in ... 🚀">
              <b-dropdown-item v-for="env in this.project.environments" :key="env.name" @click="startDeployment(env.name)">
                {{ env.name }} ({{ env.action }})
              </b-dropdown-item>
            </b-dropdown>
            <b-dropdown right text="Environments">
              <router-link 
                tag="b-dropdown-item" 
                :to="'/environment/' + env.id + '/' + project.id" 
                v-for="env in this.project.environments" 
                :key="env.name">
                {{ env.name }}
              </router-link>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item v-b-modal.modal-prevent-closing><b-icon-plus-circle></b-icon-plus-circle> Add New </b-dropdown-item>
            </b-dropdown>
            
          </b-button-group>
        </div>
        <hr>
        
        <p class="github-url" v-if="project.github">
          <b-icon-github></b-icon-github> <a :href="project.githubURL" target="_blank">{{ project.githubURL }}</a>
        </p>
        
        <div v-if="showProjectDetails" class="project_details">
          
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
          <!-- TODO Make this modal functional (addin v-model) -->
          <b-modal 
            id="modal-prevent-closing" 
            title="Adding new Environment"
            @ok="handleOk">
            <b-form inline>
                    <label class="sr-only" for="inline-form-input-id">Environment Name</label>
                    <b-form-input
                        id="inline-form-input-name"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="Name"
                    ></b-form-input>
                    <label class="sr-only" for="inline-form-input-id">Environment URl</label>
                    <b-form-input
                        id="inline-form-input-name"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="URL"
                    ></b-form-input>

                    <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0">With Action</b-form-checkbox>
                    <div>
                        <b-form-input
                            id="inline-form-input-name"
                            class="mb-2 mr-sm-2 mb-sm-0"
                            placeholder="GitHub HTTPS URL"
                        ></b-form-input>
                    </div>
                    <b-button variant="primary" @click="addNewEnv()">Save</b-button>
                </b-form>
            <!-- <b-button class="mt-3" block @click="$bvModal.hide('bv-modal-example')">Close Me</b-button> -->
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
        apiData: {},
        deploying: false,
        deployStatus: [{title: 'Deploying ...'}],
        success: false,
        workflows: [],
        showProjectDetails: true,
        buildHistoryItems: [],
        stageViewItems: [], 
    }
  },
  methods: {
    creteTableWithAPIData(data) {
      const items = []
      let element = {}
      for(let index = 0; index < data.length; index++) {
        if (data[index].conclusion === 'failure')
          element._rowVariant = 'danger';
        element = { _rowVariant: data[index].conclusion, name: data[index].name, created: data[index].created_at };
        items.push(element)
      }
      return items;
    },
    creteTableForStageView(data) {
      const items = []
      let element = {}
      for(let index = 0; index < data.length; index++) {
        // TODO Adding Icons
        if (items.length > 1) {
          items[index--] = {Status: '<b-icon-check-circle></b-icon-check-circle>'};
        }
        element = {Job: data[index].title};
        items.push(element)
      }
      return items;
    },
    handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        console.log("Hello there!")
        this.$nextTick(() => {
          this.$bvModal.hide('modal-prevent-closing')
        })
      },
    startDeployment(envName){
    // Trigger GitHub Action in Repo, which deploys the project

      this.deploying = true;
      this.deployStatus.push({title: 'Fetching Repo'});

      const username = 'leandergebhardti8';
      const password = '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';
      
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
      const owner = 'leandergebhardti8';
      const repo = 'ba-2021';
      const token = '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';

      if(!owner || !repo || !token) {
        throw new Error('Owner, repo and token required');
      }

      const dispatchUrl = `https://api.github.com/repos/${owner}/${repo}/dispatches`;
      const payload = { "event_type": "run-deploy" };

      axios
        .post(dispatchUrl, payload, {
          headers: { 
            Accept: "application/vnd.github.v3+json"
          },
          auth: {
            username,
            password
          },
      })
      .then(response => (
        this.handleDeployResponse(response, envName)
      ))
      .catch(error => {
        this.errorMessage = error.message;
        console.error("There was an error!", error);
      });
    },
    handleDeployResponse(response, envName) {
      console.log(response)
      this.deployStatus.push({title: 'Deploying Porject in Environment ...'});
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
      setTimeout(() => { 
        this.deploying = false 
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
    // TODO fix adding envs
    addNewEnv() {
      this.project.environments.push({name: 'NewEnvironment', action: '', id: `${this.project.environments.length++}`, url: '', builds: []});
      console.log(this.project.environments)
    }
  },
  mounted () {

    
  },
  created() {
    const projectId = this.$route.params.projectId;
    this.project = this.projects.find(project => project.id === projectId);
    
      const username = 'leandergebhardti8';
      const password = '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';
    
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
        .get('https://api.github.com/repos/leandergebhardti8/ba-2021/actions/runs', { 
          auth: {
            username: username,
            password: password
          }
        })
        .then(response => (
          this.apiData = response.data
          // this.runs = response.data.workflow_runs
        ))
        .catch(error => {
          this.errorMessage = error.message;
          console.error("There was an error!", error);
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
          .get('https://api.github.com/repos/leandergebhardti8/ba-2021/actions/workflows', { 
            auth: {
              username: username,
              password: password
            }
          })
          .then(response => (
            this.workflows = response.data.workflows
            // this.runs = response.data.workflow_runs
          ))
          .catch(error => {
            this.errorMessage = error.message;
            console.error("There was an error!", error);
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
</style>
