<template>
  <div id="sidebar" class="container-fluid rounded">
    <!-- navigation -->
    <ul id="sidebar-nav">
      <li>
        <router-link to="/">
          {{ $t("link-home") }}
        </router-link>
      </li>
      <li>
        <router-link to="/profile">
          {{ $t("link-profile") }}
        </router-link>
      </li>
      <li id="li-logout" @click="logoutUser()">
        <router-link to="/">
          {{ $t("logout") }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  methods: {
    logoutUser() {
      let matrixClient = this.$store.getters.matrixClient;
      if (matrixClient.isLoggedIn()) {
        matrixClient.logout(this.$cookie.get("matrix-user-token"));
        matrixClient.stopClient();
        this.$cookie.delete("matrix-user-token");
        this.$router.push({ name: "Login" });
      }
    },
  },
};
</script>

<style scoped lang="css">
#sidebar {
  background-color: #adb5bd;
}

#sidebar-nav {
  list-style-type: none;
  padding-left: 0%;
}

li {
  font-size: 1.5em;
  padding-bottom: 0.25em;
  text-align: start;
}
</style>
