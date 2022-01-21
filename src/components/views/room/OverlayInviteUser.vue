<template>
  <div :id="id">
    <div class="overlay-backdrop" @click="closeOverlay()" />
    <div class="container-fluid overlay-panel border rounded">
      <!-- user id input -->
      <div class="row">
        <label class="col-8 offset-2 d-flex justify-content-start">{{
          $t("invite-user-id")
        }}</label>
        <input
          id="invite-user-id-input"
          type="text"
          class="
            col-8
            offset-2
            d-flex
            justify-content-start
          "
          :placeholder="$t('placeholder-enter-user-id')"
          required
        />
      </div>
      <!-- invite reason message -->
      <div class="row">
        <label class="col-8 offset-2 d-flex justify-content-start">{{
          $t("invite-user-reason")
        }}</label>
        <textarea
          id="invite-user-reason-input"
          type="text"
          class="
            col-8
            offset-2
            d-flex
            justify-content-start
            invite-user-element
          "
          :placeholder="$t('placeholder-invite-user-reason')"
        />
      </div>
      <!-- invite user button -->
      <div class="row">
        <button
          id="invite-user-button"
          class="offset-2 d-flex justify-content-center invite-user-element"
          type="button"
          @click="inviteUser()"
        >
          {{ $t("invite-user-button") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { changeElementVisibility } from "@/utils/utils.js";

export default {
  name: "OverlayInviteUser",
  props: {
    id: String,
    roomId: String,
  },
  methods: {
    closeOverlay() {
      changeElementVisibility(this.id);
    },
    inviteUser() {
      let matrixClient = this.$store.getters.matrixClient;
      let userId = document.getElementById("invite-user-id-input").value;
      let inviteReason = document.getElementById(
        "invite-user-reason-input"
      ).value;

      matrixClient
        .invite(
          this.roomId,
          userId,
          (err) => {
            console.log(err);
          },
          inviteReason
        )
        .then(() => {
          document.getElementById("invite-user-id-input").value = "";
          document.getElementById("invite-user-reason-input").value = "";
        })
        .catch((error) => {
          throw error;
        });
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
.invite-user-element {
  margin-bottom: 2.5%;
  align-items: center;
}
</style>
