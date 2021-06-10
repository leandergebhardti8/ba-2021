<template>
    <div class="user">
        <h1>Project Page</h1>
        <hr>
        <h2>CI / CD Tool</h2>
        <div>Total workflow runs: {{ info.run_number }}</div>
        <!-- ![superlinter](https://github.com/leandergebhardti8/ba-2021/actions/workflows/superlinter.yml/badge.svg)
        ![node](https://github.com/leandergebhardti8/ba-2021/actions/workflows/node.yml/badge.svg) -->
    </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'User',
  props: {
    msg: String
  }, 
  data() {
    return {
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
    
    const headers = { "Content-Type": "application/json" };
    // const authorization = {'Authorization': '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'};
    axios
      .get('https://api.github.com/repos/leandergebhardti8/ba-2021/actions/runs', { headers })
      .then(response => (this.info = response))
      .catch(error => {
      this.errorMessage = error.message;
      console.error("There was an error!", error);
    });
  },
  methods: {
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .navbar {
    background: black;
    color: white;
  }
  a {
    color: white !important;
  }
  .nav-link {
    color: white;
    
    &:hover {
      color: white;
    }
  }
</style>
