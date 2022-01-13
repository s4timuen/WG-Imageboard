<template>
  <div id="header" class="container-fluid rounded">
    <div class="row">
      <div class="col-10 offset-1">
        <h1>{{ $t("wg-imageboard-title") }}</h1>
      </div>
      <div class="col-12">
        <h2>{{ this.domainName }}</h2>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  computed: {
    domainName: function () {
      let name = "";
      if (this.$store.getters.matrixClient.getDomain() != null) {
        return this.$store.getters.matrixClient.getDomain();
      }
      return name;
    },
  },
  mounted: function () {},
};
</script>

<style scoped lang="css">
#header {
  background-color: #adb5bd;
}
</style>
