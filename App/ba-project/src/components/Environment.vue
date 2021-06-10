<template>
    <div class="environments">
        <h1>Environments</h1>
    </div>
</template>

<script>
export default {
  name: 'User',
  props: {
    msg: String
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
