<template>
    <div class="pipeline-wrapper">
      <!-- <ul
        v-for="workflow in workflows"
        :key="workflow.id"
      > -->
        <Pipeline />
      <!-- </ul> -->
    </div>
</template>

<script>
import { mapGetters } from 'vuex'   
import Pipeline from './Pipeline.vue'

export default {
  name: 'Pepelines',
  data() {
    return {
        workflowJobs: null,
    }
  },
  computed: {
    ...mapGetters({project: "StateProject"}),
  },
  props: [
    'workflows'
  ],
  components: {
    Pipeline: Pipeline,
  },
  methods: {
    generatePipeline() {
      for(let index = 0; index < this.workflows.length; index++) {
        this.workflows[index]; 
        this.getWorkflowRun(this.workflows[index].jobs[0].id);
      }  
    }

  },
  created() {
    //Get Project ID From route
    let projectId = this.$route.params.projectId;

    this.GetProject(projectId);
  },
  mounted() {
    this.getWorkflowRun('1224290133');
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    h1 {
      display: inline-block;
    }

</style>
