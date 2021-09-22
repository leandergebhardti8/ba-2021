<template>
    <div class="deploy-wrapper">
        <div class="deploy-method">
            <img 
                src="../assets/icons/heroku-icon.svg" 
                alt="Heroku_Icon" 
                v-if="deployMethod.name === 'Heroku'"
            > 
                <img 
                    src="../assets/icons/s3-icon.png" 
                    alt="S3_Icon" 
                    class="s3-icon" 
                    v-if="deployMethod.name === 'S3'"
                > 
            <p class="deployment-name">
                {{ deployMethod.name }}
            </p>
            <span class="delete-button" @click="deleteDeployMethod(deployMethod.name)">
                <b-icon-x 
                    font-scale="2.5" 
                    variant="danger" 
                    v-b-tooltip.hover.left="'Delete Deployment Method'">
                </b-icon-x>
            </span>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Deploys',
  props: [
      'deployMethod'
  ],
  methods: {
      deleteDeployMethod(methodName){
          this.$emit('deleteDeployMethod', methodName);
      }
  },
}
</script>

<style scoped lang="scss">
    .deploy-wrapper {
        text-align: left;
        background: white;
        border-radius: 12px;
        color: black;
        padding: 15px;
        -webkit-box-shadow: 0px 3px 9px 0px rgba(112, 112, 112, 0.65);
        -moz-box-shadow: 0px 3px 9px 0px rgba(112, 112, 112, 0.65);
        box-shadow: 0px 3px 9px 0px rgba(112, 112, 112, 0.65);
    }

    .s3-icon {
        width: 64px;
        height: 64px;
    }

    .delete-button {
        flex: 1 1; /*  Stretching: */
        flex: 0 1; /*  No stretching: */
        margin-top: auto;
        margin-bottom: auto;
        margin-left: auto;
        margin-right: 1rem;
        &:hover {
            transform: scale(1.5);
        }
    }

    .deploy-method {
        display: flex;
        flex-wrap: wrap;
        cursor: pointer;
        color: black;
    }

    .deployment-name {
        margin: auto auto auto 10px;
    }
</style>
