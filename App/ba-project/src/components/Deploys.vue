<template>
    <div class="deploy-wrapper">
        <button @click="navigateToProjects" class="btn btn-primary close_btn"><b-icon-arrow-left></b-icon-arrow-left> Go back to Projects</button>
        <h1>Deploy Methods</h1>

        <div class="select_deploy_method">
          <b-button-group>
            <b-dropdown right text="Select Deploy Method" variant="primary">
              <b-dropdown-item @click="addDeployMethod('Heroku')">
                Heroku
              </b-dropdown-item>
              <b-dropdown-item @click="addDeployMethod('S3')">
                (S3)
              </b-dropdown-item>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item>
                Coming soon
              </b-dropdown-item>
            </b-dropdown>
          </b-button-group>
        </div>

        <ul class="deploys">
            <router-link 
                :to="'/project/' + project.id + '/' + deployMethod.name" 
                tag="li"
                v-for="deployMethod in this.project.deployMethods" 
                :key="deployMethod.name"
                class="deploy-item">
                <img src="../assets/icons/heroku-icon.svg" alt="Heroku_Icon" v-if="deployMethod.name === 'Heroku'"> <img src="../assets/icons/s3-icon.png" alt="S3_Icon" class="s3-icon" v-if="deployMethod.name === 'S3'"> {{ deployMethod.name }}
            </router-link>
        </ul>
    </div>
</template>

<script>
 import axios from 'axios';

export default {
  name: 'Deploys',
//   inject: [
//       'projects'
//   ],
  data() {
      return {
        projectId: 0,
        project: undefined,
        herokuIconURL: `../assets/icons/heroku-icon.svg`,
        deployMethod: {
            name: '',
            environments: []
        }
      }
  },
  computed: {
    deployMethodDefined() {
      return this.project.deployMethods.length > 0;
    },
    isHeroku() {
        let heroku;
        for (let index = 0; index < this.project.deployMethods.length; index++) {
            heroku = this.project.deployMethods[index].name === 'Heroku';   
        }
        return heroku;
    },
    isS3() {
       let s3;
        for (let index = 0; index < this.project.deployMethods.length; index++) {
            s3 = this.project.deployMethods[index].name === 'S3';   
        }
        return s3; 
    },
  },
  methods: {
    navigateToProjects() {
        this.$router.push('/projects');
    },
    addDeployMethod(methodName) {
        this.project.deployMethods.push({name: methodName, environments: []});
    },
    },
    created() {
        this.projectId = this.$route.params.projectId;
        // this.project = this.projects.find(project => project.id === projectId);
        axios.get(`http://localhost:8080/api/project/${this.projectId}`)
        .then(response => {
            this.project = response.data;
        })
        .catch(err => {
            console.log(err);
        })
    }
}
</script>

<style scoped lang="scss">
    h1 {
        text-align: center;
    }
    .deploy-wrapper {
        text-align: left;
    }
    ul {
        list-style-type:none;
    }
    .template {
        width: 45%;
        margin: 0 2rem;
    }
    button {
        margin: 15px 2rem;
    }
    label {
        margin: 0;
    }
    .deploy-item {
        cursor: pointer;
    }
    .deploy-item{
        background: white;
        border-radius: 5px;
        color: black;
        border-bottom: 1px solid black;
        margin: 0px !important;
        text-align: left;
        padding: 15px;
        font-weight: 500;
    }
    .close_btn {
      left: 0;
      float: left;
      position: absolute;
      margin: 1.75rem;
    }
    .select_deploy_method {
        position: relative;
        // -ms-transform: translateX(50%);
        // transform: translateX(50%);
        margin: 0 0 2rem;
        text-align: center;
    }
    .s3-icon {
        width: 64px;
        height: 64px;
    }
</style>
