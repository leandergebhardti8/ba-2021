<template>
    <div class="project-wrapper">
        <button @click="navigateHome" class="btn btn-primary close_btn"><b-icon-house></b-icon-house></button>
        <h1>Project Page</h1>
        <ul class="projects">
            <router-link 
                :to="'/deployjob/' + project.id" 
                tag="li" 
                v-for="project in this.projects" 
                :key="project.id"
                class="project-item">
                <Project :project="project" :modalName="project.id" @update="updateProjects" @updateData="updateProject"/>
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
 import axios from 'axios';
//  import { mapState ,mapActions } from 'vuex'   

export default {
  name: 'Projects',
  data() {
      return {
          addBtn: true,
          newProject: {
            name: '',
            id: this.newProjectId,
            githubURL: '',
            repoOwner: '',
            repoName: '',
            githubToken: '',
          },
          projects: [],
      }
  },
  created: function () {
    //   this.GetProjects()
  },
  computed: {
    // ...mapState({ 
    //     projects: state => state.projects,
    // }),
    // newProjectId(){
    //     const intID = this.projects.length + 1;
    //     return String(intID);
    // }
  },
  methods: {
    //   ...mapActions(['CreateProject', 'GetProjects']),
      getProjects() {
        this.updateProjects();
      },
      navigateHome() {
          this.$router.push('/');
      },
      updateProjects() {
          axios.get("http://localhost:8080/api/projects")
        .then(response => {
            this.projects = response.data;
        })
        .catch(err => {
            console.log(err);
        })
      },
      updateProject(project){
          for(let i=0;i < this.projects.length; i++) {
            if(this.projects.id === project.id){
                this.projects[i] = project;
            }
          }
      },
      addProject() {
        //   try {
        //       await this.CreateProject(this.newProject);
        //       console.log(`Updating projects`)
        //   } catch (error) {
        //       console.log('Something went wrong while trying to create a new Project!')
        //       throw new Error
        //   }
        const intID = this.projects.length + 1;
        const projectID = String(intID);
        var newproject = {
            name: this.name, 
            id: projectID,   
            repoOwner: this.repoOwner,
            repoName: this.repoName,
            githubURL: this.githubURL, 
            githubToken: this.ghToken,
            deployMethods: [],
        };
        axios.post('http://localhost:8080/api/project', newproject)
        .then(response => {
            // this.project.id = response.data.id;
            console.log(`Updating projects ${response.data}`)
            this.updateProjects();
        })
        .catch(err => {
            console.log(err);
        })

        this.name = '';
        this.id = '';
        this.$nextTick(() => {
          this.$bvModal.hide('modal-prevent-closing')
        })
      },
  },
  components: {
      Project: Project,
  },
  mounted() {
    this.getProjects();
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
        list-style-type:none;
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
</style>
