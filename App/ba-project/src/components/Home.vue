<template>
<div class="home">
    <h1>Home</h1>
    <hr>
    <button @click="navigateToProjects" class="btn btn-primary">Go to Projects</button>
</div>
</template>

<script>


export default {
  name: 'Home',
  props: {
    msg: String
  },
   methods: {
      navigateToProjects() {
          this.$router.push('/projects');
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  h1 {
    padding: 20px;
  }
</style>
