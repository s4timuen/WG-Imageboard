<template>
  <div id="app" class="container-fluid">
    <div class="row border">
      <Header class="col-12" />
    </div>
    <div class="row border">
      <Sidebar class="col-2" />
      <router-view class="col-10"></router-view>
    </div>
    <div class="row border">
      <Footer class="col-12" />
    </div>
  </div>
</template>

<script>
import Header from "@/components/header/Header.vue";
import Footer from "@/components/footer/Footer.vue";
import Sidebar from "@/components/sidebar/Sidebar.vue";

export default {
  name: "App",
  components: {
    Header,
    Footer,
    Sidebar,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #ced4da;
}
</style>
