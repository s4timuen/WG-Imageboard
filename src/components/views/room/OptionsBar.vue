<template>
  <div id="room-options-bar" class="container-fluid rounded">
    <!-- overlay -->
    <OverlayInviteUser id="overlay-invite-user" :roomId="inviteRoomId" hidden />
    <div class="row">
      <span>{{ $t("options") }}</span>
      <!-- invite user to room option -->
      <button
        id="invite-user-button"
        class="options-button"
        type="button"
        @click="openOverlay('overlay-invite-user')"
      >
        {{ $t("invite-user-button") }}
      </button>
      <!-- leave room option -->
      <button
        id="leave-room-button"
        class="options-button"
        type="button"
        @click="leaveRoom()"
      >
        {{ $t("leave-room-button") }}
      </button>
    </div>
  </div>
</template>

<script>
import OverlayInviteUser from "@/components/views/room/OverlayInviteUser.vue";
import { changeElementVisibility } from "@/utils/utils.js";

export default {
  name: "OptionsBar",
  components: {
    OverlayInviteUser,
  },
  props: {
    roomId: String,
  },
  computed: {
    inviteRoomId() {
      return this.roomId;
    },
  },
  methods: {
    openOverlay: function (id) {
      changeElementVisibility(id);
    },
    leaveRoom() {
      let matrixClient = this.$store.getters.matrixClient;
      if (window.confirm(this.$t("alert-confirm-leave-room"))) {
        matrixClient.leave(this.roomId);
        this.$router.push({ name: "Home" });
      }
    },
  },
};
</script>

<style scoped lang="css">
.options-button {
  margin-left: 2.5%;
}
</style>
