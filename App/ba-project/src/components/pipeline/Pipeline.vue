<template>
    <div class="pipeline-wrapper">
      <b-button v-b-toggle.sidebar-right>Logs</b-button>
      <ul class="pipe-container">
        <li 
          class="pipe-wrapper"
          v-for="job in workflowJobs.jobs[0].steps"
          :key="job.name"
        >
          <div :class="job.conclusion === 'success' ? 'pipe-node job-success' : 'pipe-node job-failure'">
            <h4>{{ job.name }}</h4>
            <p>{{ job.started_at }}</p>
            <p>{{ job.completed_at }}</p>
          </div>
        </li>
      </ul>
    <b-sidebar id="sidebar-right" :title="workflowJobs.jobs[0].name + ' Logs'" right shadow>
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

export default {
  name: 'Pepeline',
  data() {
    return {
        workflowJobs: null,
        jobLog: '',
    }
  },
  computed: {
    ...mapGetters({project: "StateProject"}),
  },
  props: [
    'workflows'
  ],
  methods: {
    getWorkflowRun(run_id) {
      // https://api.github.com/repos/leandergebhardti8/ba-2021/actions/runs/1224290133/jobs  3574855812
      const dispatchUrl = `https://api.github.com/repos/${this.project.repoOwner}/${this.project.repoName}/actions/runs/${run_id}/jobs`
      console.log("Why is this working so great!")
      
      axios.interceptors.request.use(config => {
        // perform a task before the request is sent
        console.log('Requesting runs from API');
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
        this.workflowJobs = response.data
      ))
      .catch(error => {
        console.error("There was an error while getting workflow jobs", error);
      });
    },

    getJobLog(jobId) {  
      const dispatchUrl = `https://api.github.com/repos/${this.project.repoOwner}/${this.project.repoName}/actions/jobs/${jobId}/logs`
      console.log("Why is this working so great!")
      
      axios.interceptors.request.use(config => {
        // perform a task before the request is sent
        console.log('Requesting runs from API');
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
        console.error("There was an error while getting workflow jobs", error);
      });
    }

  },
  created() {
    //Get Project ID From route
    let projectId = this.$route.params.projectId;

    this.GetProject(projectId);
  },
  mounted() {
    this.getWorkflowRun('1224290133');
    this.getJobLog('3574855812');
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
 @import url('https://fonts.googleapis.com/css?family=Azeret Mono');

    h1 {
      display: inline-block;
    }

    h4 {
      font-size: 13px;
    }

    p {
      font-size: 11px;
    }

    .pipeline-container {
      float: left;
      width: 100%;
    }

    .pipe-wrapper {
      list-style: none;
      position: relative;
      float: left;
      max-width: 260px;

      &:before {
        content: '';
        position: absolute;
        top: 5.9em;
        left: 14.1em;
        width: 4em;
        height: .2em;
        background: dodgerblue;
        z-index: 1;
      }
    }
    
    .pipe-node {
      border: 1px solid black;
      padding: 15px;
      border-radius: 25px;
      margin: 2rem;
      display: inline-block;
      float: left;
      position: relative;
      -webkit-box-shadow: 0px 7px 21px 0px rgba(0,0,0,0.75);
      -moz-box-shadow: 0px 7px 21px 0px rgba(0,0,0,0.75);
      box-shadow: 0px 7px 21px 0px rgba(0,0,0,0.75);
    }

    .job-success {
      background-color: #d1e7dd;
    }

    .job-failure {
      background-color: #f8d7da;
    }

    .log-wrapper {
      text-align: left;
      background-color: #1d1f21;
    }

    .log {
      font-family: 'Azeret Mono';
      color: #C5C8C6;
    }

</style>
