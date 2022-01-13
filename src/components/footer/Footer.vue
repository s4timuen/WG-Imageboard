<template>
  <div id="footer" class="container-fluid rounded">
    <div class="row">
      <span class="col-12">{{ $t("footer-fuhagen") }}</span>
      <span class="col-12">{{ $t("footer-author") }}</span>
      <span class="col-12">{{ $t("footer-year") }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Footer",
  components: {},
};
</script>

<style scoped lang="css">
#footer {
  background-color: #adb5bd;
}
</style>
