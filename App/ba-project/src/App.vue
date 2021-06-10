<template>
  <div id="app">
    <Header msg="Welcome to Your Vue.js App"/>
    <!-- <hr> -->
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './components/Header.vue'

export default {
  name: 'App',
  components: {
    Header
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
}
body {
  background: linear-gradient(90deg, #1CB5E0 0%, #000851 100%);
}
</style>
