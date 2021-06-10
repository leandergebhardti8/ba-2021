<template>
    <div class="user">
        <h1>Userpage</h1>
        <p>User ID: {{ id }}</p>
        <hr>
        <button @click="navigateToHome" class="btn btn-primary">Go to Home</button>
    </div>
</template>

<script>
export default {
  name: 'User',
  data() {
      return {
          id: this.$route.params.id
      }
  },
  watch: {
      '$route'(to){
          this.id = to.params.id;
      }
  },
  props: {

  },
  methods: {
      navigateToHome() {
          this.$router.push('/');
      }
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
