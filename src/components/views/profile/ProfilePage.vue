<template>
  <div id="profile-page" class="container-fluid rounded">
    <div class="col-12 data-field">
      <span class="col-4">{{ $t("user-displayname") }}</span>
      <span class="col-4">{{ userData.displayName }}</span>
    </div>
    <div class="col-12 data-field">
      <span class="col-4">{{ $t("user-id") }}</span>
      <span class="col-4">{{ userData.userId }}</span>
    </div>
  </div>
</template>

<script>
import { checkSession } from "@/utils/session.js";

export default {
  name: "ProfilePage",
  data: function () {
    return {
      userData: {},
    };
  },
  mounted: async function () {
    let matrixClient = this.$store.getters.matrixClient;
    let accessToken = this.$cookie.get("matrix-user-token");

    // check valid login and session
    await checkSession(this, accessToken);

    // if logged and session valid
    let userId = matrixClient.getUserId();
    this.userData = matrixClient.getUser(userId);
  },
};
</script>

<style scoped lang="css">
.data-field {
  text-align: left;
}
</style>
