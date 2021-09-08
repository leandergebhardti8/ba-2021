<template>
    <div class="user">
        <h1>Userpage</h1>
        <hr>
          <h3>Profile</h3>
          <div class="profile">
            <b-form-group
              id="full-name"
              label="Full name:"
              label-for="full-name"
              class="info-field"
            >
              <b-form-input id="full-name" v-model="user.full_name" placeholder="Full Name"></b-form-input>
            </b-form-group>
            <div>
              <button v-if="onChange" @click="navigateToHome" class="btn btn-primary">Save</button>
              <button v-if="onChange" @click="navigateToHome" class="btn btn-primary">Cancel</button>
            </div>
            <b-form-group
              id="username"
              label="Username: "
              label-for="username"
            >
              <b-form-input id="username" v-model="user.username" placeholder="Username"></b-form-input>
            </b-form-group>
          </div>
        <hr>
        <h3>Password</h3>
        <div class="profile">
          <b-form-group
            id="current-password"
            label="Current Password"
            label-for="current-password"
            class="info-field"
          >
            <b-form-input id="current-password" v-model="userUpdate.password" type="password" placeholder="enter your current password"></b-form-input>
          </b-form-group>
          <b-form-group
            id="newpassword"
            label="New Password: "
            label-for="newpassword"
            class="info-field"
          >
            <b-form-input id="newpassword" v-model="userUpdate.newpassword" placeholder="enter a new password"></b-form-input>
          </b-form-group>
          <b-form-group
            id="confirmpassword"
            label="Confirm New Password: "
            label-for="confirmpassword"
            class="info-field"
          >
            <b-form-input id="confirmpassword" v-model="userUpdate.newpassword" placeholder="enter the password again"></b-form-input>
          </b-form-group>
          <button @click="navigateToHome" class="btn btn-secondary"><strong>Update Password</strong></button>
        </div>
          <hr>
          <h3>Remove Account</h3>
          <div class="profile">
            <button @click="navigateToHome" class="btn btn-danger"> <b-icon-exclamation-octagon></b-icon-exclamation-octagon> <strong>Delete Account</strong></button>
            <p class="button-text">Deleting your account is irreversible!</p>
          </div>
          <hr>
        <button @click="navigateToHome" class="btn btn-primary">Go to Home</button>
    </div>
</template>

<script>
 import { mapActions ,mapGetters } from 'vuex'  

export default {
  name: 'User',
  data() {
      return {
        onChange: false,
        userUpdate: {
          password: '',
          newpassword: '',
          username: '',
          full_name: '',
        },
      }
  },
  created(){
    this.GetUser(this.user);
  },
  watch: {
    user: function (){
      return this.onChange = true;
    },
  },
  computed: {
    ...mapGetters({user: "StateUser"}),
  },
  props: {

  },
  methods: {
    ...mapActions(['GetUser', 'UpdateUser']),
      navigateToHome() {
          this.$router.push('/');
      },
      async updateUser() {
        try {
        await this.UpdateUser(this.userUpdate);
      } catch (error) {
        console.log('Error accured while updating User info' + error)
      }
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

  .profile {
    padding: 15px;
    // background: white;
    border-radius: 15px;
    text-align: left;
    margin-left: 40vw;
    width: 20vw;
    color: white;
    align-content: center;
  }

  .info-field {
    margin-bottom: 1rem;
  }

  .button-text{
    display: inline;
    margin-left: 2rem;
  }

</style>
