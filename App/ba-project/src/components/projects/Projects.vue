<template>
    <div class="projects">
        <h1>Project Page</h1>
        <ul>
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

                <label class="sr-only" for="inline-form-input-username">Project Id</label>
                <b-input-group prepend="#" class="mb-2 mr-sm-2 mb-sm-0">
                <b-form-input id="inline-form-input-id" placeholder="ID" v-model="id"></b-form-input>
                </b-input-group>

                <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0" v-model="github">On GitHub</b-form-checkbox>

                <b-button variant="primary" @click="addProject">Save</b-button>
            </b-form>
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
          id: '',
          github: false, 
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
        this.projects.push({name: this.name, id: this.id, github: this.github});
        this.name = '';
        this.id = '';
        this.github = false;
      },
      showTemplate() {
          this.showNewProjectTemplate = true;
          this.addBtn = false;
      },
      hideTemplate() {
          this.showNewProjectTemplate = false;
          this.addBtn = true;
          this.name = '';
          this.id = '';
          this.github = false;
      }
  },
  components: {
      Project: Project,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .projects {
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
      padding-top: 2rem;
  }

button {
    margin: 2rem;
}

  label {
      margin: 0;
  }
  .project-item {
      cursor: pointer;
  }
</style>
