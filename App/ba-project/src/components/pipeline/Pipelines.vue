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
      </ul>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pipeline from './Pipeline.vue'

export default {
  name: 'Pepelines',
  data() {
    return {

    }
  },
  created() {

  },
  mounted() {

  },
  computed: {
    ...mapGetters({project: "StateProject"}),
  },
  props: [
    'workflows',
    'runs',
  ],
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
    }
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

</style>
