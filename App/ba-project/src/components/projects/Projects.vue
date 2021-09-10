<template>
    <div class="project-wrapper">
        <button @click="navigateHome" class="btn btn-primary close_btn"><b-icon-house></b-icon-house></button>
        <h1>Project Page</h1>
        <label for="searchbar" class="search-bar-label">Search Projects</label>
        <b-form-input id="searchbar" type="search" class="search-bar" v-model="search"></b-form-input>
        <ul class="projects">
            <router-link 
                :to="'/deployjob/' + project._id" 
                tag="li" 
                v-for="project in filteredProjects" 
                :key="project._id"
                class="project-item">
                <Project :project="project" :modalName="project._id" @update="updateProject"/>
            </router-link>
        </ul>
        <button v-if="addBtn" class="btn btn-primary" v-b-modal.modal-prevent-closing>
            Add new Project
        </button>

        <!-- Modals -->
        <b-modal 
            id="modal-prevent-closing" 
            title="Adding new Project"
            @ok="addProject">
            <b-form inline>
                <label class="sr-only" for="inline-form-input-id">Project Name</label>
                <b-form-input
                    id="inline-form-input-name"
                    class="mb-2 mr-sm-2 mb-sm-0"
                    placeholder="Name"
                    v-model="newProject.name"
                ></b-form-input>

                <div>
                    <label class="sr-only" for="inline-form-input-id">Github URL</label>
                    <b-form-input
                        id="inline-form-input-name"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="GitHub HTTPS URL"
                        v-model="newProject.githubURL"
                    ></b-form-input>
                    <label class="sr-only" for="inline-form-input-id">Repositroy Owner</label>
                    <b-form-input
                        id="inline-form-input-name"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="Repo Owner"
                        v-model="newProject.repoOwner"
                    ></b-form-input>
                    <label class="sr-only" for="inline-form-input-id">Repositroy Name</label>
                    <b-form-input
                        id="inline-form-input-name"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="Repo Name"
                        v-model="newProject.repoName"
                    ></b-form-input>
                    <label class="sr-only" for="inline-form-input-id">GitHub Token</label>
                    <b-form-input
                        id="inline-form-input-name"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="GitHub Token"
                        v-model="newProject.githubToken"
                    ></b-form-input>
                </div>
            </b-form>
        </b-modal>
    </div>
</template>

<script>
 import Project from './Project.vue';
 import { mapGetters ,mapActions } from 'vuex'   

export default {
  name: 'Projects',
  components: {
      Project: Project,
  },
  data() {
      return {
          addBtn: true,
          search: '',
          newProject: {
            name: '',
            userId: null,
            githubURL: '',
            repoOwner: '',
            repoName: '',
            githubToken: '',
          },
      }
  },
  created: function () {
    //   this.GetUser(this.user);
      this.GetProjects();
  },
  computed: {
    ...mapGetters({projects: "StateProjects"}),
    ...mapGetters({user: "StateUser"}),
    filteredProjects() {
        let projects = this.projects

        if(!this.search) return projects

        let searchValue = this.search.toLowerCase()
        let filter = project => project.name.toLowerCase().includes(searchValue)

        return projects.filter(filter)
    }
  },
  methods: {
      ...mapActions([
        'CreateProject', 
        'GetProjects', 
        'GetUserProjects',
        'CreateProject', 
        'GetUser'
        ]),
      navigateHome() {
          this.$router.push('/');
      },
      async updateProject(project){
        try {
            await this.UpdateProject(project);
            console.log(`Updating project`)
        } catch (error) {
            console.log('Something went wrong while trying to update a Project!')
            throw new Error
        }
      },
      async addProject() {
        // const intID = this.projects.length + 1;
        // const projectID = String(intID);
        // this.newProject.id = projectID;
        // this.newProject.userId = this.user.id;
        // try {
        //     await this.CreateProject(this.newProject);
        //     console.log(`Updating projects`)
        // } catch (error) {
        //     console.log('Something went wrong while trying to create a new Project!')
        //     throw new Error
        // }
        try {
            this.newProject.username = this.user;
            console.log(this.newProject.name)
            await this.CreateProject(this.newProject);
            this.newProject.name = '';
            this.$nextTick(() => {
            this.$bvModal.hide('modal-prevent-closing')
        })
            console.log(`Updating projects`)
        } catch (error) {
            console.log('Something went wrong while trying to create a new Project!')
            throw new Error
        }
      },
  },
  mounted() {
  }
}
</script>

<style scoped lang="scss">
    h1 {
        text-align: center;
    }
    .project-wrapper {
        text-align: left;
    }
    ul {
        list-style-type: none;
        margin: 0 2rem 0 2rem;
        padding: 0;
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
    .project-item {
        cursor: pointer;
    }
    .close_btn {
        margin: 0.75rem;
    }
    .close_btn {
      left: 0;
      float: left;
      position: absolute;
      margin: 1.75rem;
    }

    .search-bar {
        width: 25%;
        margin: 0 2rem 2rem 2rem;
    }

    .search-bar-label {
        margin: 0 2rem 0 2rem;
        font-weight: 600;
    }
</style>
