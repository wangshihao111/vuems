<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/page1">Page1</router-link> |
      <router-link to="/page2">Page2</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { loadMicro } from '../../packages/client/lib'

export default {
  mounted() {
    loadMicro(this.$router, this.$store).catch(e => console.log(e))
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
