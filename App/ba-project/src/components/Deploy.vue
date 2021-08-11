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
            {{ deployMethod.name }}
        </div>
    </div>
</template>

<script>
export default {
  name: 'Deploys',
  props: [
      'deployMethod'
  ],
}
</script>

<style scoped lang="scss">
    .deploy-wrapper {
        text-align: left;
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

    .method-item-button {
        background: white;
        border-radius: 5px;
        color: black;
        border-bottom: 1px solid black;
        padding: 15px;
        width: 97%;
        display: flex;
        flex-wrap: wrap;
    }
</style>
