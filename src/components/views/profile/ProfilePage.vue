<template>
  <div id="profile-page" class="container-fluid rounded">
    <div class="row">
      {{ user }}
    </div>
  </div>
</template>

<script>
import { checkSession } from "@/utils/session.js";

export default {
  name: "ProfilePage",
  data: function () {
    return {
      user: {},
    };
  },
  mounted: function () {
    let matrixClient = this.$store.getters.matrixClient;
    let accessToken = this.$cookie.get("matrix-user-token");

    // check valid login and session
    checkSession(this, accessToken);

    // if logged and session valid
    this.user = matrixClient.getUser(matrixClient.getUserId());
  },
};
</script>

<style scoped lang="css">
</style>
