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
          :running="running"
          class="pipeline-list-element"
        />
        <hr>
      </ul>
    </div>
</template>

<script>
import Pipeline from './Pipeline.vue'

export default {
  name: 'Pepelines',
  data() {
    return {

    }
  },
  props: [
    'workflows',
    'runs',
    'running',
  ],
  components: {
    Pipeline: Pipeline,
  },
  methods: {
    getRunIdForWorkflow(workflowName){
      let runId = null;
      let found = false;

        // Searching for RunID in workflows
        for(let index = 0; index < this.runs.workflow_runs.length; index++) {
          if(found) break;
          if(workflowName === this.runs.workflow_runs[index].name){
            runId = this.runs.workflow_runs[index].id
            found = true;
          }
        }
      return runId;
    },
  },
}
</script>

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
