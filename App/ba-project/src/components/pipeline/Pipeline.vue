<template>
    <div class="pipeline-wrapper"> 
      <img :src="workflow.badge_url" alt="badge" class="job-badge">
      <ul class="pipe-container">
        <div>
            <p><strong>Started: {{ new Date(getStartingTime()) }}</strong></p>
        </div>
        <li 
          class="pipe-wrapper"
          v-for="job in workflowJobs.jobs[0].steps"
          :key="job.name"
        >
          <div :class="job.conclusion === 'success' ? 'pipe-node job-success' : 'pipe-node job-failure'">
            <h4>{{ job.name }}</h4>
            <p>Took {{ mesureTime(job.started_at, job.completed_at) }}s</p>
          </div>
        </li>
      </ul>
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
    'workflow',
    'modalName',
    'runId',
  ],
  created() {

  },
  mounted() {
    this.getWorkflowRun(this.runId);
  },
  methods: {
    getWorkflowRun(run_id) {
      // https://api.github.com/repos/leandergebhardti8/ba-2021/actions/runs/1224290133/jobs  3574855812
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
    },
    mesureTime(startTime, endTime) {
      let start = new Date(startTime)
      let end = new Date(endTime)
      return (end - start) / 1000;
    },
    getStartingTime() {
      return this.workflowJobs.jobs[0].steps[0].started_at;
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

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
    }


</style>
