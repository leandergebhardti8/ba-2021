<template>
    <div class="project">
        <h1>{{project.name}}</h1>
        <div>
          <b-button-group>
            <b-button>Run Actions</b-button>
            <b-dropdown right text="Deploy in ...">
              <b-dropdown-item v-for="env in this.project.environments" :key="env.name">{{ env.name }}</b-dropdown-item>
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
        <p class="github-url" v-if="project.github"><b-icon-github></b-icon-github> <a :href="project.githubURL" target="_blank">{{ project.githubURL }}</a></p>
        
        <div class="project_details">
          
          <div class="build_history">
            <h3>Build History</h3>
            <p>Total workflow runs: {{ apiData.total_count }}</p>
            <hr style="color:black;">
            <b-table hover :items="creteTableWithAPIData(apiData.workflow_runs)"></b-table>
            <!-- <b-list-group class="build_history">
              <b-list-group-item v-for="run in apiData.workflow_runs" :key="run.id">
                  <p>{{ run.name }} <span :class="run.conclusion">{{ run.conclusion }}</span></p>
              </b-list-group-item>
            </b-list-group> -->
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
    }
  },
  mounted () {
   
  },
  created() {
    const projectId = this.$route.params.projectId;
    this.project = this.projects.find(project => project.id === projectId);

     axios.interceptors.request.use(config => {
      // perform a task before the request is sent
      console.log('Request was sent');

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
    // font-size: 11px;
  }
  .build_history {
    list-style: none;
    text-align: left;
    background-color: white;
    width: 20%;
    color: black;
    h3 {
      color: white;
      text-align: center;
      background-color: #1E92CC;
      padding: 15px;
      margin: 0;
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
</style>
