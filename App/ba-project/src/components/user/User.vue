<template>
    <div class="user">
        <h1>Userpage</h1>
        <hr>
        <div class="userinfo">
          <p>Full name: {{ user.full_name }}</p>
          <p>Username: {{ user.username }}</p>
        </div>
        <button @click="navigateToHome" class="btn btn-primary">Go to Home</button>
    </div>
</template>

<script>
 import { mapActions ,mapGetters } from 'vuex'  

export default {
  name: 'User',
  data() {
      return {

      }
  },
  created(){
    this.GetUser(this.user);
  },
  computed: {
    ...mapGetters({user: "StateUser"}),
  },
  props: {

  },
  methods: {
    ...mapActions(['GetUser']),
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

  .userinfo {
    padding: 15px;
    background: white;
    border-radius: 15px;
    text-align: left;
    margin-left: 40vw;
    width: 20vw;
    color: black;
    align-content: center;
  }
</style>
