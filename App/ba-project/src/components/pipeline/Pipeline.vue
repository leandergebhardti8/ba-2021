<template>
    <div class="pipeline-wrapper"> 
      <img :src="workflow.badge_url" alt="badge" class="job-badge">
      <ul class="pipe-container">
        <li
          class="job-item"
          v-for="job in workflowJobs.jobs"
          :key="job.id"
        >
          <div class="job-details">
          <h4 class="job-detail-name">{{ job.name }}</h4>
          <p class="job-detail-item"><strong>Started: {{ getEuropeanTime(job.started_at) }}</strong></p>
          </div>

          <ul>
            <li 
              class="pipe-wrapper"
              v-for="step in job.steps"
              :key="step.name"
            >
              <div :class="step.conclusion === 'success' ? 'pipe-node job-success' : 'pipe-node job-failure'">
                <h4>{{ step.name }}</h4>
                <p>Took {{ mesureTime(step.started_at, step.completed_at) }}s</p>
              </div>
            </li>
          </ul>
        </li>
      </ul>
      
      <b-button v-b-toggle="`sidebar-right-${sidebarType}`" @click="getJobLog(workflowJobs.jobs[0].id)" class="log-button">View Logs</b-button>

      <!-- Sidebar -->
      <b-sidebar 
      :id="`sidebar-right-${sidebarType}`" 
      :title="workflow.name + ' Logs'" 
      right 
      shadow
    >
      <div class="px-3 py-2 log-wrapper">
        <b-skeleton-wrapper :loading="loading">
          <template #loading>
            <p class="log">
              <b-skeleton width="85%"></b-skeleton>
              <b-skeleton width="55%"></b-skeleton>
              <b-skeleton width="70%"></b-skeleton>
            </p>
          </template>
          <p class="log">
            {{ jobLog }}
          </p>
        </b-skeleton-wrapper>
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
        loading: false,

    }
  },
  computed: {
    ...mapGetters({project: "StateProject"}),
  },
  props: [
    'workflow',
    'runId',
    'sidebarType'
  ],
  created() {

  },
  mounted() {
    this.getWorkflowRun(this.runId);
  },
  methods: {
    getWorkflowRun(run_id) {
      if(run_id != null){
        const dispatchUrl = `https://api.github.com/repos/${this.project.repoOwner}/${this.project.repoName}/actions/runs/${run_id}/jobs`
        
        axios.interceptors.request.use(config => {
          // perform a task before the request is sent
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
      }
    },
    getJobLog(runId) {  
      this.loading = true;
      const dispatchUrl = `https://api.github.com/repos/${this.project.repoOwner}/${this.project.repoName}/actions/jobs/${runId}/logs`
      
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
      this.loading = false
    },
    mesureTime(startTime, endTime) {
      let start = new Date(startTime)
      let end = new Date(endTime)
      return (end - start) / 1000;
    },
    getEuropeanTime(dateString) {
      var date = new Date(dateString);
      return date.getDate()+"."+(date.getMonth() + 1)+"."+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
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

    h4 {
      font-size: 13px;
    }

    p {
      font-size: 11px;
    }

    .pipe-container {
      float: left;
      width: 100%;
      padding: 0;
    }

    .job-item {
      width: 100%;
      float: left;
      list-style: none;
    }

    .job-item:nth-child(even){
      background: #f2f2f2;
    }

    .pipe-wrapper {
      list-style: none;
      position: relative;
      float: left;
      width: 250px;

      &:before {
        content: '';
        position: absolute;
        top: 4.9em;
        left: 14.4em;
        width: 3.2em;
        height: .2em;
        background: dodgerblue;
        z-index: 1;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.65);
      }
    }

    .pipe-wrapper:last-of-type:before {
        display: none;
    }
    
    .pipe-node {
      border: 1px solid black;
      padding: 15px;
      border-radius: 6px;
      margin: 2rem;
      display: inline-block;
      float: left;
      position: relative;
      width: 200px;
      z-index: 2;
      -webkit-box-shadow: 0px 3px 9px 0px rgba(0,0,0,0.75);
      -moz-box-shadow: 0px 3px 9px 0px rgba(0,0,0,0.75);
      box-shadow: 0px 3px 9px 0px rgba(0,0,0,0.75);
    }

    .job-success {
      background-color: #d1e7dd;
    }

    .job-failure {
      background-color: #f8d7da;
    }

    .job-badge {
      float: left;
      margin: 15px 0;
    }

    .job-details {
      display: block;
      margin: 10px;
    }

    .job-detail-item {
      width: 30%;
      display: inline-block;
    }

    .job-detail-name {
      float: left;
      padding: 8px;
      color: white;
      background-color: rgb(62, 68, 83);
      border-radius: 6px;
      font-weight: 600;
    }

    .log-wrapper {
      text-align: left;
      background-color: #1d1f21;
    }

    .log {
      font-family: 'Azeret Mono';
      color: white;
      overflow: auto;
    }

    .log-button {
      margin: 1rem;
    }


</style>
