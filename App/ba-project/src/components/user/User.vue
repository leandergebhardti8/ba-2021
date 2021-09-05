<template>
    <div class="user">
        <h1>Userpage</h1>
        <hr>
        <div class="userinfo">
          <b-form-group
            id="full-name"
            label="Full name: "
            label-for="full-name"
          >
            <b-form-input id="full-name" v-model="user.full_name" placeholder="Full Name"></b-form-input>
          </b-form-group>
          <b-form-group
            id="username"
            label="Username: "
            label-for="username"
          >
            <b-form-input id="username" v-model="user.username" placeholder="Username"></b-form-input>
          </b-form-group>
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
    this.GetUser();
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
    // background: white;
    border-radius: 15px;
    text-align: left;
    margin-left: 40vw;
    width: 20vw;
    color: white;
    align-content: center;
  }
</style>
