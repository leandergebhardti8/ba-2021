<template>
    <div class="project-wrapper">
        <h1>Project Page</h1>
        <ul class="projects">
            <router-link 
                :to="'/project/' + project.id" 
                tag="li" 
                v-for="project in this.projects" 
                :key="project.id"
                class="project-item">
                <Project :project="project"/>
            </router-link>
        </ul>
        <button v-if="addBtn" class="btn btn-primary" v-b-modal.modal-prevent-closing>
            Add new Project
        </button>
        <div :class="showNewProjectTemplate ? 'activeForm' : 'form'">
            <b-icon-x v-if="!addBtn" @click="hideTemplate" class="close_btn" font-scale="2"></b-icon-x>
            <div class="template" v-if="showNewProjectTemplate">
                <b-form inline>
                    <label class="sr-only" for="inline-form-input-id">Project Name</label>
                    <b-form-input
                        id="inline-form-input-name"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="Name"
                        v-model="name"
                    ></b-form-input>

                    <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0" v-model="github">On GitHub</b-form-checkbox>
                    <div v-if="github">
                        <b-form-input
                            id="inline-form-input-name"
                            class="mb-2 mr-sm-2 mb-sm-0"
                            placeholder="GitHub HTTPS URL"
                            v-model="githubURL"
                        ></b-form-input>
                    </div>
                    <b-button variant="primary" @click="addProject">Save</b-button>
                </b-form>
            </div>
        </div>
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
                        v-model="name"
                    ></b-form-input>

                    <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0" v-model="github">On GitHub</b-form-checkbox>
                    <div v-if="github">
                        <label class="sr-only" for="inline-form-input-id">Github URL</label>
                        <b-form-input
                            id="inline-form-input-name"
                            class="mb-2 mr-sm-2 mb-sm-0"
                            placeholder="GitHub HTTPS URL"
                            v-model="githubURL"
                        ></b-form-input>
                        <label class="sr-only" for="inline-form-input-id">Repositroy Owner</label>
                        <b-form-input
                            id="inline-form-input-name"
                            class="mb-2 mr-sm-2 mb-sm-0"
                            placeholder="Repo Owner"
                            v-model="repoOwner"
                        ></b-form-input>
                        <label class="sr-only" for="inline-form-input-id">Repositroy Name</label>
                        <b-form-input
                            id="inline-form-input-name"
                            class="mb-2 mr-sm-2 mb-sm-0"
                            placeholder="Repo Name"
                            v-model="repoName"
                        ></b-form-input>
                        <label class="sr-only" for="inline-form-input-id">GitHub Token</label>
                        <b-form-input
                            id="inline-form-input-name"
                            class="mb-2 mr-sm-2 mb-sm-0"
                            placeholder="GitHub Token"
                            v-model="ghToken"
                        ></b-form-input>
                    </div>
                    <!-- <b-button variant="primary" @click="addProject">Add Another</b-button> -->
                </b-form>
            <!-- <b-button class="mt-3" block @click="$bvModal.hide('bv-modal-example')">Close Me</b-button> -->
          </b-modal>
    </div>
</template>

<script>
 import Project from './Project.vue';

export default {
  name: 'Projects',
  inject: [
      'projects'
  ],
  data() {
      return {
          showNewProjectTemplate: false,
          addBtn: true,
          name: '',
          github: false, 
          githubURL: '',
          repoOwner: '',
          repoName: '',
          ghToken: '',
      }
  },
  provide() {
    return {
      projects: this.projects,
    }
  },
  computed: {

  },
  props: {
    //   projects,
  },
  methods: {
      addProject() {
        const intID = this.projects.length + 1;
        const projectID = intID.toString();
        this.projects.push({
            name: this.name, 
            id: projectID, 
            github: this.github, 
            repoOwner: this.repoOwner,
            repoName: this.repoName,
            ghToken: this.ghToken,
        });
        this.name = '';
        this.id = '';
        this.github = false;
        this.$nextTick(() => {
          this.$bvModal.hide('modal-prevent-closing')
        })
      },
      showTemplate() {
          this.showNewProjectTemplate = true;
          this.addBtn = false;
      },
      hideTemplate() {
          this.showNewProjectTemplate = false;
          this.addBtn = true;
      }
  },
  components: {
      Project: Project,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .project-wrapper {
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
    .project-item {
        cursor: pointer;
    }
    .activeForm {
        border: 1px solid white;
        border-radius: 15px;
        margin-left: 2rem;
    }
    .close_btn {
        margin: 0.75rem;
    }
</style>
