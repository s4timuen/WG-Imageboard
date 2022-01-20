<template>
  <div :id="id">
    <div class="overlay-backdrop" @click="closeOverlay()" />
    <div class="container-fluid overlay-panel border rounded">
      <!-- room name -->
      <div class="row">
        <label class="col-8 offset-2 d-flex justify-content-start">{{
          $t("create-room-name")
        }}</label>
        <input
          id="create-room-name-input"
          type="text"
          class="col-8 offset-2 d-flex justify-content-start"
          placeholder="Enter Room Name"
          required
        />
      </div>
      <!-- room topic -->
      <div class="row">
        <label class="col-8 offset-2 d-flex justify-content-start">{{
          $t("create-room-topic")
        }}</label>
        <textarea
          id="create-room-topic-input"
          type="text"
          class="
            col-8
            offset-2
            d-flex
            justify-content-start
            create-room-element
          "
          placeholder="Enter Room Topic"
        />
      </div>
      <!-- room visibility -->
      <div class="row">
        <label
          class="
            col-10
            offset-2
            d-flex
            justify-content-start
            create-room-element
          "
          >{{ $t("create-room-visibility") }}
        </label>
        <div
          class="
            col-10
            offset-2
            d-flex
            justify-content-start
            create-room-element
          "
        >
          <input
            type="radio"
            name="create-room-visibility-option"
            value="private"
            checked
          />
          <span>{{ $t("create-room-visibility-private") }}</span>
        </div>
        <div
          class="
            col-10
            offset-2
            d-flex
            justify-content-start
            create-room-element
          "
        >
          <input
            type="radio"
            name="create-room-visibility-option"
            value="public"
          /><span>{{ $t("create-room-visibility-public") }}</span>
        </div>
      </div>
      <!-- create room button -->
      <div class="row">
        <button
          id="create-room-button"
          class="offset-2 d-flex justify-content-center create-room-element"
          type="button"
          @click="createRoom()"
        >
          {{ $t("create-room-button") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { changeElementVisibility } from "@/utils/utils.js";

export default {
  name: "OverlayCreateRoom",
  props: {
    id: String,
  },
  methods: {
    closeOverlay() {
      changeElementVisibility(this.id);
    },
    createRoom() {
      let matrixClient = this.$store.getters.matrixClient;
      let roomName = document.getElementById("create-room-name-input").value;
      let roomTopic = document.getElementById("create-room-topic-input").value;
      let roomVisibility = "";
      let roomVisibilityOptions = document.getElementsByName(
        "create-room-visibility-option"
      );
      roomVisibilityOptions.forEach((option) => {
        if (option.checked) {
          roomVisibility = option.value;
        }
      });
      let roomId = "";

      if (Boolean(roomName) && Boolean(roomVisibility)) {
        matrixClient
          .createRoom({
            visibility: roomVisibility,
            name: roomName,
            topic: roomTopic,
          })
          .then((response) => {
            roomId = response.room_id;
          })
          .catch((error) => {
            throw error;
          });
      }
      this.$router.push({ name: "Room", params: { roomId: roomId } });
    },
  },
};
</script>

<style scoped lang="css">
.overlay-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 998;
  cursor: pointer;
}
.overlay-panel {
  overflow-y: auto;
  background-color: #ced4da;
  position: absolute;
  left: 5%;
  top: 5%;
  width: 90%;
  z-index: 999;
}
label {
  margin-top: 2.5%;
}
.create-room-element {
  margin-bottom: 2.5%;
  align-items: center;
}
.create-room-element > input {
  margin-right: 1%;
}
</style>
