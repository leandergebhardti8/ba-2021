<template>
    <div class="deploy-wrapper">
        <button @click="navigateToProjects" class="btn btn-secondary close_btn"><b-icon-chevron-left></b-icon-chevron-left> go back to Projects</button>
        <h1>Deploy Methods</h1>

        <div class="select_deploy_method">
          <b-button-group>
            <b-dropdown right text="Add Deploy Method" variant="primary">
              <b-dropdown-item @click="addDeployMethod('Heroku')">
                Heroku
              </b-dropdown-item>
              <b-dropdown-item @click="addDeployMethod('S3')">
                (S3)
              </b-dropdown-item>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item class="coming-soon">
                Coming soon
              </b-dropdown-item>
            </b-dropdown>
          </b-button-group>
        </div>
        <div class="deploy-methods" v-if="deployMethodIsDefined">
            <ul class="deploy-method-list" v-if="project">
                <router-link
                    :to="'/project/' + project._id + '/' + deployMethod.name" 
                    tag="li"
                    v-for="deployMethod in project.deployMethods" 
                    :key="deployMethod.name"
                    class="method-item-button"
                >
                    <Deploy 
                        v-if="deployMethodIsDefined" 
                        :deployMethod="deployMethod" 
                        @deleteDeployMethod="deleteDeployMethod"
                    />
                </router-link>
            </ul>
        </div>
    </div>
</template>

<script>
    import Deploy from './Deploy.vue'
    import { mapGetters ,mapActions } from 'vuex'

export default {
  name: 'Deploys',
  data() {
      return {
        projectId : null,
        deployMethod: {
            name: '',
            environments: []
        }
      }
  },
  components: {
      Deploy: Deploy
  },
  computed: {
      ...mapGetters({project: "StateProject"}),
      deployMethodIsDefined() {
          if(this.project){
            return this.project.deployMethods.length > 0
          }
          return null
      },
  },
  methods: {
      ...mapActions(['UpdateProject', 'GetProject']),
        navigateToProjects() {
            this.$router.push('/projects');
        },
        async addDeployMethod(methodName) {
            try {
                let newDeploymentMethod = {
                    name: methodName,
                    environments: [],
                }
                this.project.deployMethods.push(newDeploymentMethod);
                await this.UpdateProject(this.project);
                console.log(`Updating project`)
            } catch (error) {
                console.log('Something went wrong while trying to update a Project!')
                throw new Error
            }
        },
        async deleteDeployMethod(methodName) {
            try {
                this.project.deployMethods.pop(method => method.name === methodName);
                await this.UpdateProject(this.project);
                console.log(`Updating project`)
            } catch (error) {
                console.log('Something went wrong while trying to update a Project!')
                throw new Error
            }
        },
        deployMethodDefined() {
            this.deployMethodIsDefined = this.project.deployMethods.length > 0;
        },
    },
    created() {
        this.projectId = this.$route.params.projectId;
        this.GetProject(this.projectId);
    },
    mounted() {
    }
}
</script>

<style scoped lang="scss">
    h1 {
        text-align: center;
    }

    li {
        list-style: none;
    }

    .select_deploy_method {
        position: relative;
        margin: 0 0 2rem;
        text-align: center;
    }

    .deploy-method-list {
        margin-right: 2rem;
    }

    .method-item-button {
        padding: 15px;
        // width: 97%;
        margin-bottom: 0;
    }

    .delete-button {
        flex: 1 1; /*  Stretching: */
        // flex: 0 1; /*  No stretching: */
        margin-top: auto;
        margin-bottom: auto;
        margin-left: auto;
        // margin-right: 1rem;
        &:hover {
            transform: scale(1.5);
        }
    }
    .coming-soon {
        font-style: italic;
        opacity: 0.75;
    }
</style>
