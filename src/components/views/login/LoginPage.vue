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
import { checkSession } from "@/utils/session.js";

export default {
  name: "LoginPage",
  components: {
    LoginForm,
    RegistrationForm,
  },
  mounted: async function () {
    let accessToken = this.$cookie.get("matrix-user-token");

    // check valid login and session
    checkSession(this, accessToken);
  },
};
</script>

<style scoped lang="css">
.form {
  margin-top: 2.5%;
  margin-bottom: 2.5%;
}
</style>
