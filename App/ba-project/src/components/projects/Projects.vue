<template>
    <div class="project-wrapper">
        <button @click="navigateHome" class="btn btn-primary close_btn"><b-icon-house></b-icon-house></button>
        <h1>Project Page</h1>
        <label for="searchbar" class="search-bar-label"><b-icon-search></b-icon-search> Search Projects</label>
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
                    <b-icon-question-circle class="question_btn" id="tooltip-text"></b-icon-question-circle>
                    <b-tooltip target="tooltip-text" triggers="hover">
                      To generate a personal GitHub Access Token on GitHub, just go to your <b>GitHub Acctount > Settings > Developer Settings > Personal Access Token</b>, and generate a new token with <b>access to workflows</b>.
                    </b-tooltip>
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
  created() {
    this.GetProjektsFromUser(this.user);
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
    },
    generatedGHURL() {
        return `https://github.com/${this.newProject.repoOwner}/${this.newProject.repoName}.git`
    }
  },
  methods: {
      ...mapActions([
        'CreateProject', 
        'GetProjects', 
        'GetUser', 
        'GetProjektsFromUser', 
        ]),
      navigateHome() {
          this.$router.push('/');
      },
      async addProject() {
        this.newProject.githubURL = this.generatedGHURL;
        try {
            this.newProject.username = this.user;
            await this.CreateProject(this.newProject);
            this.newProject = {};
            this.$nextTick(() => {
            this.$bvModal.hide('modal-prevent-closing')
        })
            console.log(`Updating projects`)
        } catch (error) {
            console.log('Something went wrong while trying to create a new Project! ' + error)
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
        margin: 15px 0 15px 0;
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
        border-radius: 12px;
    }

    .search-bar-label {
        margin: 0 2rem 0 2rem;
        font-weight: 600;
    }
</style>
