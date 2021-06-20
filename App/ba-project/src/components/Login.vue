<template>
    <div class="login">
      <div class="left-half">
        <h2>Login to continue</h2>
      </div>
      <div class="right-half">
        <h1>Welcome!</h1>
        <p>Please login with your personal data.</p>
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
                    <b-icon icon="exclamation-triangle"></b-icon> Your username must be 5-12 characters long.
                  </b-form-invalid-feedback>
                  <b-form-valid-feedback :state="usernameValidation">
                    <b-icon-check></b-icon-check>Looks Good.
                  </b-form-valid-feedback>
                  <label class="sr-only" for="inline-form-input-username">Password</label>
                  <div @click="togglePassword" class="eye-icon">
                    <b-icon-eye v-if="!showPassword"></b-icon-eye>
                    <b-icon-eye-slash v-if="showPassword"></b-icon-eye-slash>
                  </div>
                  
                  <b-form-input :type="this.type" id="inline-form-input-password" v-model="password"></b-form-input>
                  <b-form-invalid-feedback :state="passwordValidation">
                    <b-icon icon="exclamation-triangle"></b-icon>Your password must be at least 6 characters long.
                  </b-form-invalid-feedback>
                  <b-form-valid-feedback :state="passwordValidation">
                   <b-icon-check></b-icon-check> Looks Good.
                  </b-form-valid-feedback>

                  <b-form-invalid-feedback :state="passwordValidationNumbers">
                    <b-icon icon="exclamation-triangle"></b-icon> Your password must contain numbers.
                  </b-form-invalid-feedback>
                  <b-form-valid-feedback :state="passwordValidationNumbers">
                  <b-icon-check></b-icon-check> Your password contains numbers.
                  </b-form-valid-feedback>

                  <b-form-invalid-feedback :state="passwordSpecial">
                    <b-icon icon="exclamation-triangle"></b-icon>Your password must contain Special Characters.
                  </b-form-invalid-feedback>
                  <b-form-valid-feedback :state="passwordSpecial">
                  <b-icon-check></b-icon-check> Your password contains Special Characters.
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
      return this.password.length > 6
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
      display: flex;
      place-items: center;
      grid-template-columns: 50% 50%;
      margin: 10% 25% 10% 25%;
      padding: 5%;
      border-radius: 25px;
      border: 4px solid white;
      -webkit-box-shadow: 10px 10px 19px 0px rgba(0,0,0,0.75);
      -moz-box-shadow: 10px 10px 19px 0px rgba(0,0,0,0.75);
      box-shadow: 10px 10px 19px 0px rgba(0,0,0,0.75);
      background-color: white;
      color: black;
      overflow: hidden;
  }

  .left-half {
    width: 50%;
    margin-right: 2rem;
  }

  .right-half {
    width: minmax(350px ,50%);
    text-align: left;
    // border-left: 1px solid black;
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

  label {
    font-weight: 500;
  }

  input {
    border-radius: 15px;
  }

  form {
    width: 350px;
  }

  button {
    background: linear-gradient(139deg, #1CB5E0 50%, #000851 150%);
    border: none;
    border-radius: 15px;
    padding: 10px 35px 10px 35px;
    color: white;
    font-weight: 600;

    &:hover {
      filter: brightness(75%);
      // border: 1px solid white;
    }
  }

  @media screen and (max-width: 400px) {
    .login{
      padding: 0;
      margin: 0;
    }
  }
</style>
