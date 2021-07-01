<template>
    <div class="project">
        <h1>{{project.name}}</h1>
        <div class="control_bar">
          <b-button-group>
            <b-button @click="fakeDeploy">Run Actions</b-button>
            <b-dropdown right text="Deploy in ... 🚀">
              <b-dropdown-item v-for="env in this.project.environments" :key="env.name" @click="startDeployment(env.action)">
                {{ env.name }} ({{ env.action }})
              </b-dropdown-item>
            </b-dropdown>
            <b-dropdown right text="Edit Environments">
              <router-link 
                tag="b-dropdown-item" 
                :to="'/environment/' + env.id" 
                v-for="env in this.project.environments" 
                :key="env.name">
                {{ env.name }}
              </router-link>
              <!-- <b-dropdown-item ></b-dropdown-item> -->
            </b-dropdown>
          </b-button-group>
        </div>
        <hr>
        <p class="github-url" v-if="project.github">
          <b-icon-github></b-icon-github> 
          <a :href="project.githubURL" target="_blank">{{ project.githubURL }}</a>
        </p>
        
        <div class="project_details">
          
          <div class="build_history">
            <h3>Build History</h3>
            <p style="padding: 10px;">Total workflow runs: {{ apiData.total_count }}</p>
            <hr style="color:black;">
            <b-table hover :items="creteTableWithAPIData(apiData.workflow_runs)" v-if="apiData"></b-table>
            <!-- <b-list-group class="build_history">
              <b-list-group-item v-for="run in apiData.workflow_runs" :key="run.id">
                  <p>{{ run.name }} <span :class="run.conclusion">{{ run.conclusion }}</span></p>
              </b-list-group-item>
            </b-list-group> -->
          </div>

          <div class="stage_view">
            <h3>Stage View</h3>
            <div v-if="deploying">
              <b-table striped hover :items="creteTableForStageView(deployStatus)"></b-table>
              <b-spinner style="width: 3rem; height: 3rem;" class="ml-auto"></b-spinner>
            </div>
          </div>
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
  data() {
    return {
        project: null,
        apiData: {},
        deploying: false,
        deployStatus: [{title: 'Deploying ...'}],
        success: false,
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
      return items
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
      return items
    },
    startDeployment(workflowName){

      this.deploying = true;
      this.deployStatus.push({title: 'Fetching Repo'});

      // Fetching workflow ID
      const username = 'leandergebhardti8';
      const password = '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';

      let workflows = []

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
          workflows = response.data.workflows
          // this.runs = response.data.workflow_runs
        ))
        .catch(error => {
          this.errorMessage = error.message;
          console.error("There was an error!", error);
      });

      const workflowToBeExecuted = workflows.find(workflow => workflow.name === workflowName)
      console.log(`Filtered workflow: ${workflowToBeExecuted}`)

      // Create workflow dispatcher event
      axios.interceptors.request.use(config => {
      // perform a task before the request is sent
      console.log('Post workflow dispatcher event');

      return config;
      }, error => {
        // handle the error
        return Promise.reject(error);
      })

      axios
        .post(`https://api.github.com/repos/leandergebhardti8/ba-2021/actions/workflows/heroku_deploy.yml/dispatches`, {
          headers: {
            'Authorization': `Basix ${password}`,
            "Content-Type": "application/json"
          },
          auth: {
            username: username,
            password: password
          },
          // owner: 'leandergebhardti8',
          // repo: 'hello-world',
          // workflow_id: 42,
          ref: 'main',
          data: {"event_type":"build"}
      })
      .then(function (response) {
        console.log(response);
        this.deployStatus.push({title: 'Deploying Porject'});
        this.deploying = false;
        setTimeout(function(){ this.deploying = false }, 5000);
      })
    },
    fakeDeploy() {
      this.deploying = true;
      this.deployStatus.push({title: 'Run Action #1'});
      // this.deployStatus.push({title: 'Run Action #2'});
      // this.deployStatus.push({title: 'Run Action #3'});
    }
  },
  mounted () {

    
  },
  created() {
    const projectId = this.$route.params.projectId;
    this.project = this.projects.find(project => project.id === projectId);

    axios.interceptors.request.use(config => {
    // perform a task before the request is sent
    console.log('Requesting runs from API');

    return config;
    }, error => {
      // handle the error
      return Promise.reject(error);
    })


    var username = 'leandergebhardti8';
    var password = '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';

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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .github {
    background-color: black;
    color: white;
    padding: 10px;
    margin-left: 5px;
    border-radius: 15px;
  }
  .github-url {
    background: white;
    color: black;
    padding: 5px;
    border-radius: 5px;
    margin: auto;
    text-decoration: none;
  }
  .project_details {
    margin-top: 2rem !important;
    display: grid;
    grid-template-columns: minmax(20%, 25%) 1fr;
    // font-size: 11px;
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
    p {
      // width: 150px;
      span {
        padding: 10px;
        // color: white;
        border-radius: 5px;
        
        &.success {
          background-color: green;
        }
        &.failure {
          background-color: indianred;
        }
      }
    }
  }
  .stage_view {
    margin: 2rem;
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
  .control_bar {
    // color: black;
  }
</style>
