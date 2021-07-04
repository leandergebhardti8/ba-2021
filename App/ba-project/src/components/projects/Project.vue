<template>
    <div class="project">
        <p class="info">{{ project.name }} <b-icon-github v-if="project.github"></b-icon-github> <img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/leandergebhardti8/ba-2021/node"></p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Project',
  props: [
    'project'
  ], 
  data() {
    return {
      info: null,
    }
  },
  created () {
    axios.interceptors.request.use(config => {
      // perform a task before the request is sent
      console.log('Requesting workflow badge from API');

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
      .get('https://api.github.com/repos/leandergebhardti8/ba-2021/actions/workflows', { 
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
  methods: {
    
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .project{
    background: white;
    border-radius: 5px;
    color: black;
    border-bottom: 1px solid black;
  }
  
  p {
    margin: 0px !important;
    text-align: left;
    padding: 15px;
    font-weight: 500;
  }

  .github {
    background-color: black;
    color: white;
    padding: 10px;
    margin-left: 5px;
    border-radius: 15px;
  }

  .badge {
    
  }
</style>
