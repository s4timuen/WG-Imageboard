<template>
  <div :id="createReplyId" class="container-fluid">
    <!-- input reply message -->
    <div class="row">
      <label class="col-8 offset-2 d-flex justify-content-start">{{
        $t("reply")
      }}</label>
      <textarea
        :id="'TA<' + createReplyId"
        type="text"
        class="col-8 offset-2 d-flex justify-content-start"
        :placeholder="$t('placeholder-enter-reply')"
      />
    </div>
    <!-- send reply button -->
    <div class="row">
      <button
        id="create-reply-send-button"
        class="offset-2 d-flex justify-content-center create-reply-send-button"
        type="button"
        @click="sendReply('TA<' + createReplyId)"
      >
        {{ $t("send-reply-button") }}
      </button>
    </div>
  </div>
</template>

<script>
import { updateUserGamificationData } from "@/utils/gamification.js";

export default {
  name: "CreateReply",
  props: {
    createReplyId: String,
    roomId: String,
  },
  methods: {
    sendReply(textAreaId) {
      let matrixClient = this.$store.getters.matrixClient;
      let userId = matrixClient.getUserId();
      let message = document.getElementById(textAreaId).value;
      let eventId = this.createReplyId.substring(3);

      // build event content
      let content = {
        body: message,
        "m.relates_to": {
          "m.in_reply_to": {
            event_id: eventId,
          },
        },
        game: {
          likes: [],
          dislikes: [],
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

      // gamification event
      updateUserGamificationData(
        userId,
        this.roomId,
        undefined,
        undefined,
        "increment-replies-count"
      );

      // reset input fields
      document.getElementById(textAreaId).value = "";
    },
  },
};
</script>

<style scoped lang="css">
label {
  margin-top: 2.5%;
}
.create-reply-send-button {
  margin-top: 2.5%;
  margin-bottom: 2.5%;
}
</style>
