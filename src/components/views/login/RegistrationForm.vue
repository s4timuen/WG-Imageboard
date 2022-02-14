<template>
  <div
    id="registration-form"
    class="container-fluid border border-dark rounded"
  >
    <div class="row">
      <h1 class="col-12 align-content-center">{{ $t("registration") }}</h1>
    </div>
    <!-- input user name -->
    <div class="row">
      <label class="col-8 offset-2 d-flex justify-content-start">{{
        $t("username")
      }}</label>
      <input
        id="user-registration-name-input"
        type="text"
        class="col-8 offset-2 d-flex justify-content-start"
        :placeholder="$t('placeholder-enter-username')"
        required="true"
      />
    </div>
    <!-- input user password -->
    <div class="row">
      <label class="col-8 offset-2 d-flex justify-content-start">{{
        $t("password")
      }}</label>
      <input
        id="user-registration-password-input"
        type="password"
        class="col-8 offset-2 d-flex justify-content-start"
        :placeholder="$t('placeholder-enter-password')"
        required="true"
      />
    </div>
    <!-- input user confirm password -->
    <div class="row">
      <label class="col-8 offset-2 d-flex justify-content-start">{{
        $t("confirm-password")
      }}</label>
      <input
        id="user-registration-password-confirm-input"
        type="password"
        class="col-8 offset-2 d-flex justify-content-start"
        :placeholder="$t('placeholder-confirm-password')"
        required="true"
      />
    </div>
    <!-- register user button -->
    <div class="row">
      <button
        id="registration-button"
        class="col-4 offset-2 d-flex justify-content-center"
        @click="userRegistration()"
      >
        {{ $t("registration") }}
      </button>
      <!-- registration confiramtion text -->
      <div
        id="registration-confirmation-text"
        class="col-12 text-success"
        hidden
      >
        {{ $t("registration-confirmation-text") }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegistrationForm",
  computed: {
    userNameRegistration: function () {
      return document.getElementById("user-registration-name-input").value;
    },
    userPasswordRegistration: function () {
      return document.getElementById("user-registration-password-input").value;
    },
    userPasswordConfirmRegistration: function () {
      return document.getElementById("user-registration-password-confirm-input")
        .value;
    },
  },
  methods: {
    userRegistration() {
      let matrixClient = this.$store.getters.matrixClient;
      // register user
      if (
        this.userNameRegistration !== "" &&
        this.userPasswordRegistration == this.userPasswordConfirmRegistration
      ) {
        matrixClient
          .register(
            this.userNameRegistration,
            this.userPasswordRegistration,
            "",
            { type: "m.login.dummy" }
          )
          .then(async () => {
            document.getElementById("user-registration-name-input").value = "";
            document.getElementById("user-registration-password-input").value =
              "";
            document.getElementById(
              "user-registration-password-confirm-input"
            ).value = "";
            document.getElementById(
              "registration-confirmation-text"
            ).hidden = false;
          })
          .catch((error) => {
            throw error;
          });
      }
    },
  },
};
</script>

<style scoped lang="css">
label {
  margin-top: 2.5%;
}

#registration-button {
  margin-top: 5%;
  margin-bottom: 5%;
}
</style>
