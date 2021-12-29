<template>
  <div id="home-page">home</div>
</template>

<script>
export default {
  name: "HomePage",
  components: {},
  mounted: function () {
    // if not logged in redirect to login/registration page
    if (!this.$store.getters.isLoggedIn) {
      this.$router.push("Login");
    }
  },
};
</script>

<style scoped lang="css">
</style>
