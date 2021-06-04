<template>
<div class="navbar">
  <b-nav pills>
    <b-nav-item active>Active</b-nav-item>
    <b-nav-item>Link</b-nav-item>
    <b-nav-item>Another Link</b-nav-item>
    <b-nav-item disabled>Disabled</b-nav-item>
    <b-nav-item-dropdown
      id="my-nav-dropdown"
      text="Dropdown"
      toggle-class="nav-link-custom"
      right
    >
      <b-dropdown-item>One</b-dropdown-item>
      <b-dropdown-item>Two</b-dropdown-item>
      <b-dropdown-divider></b-dropdown-divider>
      <b-dropdown-item>Three</b-dropdown-item>
    </b-nav-item-dropdown>
  </b-nav>
</div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .navbar {
    background: black;
    color: white;
  }
  a {
    color: white !important;
  }
  .nav-link {
    color: white;
    
    &:hover {
      color: white;
    }
  }
</style>
