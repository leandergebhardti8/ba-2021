<template>
    <div class="project">
        <h1>{{project.name}}</h1>
        <hr>
        <h2 class="info">{{ project.name }} (ID: {{ project.id }})</h2>
        <p class="github-url" v-if="project.github"><b-icon-github></b-icon-github> <a :href="project.githubURL" target="_blank">{{ project.githubURL }}</a></p>
        <h2>Total workflow runs: {{ info.data.total_count }}</h2>
        <!-- ![superlinter](https://github.com/leandergebhardti8/ba-2021/actions/workflows/superlinter.yml/badge.svg)
        ![node](https://github.com/leandergebhardti8/ba-2021/actions/workflows/node.yml/badge.svg) -->
        <div>
          <ul>
            <li v-for="run in this.info.data.worflow_runs" :key="run.id">
                <p>{{ run.name }}</p>
            </li>
          </ul>
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
        projectId: '',
        info: null
    }
  },
  mounted () {
    axios.interceptors.request.use(config => {
      // perform a task before the request is sent
      console.log('Request was sent');

      return config;
    }, error => {
      // handle the error
      return Promise.reject(error);
    })

    // sent a GET request
    // TODO Get API request working
    // const headers = { "Content-Type": "application/json" };
    var username = 'leandergebhardti8';
    var password = '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';
    // const authorization = {'Authorization': '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'};
    // var credentials = btoa(username + ':' + password);
    // var basicAuth = 'Basic' + credentials;
    axios
      .get('https://api.github.com/repos/leandergebhardti8/ba-2021/actions/runs', { 
        auth: {
          username: username,
          password: password
        }
       })
      .then(response => (
        this.info = response
      ))
      .catch(error => {
      this.errorMessage = error.message;
      console.error("There was an error!", error);
    });
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
  .github-url {
      background: white;
      color: black;
      padding: 5px;
      border-radius: 5px;
      margin: auto;
      text-decoration: none;
  }
</style>
