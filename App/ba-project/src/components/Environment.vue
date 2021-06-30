<template>
    <div class="environments">
        <h1>{{ environment.name }}</h1>
    </div>
</template>

<script>
export default {
  name: 'Environment',
  inject: [
    'projects'
  ], 
  data() {
    return {
        environment: null,
        projectId: '',
        apiData: {},
    }
  },
  created() {
    const environmentId = this.$route.params.environmentId;
    let environemtFound;
    for(let index = 0; index < this.projects.length; index++) {
      environemtFound = this.projects[index].environemnts.find(environment => environment.id === environmentId);
    }
    this.environment = environemtFound;
  },
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
