<template>
  <div id="sidebar" class="container-fluid">
    <ul id="sidebar-nav">
      <li>
        <router-link to="/">
          <span>
            {{ $t("link-home") }}
          </span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  components: {},
  date: function () {
    return {};
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
  padding-bottom: 0.5em;
}
</style>
