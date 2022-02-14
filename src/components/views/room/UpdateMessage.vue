<template>
  <div :id="updateMessageId" class="container-fluid">
    <!-- message edit input -->
    <div class="row">
      <label class="col-8 offset-2 d-flex justify-content-start">{{
        $t("update")
      }}</label>
      <textarea
        :id="'TA<' + updateMessageId"
        type="text"
        class="col-8 offset-2 d-flex justify-content-start"
        :value="messageContent.body"
      />
    </div>
    <!-- send message edit button -->
    <div class="row">
      <button
        id="update-message-send-button"
        class="
          offset-2
          d-flex
          justify-content-center
          update-message-send-button
        "
        type="button"
        @click="updateMessage('TA<' + updateMessageId)"
      >
        {{ $t("send-update-button") }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "UpdateMessage",
  props: {
    updateMessageId: String,
    roomId: String,
    messageContent: Object,
  },
  methods: {
    updateMessage(textAreaId) {
      let matrixClient = this.$store.getters.matrixClient;
      let message = document.getElementById(textAreaId).value;
      let eventId = this.updateMessageId.substring(3);
      let userId = matrixClient.getUserId();
      let senderId = this.messageContent.getSender();

      // build event content
      if (userId === senderId) {
        let content = {
          body: message,
          "m.relates_to": {
            replace: {
              event_id: eventId,
            },
          },
          msgtype: "m.text",
        };

        // send event
        if (message) {
          matrixClient.sendEvent(
            this.roomId,
            "m.room.message",
            content,
            "",
            (err) => {
              console.log(err);
            }
          );
        }
      }
      // alert if unauthorized user
      if (userId !== senderId) {
        alert(this.$t("alert-unauthorized-post-or-reply-edit"));
      }
    },
  },
};
</script>

<style scoped lang="css">
label {
  margin-top: 2.5%;
}
.update-message-send-button {
  margin-top: 2.5%;
  margin-bottom: 2.5%;
}
</style>
