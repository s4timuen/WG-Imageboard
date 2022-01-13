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
  mounted: async function () {
    let matrixClient = this.$store.getters.matrixClient;
    let accessToken = this.$cookie.get("matrix-user-token");

    // valid session token after reload
    if (!matrixClient.isLoggedIn() && accessToken !== null) {
      await matrixClient
        .login("m.login.token", {
          token: accessToken,
        })
        .catch((error) => {
          throw error;
        });

      // start matrix client
      await matrixClient.startClient({ initialSyncLimit: 10 });
      matrixClient.once("sync", function (state, prevState, res) {
        if (state === "PREPARED") {
          console.log("Matrix client prepared");
        }
        if (state !== "PREPARED") {
          console.log(state, prevState, res);
          process.exit(1);
        }
      });
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
