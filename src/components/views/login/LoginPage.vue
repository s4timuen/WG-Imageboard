<template>
  <div id="login-page" class="container-fluid">
    <div class="row">
      <LoginForm class="col-6 form" />
    </div>
    <div class="row">
      <RegistrationForm class="col-6 form" />
    </div>
  </div>
</template>

<script>
import LoginForm from "@/components/views/login/LoginForm.vue";
import RegistrationForm from "@/components/views/login/RegistrationForm.vue";

export default {
  name: "LoginPage",
  components: {
    LoginForm,
    RegistrationForm,
  },
  mounted: function () {
    // if already logged in redirect to home page
    if (this.$store.getters.isLoggedIn) {
      this.$router.push("Home");
    }
  },
};
</script>

<style scoped lang="css">
.form {
  margin-top: 2.5%;
  margin-bottom: 2.5%;
}
</style>
