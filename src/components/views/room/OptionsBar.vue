<template>
  <div id="room-options-bar" class="container-fluid rounded">
    <div class="row">
        <span>{{ $t("options") }}</span>
      <button id="leave-room-button" class="options-button" type="button" @click="leaveRoom()">
        {{ $t("leave-room-button") }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "OptionsBar",
  props: {
    roomId: String,
  },
  methods: {
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
