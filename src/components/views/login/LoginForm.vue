<template>
  <div id="login-form" class="container-fluid border border-dark rounded">
    <div class="row">
      <h1 class="col-12 align-content-center">{{ $t("login") }}</h1>
    </div>

    <div class="row">
      <label class="col-8 offset-2 d-flex justify-content-start">{{
        $t("username")
      }}</label>
      <input
        id="user-login-name-input"
        type="text"
        class="col-8 offset-2 d-flex justify-content-start"
        placeholder="Enter Username"
        required="true"
      />
    </div>

    <div class="row">
      <label class="col-8 offset-2 d-flex justify-content-start">{{
        $t("password")
      }}</label>
      <input
        id="user-login-password-input"
        type="password"
        class="col-8 offset-2 d-flex justify-content-start"
        placeholder="Enter Password"
        required="true"
      />
    </div>

    <div class="row remember-me-section">
      <input
        id="remember-me-checkbox"
        class="offset-2 d-flex justify-content-end"
        type="checkbox"
        unchecked
      />
      <p class="d-flex justify-content-start">{{ $t("remember-me") }}</p>
    </div>

    <div class="row">
      <button
        id="login-button"
        class="col-4 offset-2 d-flex justify-content-center"
        @click="userLogin()"
      >
        {{ $t("login") }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginForm",
  computed: {
    userNameLogin: function () {
      return document.getElementById("user-login-name-input").value;
    },
    userPasswordLogin: function () {
      return document.getElementById("user-login-password-input").value;
    },
  },
  methods: {
    async userLogin() {
      let matrixClient = this.$store.getters.matrixClient;
      const THIS = this;
      // user and password login
      await matrixClient
        .login("m.login.password", {
          user: this.userNameLogin,
          password: this.userPasswordLogin,
        })
        .then((response) => {
          // cookie session duration & remember me 
          let durability = "15m";
          if (document.getElementById("remember-me-checkbox").checked) {
            durability = "1M";
          }
          this.$cookie.set("matrix-user-token", response.access_token, {
            expires: durability,
          });
        })
        .catch((error) => {
          throw error;
        });
      // start matrix client
      await matrixClient.startClient({ initialSyncLimit: 100 });
      matrixClient.once("sync", function (state, prevState, res) {
        if (state === "PREPARED") {
          console.log("Matrix client prepared");
          // redirect homepage 
          THIS.$router.push({ name: "Home" });
        }
        if (state !== "PREPARED") {
          console.log(state, prevState, res);
          process.exit(1);
        }
      });
    },
  },
};
</script>

<style scoped lang="css">
label,
.remember-me-section {
  margin-top: 2.5%;
}
#remember-me-checkbox {
  margin-right: 2.5%;
}
#login-button {
  margin-bottom: 5%;
}
</style>
