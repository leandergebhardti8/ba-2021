<template>
    <div class="login">
      <div>
        <h1>Login</h1>
        <h2>Welcome!</h2>
            <div>
              <label class="sr-only" for="inline-form-input-username">Username</label>
              <b-form inline>
                  <b-form-input
                    id="inline-form-input-name"
                    class="mb-2 mr-sm-2 mb-sm-0"
                    placeholder="Max Muster"
                    v-model="username"
                  ></b-form-input>
                  <b-form-invalid-feedback :state="usernameValidation">
                    Your username must be 5-12 characters long.
                  </b-form-invalid-feedback>
                  <b-form-valid-feedback :state="usernameValidation">
                    <b-icon-check></b-icon-check>Looks Good.
                  </b-form-valid-feedback>
                  <label class="sr-only" for="inline-form-input-username">Password</label>
                  <div @click="togglePassword" class="eye-icon">
                    <b-icon-eye-fill v-if="showPassword"></b-icon-eye-fill>
                    <b-icon-eye-slash-fill v-if="!showPassword"></b-icon-eye-slash-fill>
                  </div>
                  
                  <b-form-input :type="this.type" id="inline-form-input-password" v-model="password"></b-form-input>
                  <b-form-invalid-feedback :state="passwordValidation">
                    Your password must be 5-12 characters long.
                  </b-form-invalid-feedback>

                  <b-form-invalid-feedback :state="passwordValidationNumbers">
                    Your password must contain numbers.
                  </b-form-invalid-feedback>
                  <b-form-valid-feedback :state="passwordValidationNumbers">
                  <b-icon-check></b-icon-check> Your password must contain numbers.
                  </b-form-valid-feedback>
                  <b-form-invalid-feedback :state="passwordSpecial">
                    Your password must contain Special Characters.
                  </b-form-invalid-feedback>
                  <b-form-valid-feedback :state="passwordSpecial">
                  <b-icon-check></b-icon-check> Your password must contain Special Characters.
                  </b-form-valid-feedback>
                  <b-form-valid-feedback :state="passwordValidation">
                   <b-icon-check></b-icon-check> Looks Good.
                  </b-form-valid-feedback>
                  <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-1">Remember me</b-form-checkbox>

                  <button type="submit" variant="success" class="login-button">Login</button>
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
      showPassword: false
    }
  },
  methods: {
    togglePassword() {
      console.log('triggered!')
      if(this.showPassword) this.showPassword = false;
      else this.showPassword = true;

      if(this.type === 'password') this.type = 'text';
      else if(this.type === 'text') this.type = 'password';
    }
  }, 
  computed: {
    usernameValidation() {
      return this.username.length > 4 && this.username.length < 13
    },
    passwordValidation() {
      return this.password.length > 4 && this.password.length < 13
    },
    passwordValidationNumbers() {
      return /\d/.test(this.password);
    },
    passwordSpecial() {
      return /[!@#$%^&*)(+=._-]/.test(this.password);
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
      display: grid;
      place-items: center;
  }
  b-input-group {
    margin-top: 15px;
  }
  .login-button {
    margin: 2rem;
  }
  .eye-icon {
    margin: auto;
    margin-left: 15px;
    display: inline-block;
    cursor: pointer;
  }

  input {
    border-radius: 15px;
  }

  form {
    width: 300px;
  }

  button {
    background-color: #1CB5E0;
    border: none;
    border-radius: 15px;
    padding: 10px 35px 10px 35px;
    color: white;
    font-weight: 600;

    &:hover {
      background-color: #168dad;
      border: 1px solid white;
    }
  }
</style>
