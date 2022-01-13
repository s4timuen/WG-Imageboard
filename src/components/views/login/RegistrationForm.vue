<template>
  <div
    id="registration-form"
    class="container-fluid border border-dark rounded"
  >
    <div class="row">
      <h1 class="col-12 align-content-center">{{ $t("registration") }}</h1>
    </div>

    <div class="row">
      <label class="col-8 offset-2 d-flex justify-content-start">{{
        $t("email")
      }}</label>
      <input
        id="user-registration-email-input"
        type="text"
        class="col-8 offset-2 d-flex justify-content-start"
        placeholder="Enter email"
        required="true"
      />
    </div>

    <div class="row">
      <label class="col-8 offset-2 d-flex justify-content-start">{{
        $t("username")
      }}</label>
      <input
        id="user-registration-name-input"
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
        id="user-registration-password-input"
        type="password"
        class="col-8 offset-2 d-flex justify-content-start"
        placeholder="Enter Password"
        required="true"
      />
    </div>

    <div class="row">
      <label class="col-8 offset-2 d-flex justify-content-start">{{
        $t("confirm-password")
      }}</label>
      <input
        id="user-registration-password-confirm-input"
        type="password"
        class="col-8 offset-2 d-flex justify-content-start"
        placeholder="Confirm Password"
        required="true"
      />
    </div>

    <div class="row">
      <button
        id="registration-button"
        class="col-4 offset-2 d-flex justify-content-center"
        @click="userRegistration()"
      >
        {{ $t("registration") }}
      </button>
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
          .register(this.userNameRegistration, this.userPasswordRegistration)
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
