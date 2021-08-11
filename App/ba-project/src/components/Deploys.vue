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
        <div class="deploy-methods" v-if="deployMethodIsDefined">
            <ul class="deploy-method-items">
                <router-link 
                    :to="'/project/' + project.id + '/' + deployMethod.name" 
                    tag="li"
                    v-for="deployMethod in this.project.deployMethods" 
                    :key="deployMethod.name"
                    class="method-item-button"
                >
                    <Deploy 
                        v-if="deployMethodIsDefined" 
                        :deployMethod="deployMethod" 
                        @deleteDeploymentMethod="deleteDeployMethod"
                    />
                <span class="delete-button" @click="deleteDeployMethod(deployMethod.name)">
                    <b-icon-x 
                        font-scale="2.5" 
                        variant="danger" 
                        v-b-tooltip.hover.left="'Delete Deployment Method'">
                    </b-icon-x>
                </span>
                </router-link>
            </ul>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import Deploy from './Deploy.vue'

export default {
  name: 'Deploys',
//   inject: [
//       'projects'
//   ],
  data() {
      return {
        projectId : null,
        project: undefined,
        projects: undefined,
        deployMethodIsDefined: false,
        // herokuIconURL: `../assets/icons/heroku-icon.svg`,
        deployMethod: {
            name: '',
            environments: []
        }
      }
  },
  components: {
      Deploy: Deploy
  },
  methods: {
        navigateToProjects() {
            this.$router.push('/projects');
        },
        addDeployMethod(methodName) {
            let newDeploymentMethod = {
                name: methodName,
                environments: [],
            }

            this.project.deployMethods.push(newDeploymentMethod);
            axios.put(`http://localhost:8080/api/project/${this.project._id}`, this.project)
            .then(response => {
                this.project.id = response.data.id;
                console.log(`Updating project ${response.data}`)
                this.updateProject();
            })
            .catch(err => {
                console.log(err);
            })
        },
        deleteDeployMethod(methodName) {
            this.project.deployMethods.pop(method => method.name === methodName);
            axios.put(`http://localhost:8080/api/project/${this.project._id}`, this.project)
            .then(response => {
                this.project.id = response.data.id;
                console.log(`Updating projects ${response.data}`)
                this.updateProject();
            })
            .catch(err => {
                console.log(err);
            })
        },
        deployMethodDefined() {
            this.deployMethodIsDefined = this.project.deployMethods.length > 0;
        },
        updateProject() {
            axios.get(`http://localhost:8080/api/project/${this.projectId}`)
            .then(response => {
                this.project = response.data;
                this.deployMethodDefined();
            })
            .catch(err => {
                console.log(err);
            })
        }
    },
    created() {
        // this.project = this.projects.find(project => project.id === projectId);
    },
    mounted() {
        this.projectId = this.$route.params.projectId;
        this.updateProject()
    }
}
</script>

<style scoped lang="scss">
    h1 {
        text-align: center;
    }

    .close_btn {
      left: 0;
      float: left;
      position: absolute;
      margin: 1.75rem;
    }

    .select_deploy_method {
        position: relative;
        margin: 0 0 2rem;
        text-align: center;
    }

    .method-item-button {
        background: white;
        border-radius: 5px;
        color: black;
        border-bottom: 1px solid black;
        padding: 15px;
        width: 97%;
        display: flex;
        flex-wrap: wrap;
        cursor: pointer;
    }

    .delete-button {
        flex: 1 1; /*  Stretching: */
        flex: 0 1; /*  No stretching: */
        margin-top: auto;
        margin-bottom: auto;
        margin-left: auto;
        margin-right: 1rem;
        &:hover {
            transform: scale(1.5);
        }
    }
</style>
