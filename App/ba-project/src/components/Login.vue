<template>
    <div class="login">
      <div>
        <h1>Login</h1>
            <div>
              <b-form inline>
                  <b-form-input
                    id="inline-form-input-name"
                    class="mb-2 mr-sm-2 mb-sm-0"
                    placeholder="Username"
                    v-model="username"
                  ></b-form-input>
                  <b-input-group prepend="🔒" class="mb-2 mr-sm-2 mb-sm-0">
                  <b-form-input :type="this.type" id="inline-form-input-password" placeholder="Password" v-model="password"></b-form-input>
                  </b-input-group>

                  <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0">Remember me</b-form-checkbox>
                  <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0" @click="showPassword">Show Password</b-form-checkbox>

                  <b-button type="submit" variant="success" class="login-button">Login</b-button>
              </b-form>
              <p v-if="showError">Username already exists</p>
            </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Login',
  props: {
  }, 
  data() {
    return {
      username: '',
      password: '',
      type: 'password',
      showError: false,
    }
  },
  methods: {
    showPassword(el) {
      el.type = 'text';
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
  .login {
      // width: 25vw;
      display: grid;
      place-items: center;
      // margin: auto auto auto auto;
  }
  b-input-group {
    margin-top: 15px;
  }
  .login-button {
    margin: 2rem;
  }
</style>
