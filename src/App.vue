<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>
<script>
import { loadRemoteJs } from "@/global/loadResources";

let remoteJsLoaded = false; //是否加载完js

export default {
  data() {
    return {};
  },
  created() {
    //判断浏览器是否加载过js
    if (!remoteJsLoaded) {
      loadRemoteJs().then(() => {
        remoteJsLoaded = true;
      });
    }
  },
  mounted() {}
};
</script>

<style lang="less">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
