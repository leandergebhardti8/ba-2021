<template>
    <div class="project">
        <p class="info">{{ project.name }} <b-icon-github></b-icon-github></p>
        <!-- <span class="edit-button"><b-icon-three-dots-vertical></b-icon-three-dots-vertical></span> -->
        <div class="settings_button">
          <b-dropdown right>
            <b-dropdown-item v-b-modal="`modal-rename-${project.id}`">Rename</b-dropdown-item>
            <b-dropdown-item v-b-modal="`modal-edit-${project.id}`"><b-icon-pencil></b-icon-pencil> Edit</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="deleteProject(project.id)"><b-icon-exclamation-triangle variant="danger"></b-icon-exclamation-triangle> Delete</b-dropdown-item>
          </b-dropdown>
        </div>

        <!-- Rename Project -->
        <b-modal 
            :id="`modal-rename-${modalName}`"
            title="Rename Project"
            @ok="renameProject(projectCopy.id)"
        >
            <b-form inline>
              <label class="sr-only" for="inline-form-input-id">Project Name</label>
              <b-form-input
                  id="inline-form-input-name"
                  class="mb-2 mr-sm-2 mb-sm-0"
                  placeholder="Name"
                  v-model="projectCopy.name"
              ></b-form-input>
            </b-form>
        </b-modal>

        <!-- Edit Project -->
        <b-modal 
            :id="`modal-edit-${modalName}`"
            title="Edit Project"
            @ok="editProject(projectCopy.id)"
        >
            <b-form inline>
              <label class="sr-only" for="inline-form-input-id"><strong>Project Name</strong></label>
              <b-form-input
                  id="inline-form-input-name"
                  class="mb-2 mr-sm-2 mb-sm-0"
                  placeholder="Name"
                  v-model="projectCopy.name"
              ></b-form-input>
              <label class="sr-only" for="inline-form-input-id"><strong>Github URl</strong></label>
              <b-form-input
                  id="inline-form-input-name"
                  class="mb-2 mr-sm-2 mb-sm-0"
                  placeholder="URL"
                  v-model="projectCopy.githubURL"
              ></b-form-input>
              <label class="sr-only" for="inline-form-input-id"><strong>Github Repo</strong></label>
              <b-form-input
                  id="inline-form-input-name"
                  class="mb-2 mr-sm-2 mb-sm-0"
                  placeholder="Repository Name"
                  v-model="projectCopy.repoName"
              ></b-form-input>
              <label class="sr-only" for="inline-form-input-id"><strong>Github Owner</strong></label>
              <b-form-input
                  id="inline-form-input-name"
                  class="mb-2 mr-sm-2 mb-sm-0"
                  placeholder="Owner"
                  v-model="projectCopy.repoOwner"
              ></b-form-input>
              <label class="sr-only" for="inline-form-input-id"><strong>Github Token</strong></label>
              <b-form-input
                  id="inline-form-input-name"
                  class="mb-2 mr-sm-2 mb-sm-0"
                  placeholder="GitHub Token"
                  v-model="projectCopy.githubToken"
              ></b-form-input>
            </b-form>
        </b-modal>
        <!-- <img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/leandergebhardti8/ba-2021/node"> -->
    </div>
</template>

<script>
  import { mapActions } from 'vuex'

export default {
  name: 'Project',
  props: [
    'project',
    'modalName'
  ], 
  data() {
    return {
      info: null,
    }
  },
  computed: {
    projectCopy: {
      get: function() {
        return this.project;
      },

      set: function(project) {
        this.$emit("updateData", project)
      }
    }
  },
  created () {
    // axios.interceptors.request.use(config => {
    //   // perform a task before the request is sent
    //   console.log('Requesting workflow badge from API');

    //   return config;
    // }, error => {
    //   // handle the error
    //   return Promise.reject(error);
    // })

    // sent a GET request
    // TODO Get API request working
    // const headers = { "Content-Type": "application/json" };
    // var username = 'leandergebhardti8';
    // var password = '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';
    // const authorization = {'Authorization': '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'};
    // var credentials = btoa(username + ':' + password);
    // var basicAuth = 'Basic' + credentials;
    // axios
    //   .get('https://api.github.com/repos/leandergebhardti8/ba-2021/actions/workflows', { 
    //     auth: {
    //       username: username,
    //       password: password
    //     }
    //    })
    //   .then(response => (
    //     this.info = response
    //   ))
    //   .catch(error => {
    //   this.errorMessage = error.message;
    //   console.error("There was an error!", error);
    // });
  },
  methods: {
    ...mapActions(['UpdateProject', 'GetProject', 'RemoveProject']),
    renameProject() {
     this.updateProject();
    },
    editProject() {
      this.updateProject();
    },
    async updateProject() {
      try {
        await this.UpdateProject(this.projectCopy);
        console.log(`Updating project`)
      } catch (error) {
          console.log('Something went wrong while trying to update a Project!')
          throw new Error
      }
    },
    async deleteProject() {
      try {
        await this.RemoveProject(this.projectCopy._id);
        console.log(`Removing project`)
        this.$emit('update')
      } catch (error) {
          console.log('Something went wrong while trying to remove a Project!')
          throw new Error
      }
    }
  },
}
</script>

<style scoped lang="scss">
  .project{
    background: white;
    border-radius: 5px;
    color: black;
    border-bottom: 1px solid black;
    display: flex;
    flex-wrap: wrap;
  }
  
  p {
    margin: 0px !important;
    text-align: left;
    padding: 15px;
    font-weight: 500;
  }

  .github {
    background-color: black;
    color: white;
    padding: 10px;
    margin-left: 5px;
    border-radius: 15px;
  }

  .settings_button {
    flex: 1 1; /*  Stretching: */
    flex: 0 1;
    margin-top: auto;
    margin-bottom: auto;
    margin-left: auto;
    margin-right: 1rem;
  }
</style>
