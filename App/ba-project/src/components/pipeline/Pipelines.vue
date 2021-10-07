<template>
    <div class="pipeline-list-wrapper">
      <ul
        v-for="workflow in workflows"
        :key="workflow.id"
      >
        <Pipeline 
          :runId="getRunIdForWorkflow(workflow.name)" 
          :workflow="workflow"
          :sidebarType="workflow.id"
          class="pipeline-list-element"/>
        <hr>
      </ul>
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
      workflowJobs: null,
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
      let found = false;
      console.log(workflowName)
        // Searching for fitting Run ID in workflow
        for(let index = 0; index < this.runs.workflow_runs.length; index++) {
          if(found) break;
          if(workflowName === this.runs.workflow_runs[index].name){
            runId = this.runs.workflow_runs[index].id
            found = true;
            console.log("Found RunId: " + runId)
            if(runId) this.getWorkflowRun(runId);
          }
        }
      return runId;
    },
    getWorkflowRun(run_id) {
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
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    h1 {
      display: inline-block;
    }

    .pipeline-list-element {
      width: 100%;
      overflow: hidden;
    }

    .pipeline-list-element {
      margin-top: 1rem;
    }

</style>
