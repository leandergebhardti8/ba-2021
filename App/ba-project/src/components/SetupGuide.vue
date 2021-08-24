<template>
<div class="home">
    <h1>Setup Guide</h1>
    <hr>
    <!-- <button @click="navigateToProjects" class="btn btn-primary">Go to Projects</button> -->
    <div class="guide_site">
        <h2>Step #1</h2>
        <hr>
        <h3>Creating new Workflow on GitHub</h3>
        <p>
            Before you create a new Environment in your project, you need to go to your GitHub repository and setup an Action first. Learn more about GitHub Actions <a href="https://docs.github.com/en/actions" target="_blank">here.</a><br>
            We can do this by simply go to the <strong>"Actions"</strong> Tab in GitHub and click <strong>"New workflow"</strong>. You can choose from prebuild workflows, or set up your own.
        </p>
    </div>
    <div class="guide_site">
        <h2>Step #2</h2>
        <hr>
        <h3>Adapt your workflow to work with Usus</h3>
        <p>
            After you set up your Action in #1, it's now time to connect the Action to Usus. In your root directory there should be a <strong>workflows</strong> folder now. Open your Action inside that folder and edit the following lines.<br>
            <span class="code_snipped">on:<br>
                repository_dispatch:<br>
                types: [<strong>(you can choose an action name here)</strong>]
            </span>
            You need to use this name as the <strong>GitHub Action Name</strong> when you create a new environment.
        </p>
    </div>
</div>
</template>

<script>


export default {
  name: 'Home',
  props: {
    msg: String
  },
   methods: {
      navigateToProjects() {
          this.$router.push('/projects');
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  h1 {
    padding: 20px;
  }
  h3 {
      font-size: 18px;
  }
  .guide_site {
      background-color: white;
      color: black;
      border-radius: 20px;
      margin: 2rem;
      padding: 1rem;
      text-align: left;
  }

  .code_snipped {
      background-color: rgb(211, 211, 211);
      border: 1px solid grey;
      border-radius: 10px;
      padding: 10px;
      display: block;
      width: 45%;
  }
</style>
