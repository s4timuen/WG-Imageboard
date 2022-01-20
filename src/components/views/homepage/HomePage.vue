<template>
  <div id="home-page" class="container-fluid">
    <OverlayCreateRoom id="overlay-create-room" hidden />
    <div id="wellcome-section" class="row">
      <h3 class="col-12">{{ $t("wellcome") }}</h3>
      <span class="col-12">{{ $t("lorem-ipsum") }}</span>
    </div>
    <div id="rooms-section" class="row">
      <div class="col-12 col-md-4 offset-md-1">
        <span class="col-12">{{ $t("user-rooms") }}</span>
        <input
          :id="key"
          class="col-12"
          type="button"
          v-for="(room, key) in joinedRooms"
          :key="key"
          :value="room.name"
          @click="openRoom(room.roomId)"
        />
        <input
          id="create-room-button"
          class="col-12"
          type="button"
          :value="$t('create-room')"
          @click="openOverlay('overlay-create-room')"
        />
      </div>
      <div class="col-12 col-md-4 offset-md-1">
        <span class="col-12">{{ $t("list-public-rooms") }}</span>
        <input
          :id="key"
          class="col-12"
          type="button"
          v-for="(room, key) in publicRooms"
          :key="key"
          :value="room.name"
          @click="joinRoom(room.room_id)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import OverlayCreateRoom from "@/components/views/homepage/OverlayCreateRoom.vue";
import { checkSession } from "@/utils/session.js";
import { changeElementVisibility } from "@/utils/utils.js";

export default {
  name: "HomePage",
  components: {
    OverlayCreateRoom,
  },
  data: function () {
    return {
      joinedRooms: [],
      publicRooms: [],
    };
  },
  methods: {
    openRoom(id) {
      this.$router.push({ name: "Room", params: { roomId: id } });
    },
    async joinRoom(id) {
      let alreadyJoined = false;
      this.joinedRooms.forEach((room) => {
        if (id === room.roomId) {
          alreadyJoined = true;
        }
      });
      if (!alreadyJoined) {
        await this.$store.getters.matrixClient.joinRoom(id);
        this.$router.push({ name: "Room", params: { roomId: id } });
      }
      if (alreadyJoined) {
        alert(this.$t("alert-room-already-joined"));
      }
    },
    openOverlay: function (id) {
      changeElementVisibility(id);
    },
  },
  mounted: async function () {
    let matrixClient = this.$store.getters.matrixClient;
    let accessToken = this.$cookie.get("matrix-user-token");

    // check valid login and session
    await checkSession(this, accessToken);

    // get list of joined rooms
    let listJoinedRoomsIds = await matrixClient.getJoinedRooms();
    await listJoinedRoomsIds.joined_rooms.forEach((roomId) => {
      this.joinedRooms.push(matrixClient.getRoom(roomId));
    });

    // get list of public rooms
    let listPublicRooms = await matrixClient.publicRooms();
    await listPublicRooms.chunk.forEach((room) => {
      this.publicRooms.push(room);
    });
  },
};
</script>

<style scoped lang="css">
#create-room-button {
  margin-top: 2.5%;
}
</style>
