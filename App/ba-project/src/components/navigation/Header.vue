<template>
<div class="navbar">
  <b-nav pills>
    <router-link to="/" tag="b-navbar-brand" active-class="active"><a>Usus ⚙️</a></router-link>
    <router-link to="/projects" tag="b-nav-item" active-class="active"><a>Projects</a></router-link>
    <!-- <router-link to="/environments" tag="b-nav-item" active-class="active"><a>Environments</a></router-link> -->
    <router-link :to="/user/+user" tag="b-nav-item" active-class="active"><a>Profile</a></router-link> 
    <span v-if="isLoggedIn">
      <b-nav-item><a @click="logout">Logout</a></b-nav-item>
    </span>
    <span v-else>
      <router-link to="/register" tag="b-nav-item" active-class="active"><a>Register</a></router-link> 
      <router-link to="/login" tag="b-nav-item" active-class="active"><a>Login</a></router-link>
    </span>
    <b-nav-item-dropdown
      id="my-nav-dropdown"
      text="Dropdown"
      toggle-class="nav-link-custom"
      right
    >
      <b-dropdown-item>Two</b-dropdown-item>
      <b-dropdown-divider></b-dropdown-divider>
      <b-dropdown-item>Three</b-dropdown-item>
    </b-nav-item-dropdown>
  </b-nav>
</div>
</template>

<script>
import { mapGetters } from 'vuex' 

export default {
  name: 'Header',
  computed: {
    isLoggedIn: function(){ return this.$store.getters.isAuthenticated},
    ...mapGetters({user: "StateUser"}),
  },
  methods: {
    async logout() {
      await this.$store.dispatch('LogOut')
      this.$router.push('/login')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .navbar {
    background: black;
    color: white;
    padding: 0.5rem;
  }
  a {
    color: white !important;
    text-decoration: none;
  }
  li {
    
    &:hover {
      border-radius: 5px 5px 0 0;
      background-color: #1CB5E0;
    }
  }
</style>
