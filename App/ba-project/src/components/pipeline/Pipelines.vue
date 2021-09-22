<template>
    <div class="pipeline-list-wrapper">
      <ul
        v-for="workflow in workflows"
        :key="workflow.id"
      >
        <Pipeline 
          :runId="getRunIdForWorkflow(workflow.name)" 
          :workflow="workflow"
          :modalName="workflow.id"
          class="pipeline-list-element"/>
        <hr>
      </ul>
      <b-button v-b-toggle.sidebar-right class="log-button">View Logs</b-button>
      <b-sidebar 
      id="sidebar-right" 
      title="Logs" 
      right 
      shadow
    >
      <div class="px-3 py-2 log-wrapper">
        <p class="log">
          {{ jobLog }}
        </p>
      </div>
    </b-sidebar>
    </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import Pipeline from './Pipeline.vue'

export default {
  name: 'Pepelines',
  data() {
    return {
      jobLog: null,
    }
  },
  props: [
    'workflows',
    'runs',
  ],
  created() {

  },
    mounted() {
    this.getJobLog();
  },
  computed: {
    ...mapGetters({project: "StateProject"}),
  },

  components: {
    Pipeline: Pipeline,
  },
  methods: {
    getRunIdForWorkflow(workflowName){
      let runId = null;
      console.log(workflowName)
        for(let index = 0; index < this.runs.workflow_runs.length; index++) {
          if(workflowName === this.runs.workflow_runs[index].name){
            runId = this.runs.workflow_runs[index].id
            console.log("Found RunId for " + "workflowName" + runId)
          }
        }
      return runId;
    },
     getJobLog() {  
      const dispatchUrl = `https://api.github.com/repos/${this.project.repoOwner}/${this.project.repoName}/actions/jobs/3574855812/logs`
      
      axios.interceptors.request.use(config => {
        // perform a task before the request is sent
        console.log('Requesting logs from API');
        return config;
      }, error => {
        // handle the error
        return Promise.reject(error);
      })
      axios
        .get(dispatchUrl, {
          headers: { 
            Accept: "application/vnd.github.v3+json"
          },
          auth: {
            username: this.project.repoOwner,
            password: this.project.githubToken
          },
      })
      .then(response => (
        this.jobLog = response.data
      ))
      .catch(error => {
        console.error("There was an error while getting workflow job logs", error);
      });
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
 @import url('https://fonts.googleapis.com/css?family=Azeret Mono');

    h1 {
      display: inline-block;
    }

    .pipeline-list-element {
      width: 100%;
      overflow: hidden;
    }

    .pipeline-list-element:first-of-type {
      margin-top: 1rem;
    }

    .log-wrapper {
      text-align: left;
      background-color: #1d1f21;
    }

    .log {
      font-family: 'Azeret Mono';
      color: #C5C8C6;
    }

    .log-button {
      margin: 1rem;
    }

</style>
