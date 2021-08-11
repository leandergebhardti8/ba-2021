<template>
  <div id="app">
    <Header/>
    <!-- <Breadcrumb/> -->
    <router-view/>
  </div>
</template>

<script>
import Header from './components/navigation/Header.vue'
// import Breadcrumb from './components/navigation/Breadcrumb.vue'

export default {
  name: 'App',
  components: {
    Header,
    // Breadcrumb,
  }, 
  data() {
    return{
      items: [
        {
          text: 'Home',
          href: '/'
        },
      ],
    }
  },
}
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: white;
    -webkit-font-smoothing: antialiased;
  }
  body {
    background: linear-gradient(90deg, #1CB5E0 0%, #000851 100%);
  }
  h1 {
      padding: 20px;
  }
</style>
