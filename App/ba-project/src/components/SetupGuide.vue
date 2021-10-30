<template>
<div class="setupguide">
    <h1>Setup Guide</h1>
    <div class="guide_site">
        <h2>Step #1 <span class="step_description">Creating new Workflow on GitHub</span></h2>
        <div class="guide_step">
            <p>
                Before you create a new Environment in your project, you need to go to your GitHub repository and setup an Action first. Learn more about <a href="https://docs.github.com/en/actions" target="_blank">GitHub Actions</a><br>
                We can do this by simply go to the <strong>"Actions"</strong> Tab in GitHub and click <strong>"New workflow"</strong>. You can choose from prebuild workflows, or set up your own.
            </p>
        </div>
    </div>
    <div class="guide_site">
        <h2>Step #2 <span class="step_description">Adapt your workflow to work with Usus</span></h2>
        <div class="guide_step">
            <p>
                After you set up your Action in #1, it's now time to connect the Action to Usus. In your root directory there should be a <strong>workflows</strong> folder now. Open your Action inside that folder and edit the following lines.<br>
                <span class="code_snipped">
                    <span class="line_number">1</span><span class="lime">on:</span><br>
                    <span class="line_number">2</span>  <span class="lime">repository_dispatch:</span><br>
                    <span class="line_number">3</span>  <span class="lime">types:</span> [<strong>(you can choose an action name here)</strong>]
                </span>
                You need to use this name as the <strong>GitHub Action Name</strong> when you create a new environment.
            </p>
        </div>
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
@import url('https://fonts.googleapis.com/css?family=Roboto+Mono');

  h1 {
    padding: 20px;
  }
  h3 {
      font-size: 14px;
  }
  .guide_site {
    background-color: white;
    color: black;
    border-radius: 15px 15px 0 0;
    margin: 2rem;
    text-align: left;
    font-size: 14px;
    h2 {
        background-color: #2B1DAE;
        border-radius: 12px 12px 0 0;
        color: white;
        padding: 10px;
        font-size: 28px;
    }
    .step_description {
        opacity: 0.75;
        font-size: 23px;
        font-style: italic;
    }
    .guide_step {
        padding: 15px;
    }
  }

  .code_snipped {
    background-color: black;
    border: 1px solid grey;
    border-radius: 10px;
    padding: 10px;
    display: block;
    width: 45%;
    margin: 25px 0;
    color: white;
    font-family: "Roboto Mono";
    -moz-box-shadow:    inset 0 0 5px #ffffffa9;
    -webkit-box-shadow: inset 0 0 5px #ffffffa9;
    box-shadow:         inset 0 0 5px #ffffffa9;
    .line_number {
        color: grey;
        margin: 0 15px 0 5px;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .lime {
        color: #7ee787;
    }
  }
</style>
