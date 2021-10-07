<template>
    <div class="project">
        <p class="info">{{ project.name }} <b-icon-github></b-icon-github></p>
        <div class="settings_button">
          <b-dropdown right>
            <b-dropdown-item v-b-modal="`modal-rename-${project._id}`">Rename</b-dropdown-item>
            <b-dropdown-item v-b-modal="`modal-edit-${project._id}`"><b-icon-pencil></b-icon-pencil> Edit</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="deleteProject(project._id)"><b-icon-exclamation-triangle variant="danger"></b-icon-exclamation-triangle> Delete</b-dropdown-item>
          </b-dropdown>
        </div>

        <!-- Rename Project Modal -->
        <b-modal 
            :id="`modal-rename-${modalName}`"
            title="Rename Project"
            @ok="renameProject(projectCopy._id)"
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

        <!-- Edit Project Modal -->
        <b-modal 
            :id="`modal-edit-${modalName}`"
            title="Edit Project"
            @ok="editProject(projectCopy._id)"
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
        await this.RemoveProject(this.projectCopy);
        console.log(`Removing project`)
        this.$emit('update')
      } catch (error) {
          console.log('Something went wrong while trying to remove a Project!')
          throw new Error
      }
    },
  },
}
</script>

<style scoped lang="scss">
  .project{
    background: white;
    border-radius: 12px;
    color: black;
    display: flex;
    flex-wrap: wrap;
    -webkit-box-shadow: 0px 3px 9px 0px rgba(112, 112, 112, 0.65);
    -moz-box-shadow: 0px 3px 9px 0px rgba(112, 112, 112, 0.65);
    box-shadow: 0px 3px 9px 0px rgba(112, 112, 112, 0.65);
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
    // source: https://1linelayouts.glitch.me/
    flex: 1 1;
    flex: 0 1;
    margin-top: auto;
    margin-bottom: auto;
    margin-left: auto;
    margin-right: 1rem;
  }
</style>
