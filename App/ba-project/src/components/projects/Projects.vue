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
        <button v-if="addBtn" @click="showTemplate" class="btn btn-primary">
            Add new Project
        </button>
        <div :class="showNewProjectTemplate ? 'activeForm' : 'form'">
            <button v-if="!addBtn" @click="hideTemplate" class="btn btn-primary">
                <b-icon-x></b-icon-x>
            </button>
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
          githubURL: ''
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
        this.projects.push({name: this.name, id: projectID, github: this.github, githubURL: this.githubURL});
        this.name = '';
        this.id = '';
        this.github = false;
        this.hideTemplate();
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
        li {
        //   border: 1px solid black;
        }
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
</style>
