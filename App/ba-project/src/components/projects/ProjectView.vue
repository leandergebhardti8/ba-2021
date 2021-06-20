<template>
    <div class="project">
        <h1>{{project.name}}</h1>
        <hr>
        <h2 class="info">{{ project.name }} (ID: {{ project.id }}) <b-icon-github v-if="project.github"></b-icon-github></h2>
        <!-- <div>Total workflow runs: {{ info.run_number }}</div> -->
        <!-- ![superlinter](https://github.com/leandergebhardti8/ba-2021/actions/workflows/superlinter.yml/badge.svg)
        ![node](https://github.com/leandergebhardti8/ba-2021/actions/workflows/node.yml/badge.svg) -->
    </div>
</template>

<script>
// import axios from 'axios';

export default {
  name: 'ProjectView',
  inject: [
    'projects'
  ], 
  data() {
    return {
        project: null,
        projectId: ''
    }
  },
  computed: {
    
  },
  created() {
    const projectId = this.$route.params.projectId;
    this.project = this.projects.find(project => project.id === projectId);
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
</style>
