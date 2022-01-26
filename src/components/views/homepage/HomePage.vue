<template>
  <div id="home-page" class="container-fluid">
    <!-- overlay -->
    <OverlayCreateRoom id="overlay-create-room" hidden />
    <!-- welcome section -->
    <div id="wellcome-section" class="row">
      <h3 class="col-12">{{ $t("wellcome") }}</h3>
      <span class="col-12">{{ $t("lorem-ipsum") }}</span>
    </div>
    <!-- rooms section -->
    <div id="rooms-section" class="row">
      <!-- user rooms -->
      <div class="col-12 col-md-4 offset-md-1 rooms-list">
        <!-- rooms joined by user -->
        <label class="col-12">{{ $t("list-user-rooms") }}</label>
        <input
          :id="key"
          class="col-12"
          type="button"
          v-for="(room, key) in joinedRooms"
          :key="key"
          :value="room.name"
          @click="openRoom(room.roomId)"
        />
        <!-- create room button -->
        <input
          id="create-room-button"
          class="col-12"
          type="button"
          :value="$t('create-room')"
          @click="openOverlay('overlay-create-room')"
        />
      </div>
      <!-- public rooms -->
      <div class="col-12 col-md-4 offset-md-1 rooms-list">
        <label class="col-12">{{ $t("list-public-rooms") }}</label>
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
      <!-- pending room invites -->
      <div class="col-12 col-md-4 offset-md-1 rooms-list">
        <label class="col-12">{{ $t("list-invited-rooms") }}</label>
        <span v-if="invitedRooms.length === 0">{{
          $t("list-invited-rooms-none")
        }}</span>
        <input
          :id="key"
          class="col-12"
          type="button"
          v-for="(room, key) in invitedRooms"
          :key="key"
          :value="room.name"
          @click="joinRoom(room.roomId)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import OverlayCreateRoom from "@/components/views/homepage/OverlayCreateRoom.vue";
import { checkSession } from "@/utils/session.js";
import { changeElementVisibility } from "@/utils/utils.js";
import { checkUserGamificationData } from "@/utils/gamification.js";

export default {
  name: "HomePage",
  components: {
    OverlayCreateRoom,
  },
  data: function () {
    return {
      joinedRooms: [],
      publicRooms: [],
      invitedRooms: [],
    };
  },
  methods: {
    openRoom(id) {
      this.$router.push({ name: "Room", params: { roomId: id } });
    },
    async joinRoom(roomId) {
      let matrixClient = this.$store.getters.matrixClient;
      let alreadyJoined = false;
      // check already joined room
      this.joinedRooms.forEach(async (room) => {
        if (roomId === room.roomId) {
          alreadyJoined = true;
        }
      });
      if (!alreadyJoined) {
        // check if gamification data is alredy available or create respective data
        let userId = matrixClient.getUserId();
        let roomVisibility = await matrixClient
          .getRoomDirectoryVisibility(roomId)
          .then((response) => {
            return response;
          });
        await checkUserGamificationData(
          userId,
          roomId,
          roomVisibility.visibility
        );

        // join room and redirect to respective room
        await matrixClient.joinRoom(roomId);
        this.$router.push({ name: "Room", params: { roomId: roomId } });
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
    let joinedRoomsIds = await matrixClient.getJoinedRooms();
    await joinedRoomsIds.joined_rooms.forEach((roomId) => {
      this.joinedRooms.push(matrixClient.getRoom(roomId));
    });

    // get list of public rooms
    let publicRooms = await matrixClient.publicRooms();
    this.publicRooms = publicRooms.chunk;

    // get list of room the user has been invited to
    let rooms = await matrixClient.getRooms();
    rooms.forEach((room) => {
      let members = room.getMembers();
      members.forEach((member) => {
        let userId = matrixClient.getUserId();
        let memberId = member.userId;
        if (userId === memberId && member.membership === "invite") {
          this.invitedRooms.push(room);
        }
      });
    });
  },
};
</script>

<style scoped lang="css">
#create-room-button {
  margin-top: 1%;
}
.rooms-list {
  margin-top: 2.5%;
}
</style>
