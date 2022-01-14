<template>
  <div id="home-page" class="container-fluid">
    <div id="wellcome-section" class="row">
      <h3 class="col-12">{{ $t("wellcome") }}</h3>
      <span class="col-12">{{ $t("lorem-ipsum") }}</span>
    </div>
    <div id="rooms-section" class="row">
      <input
        :id="key"
        class="col-4"
        type="button"
        v-for="(room, key) in rooms"
        :key="key"
        :value="room.name"
        @click="openRoom(room.roomId)"
      />
    </div>
  </div>
</template>

<script>
import { checkSession } from "@/utils/session.js";

export default {
  name: "HomePage",
  data: function () {
    return {
      rooms: [],
    };
  },
  methods: {
    openRoom(id) {
      this.$router.push({ name: "Room", params: { roomId: id } });
    },
  },
  mounted: async function () {
    let matrixClient = this.$store.getters.matrixClient;
    let accessToken = this.$cookie.get("matrix-user-token");

    // check valid login and session
    await checkSession(this, accessToken);

    // if logged and session valid
    this.rooms = matrixClient.getRooms();
  },
};
</script>

<style scoped lang="css">
</style>
