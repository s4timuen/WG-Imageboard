<template>
  <div class="container-fluid">
    <div class="row">
      <div class="reply-meta-info col-12">
        <span>{{ reply["reply-message"].getSender() }}</span>
        <span>{{ reply["reply-message"].getDate() }}</span>
      </div>
      <div :id="reply['reply-message'].getId()" class="col-12">
        {{ reply["reply-message"].getContent().body }}
      </div>
    </div>
    <div class="row">
      <span class="clickable" @click="deleteReply()"
        >{{ $t("show-delete-post") }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Reply",
  props: { reply: Object },
  methods: {
    deleteReply() {
      let matrixClient = this.$store.getters.matrixClient;
      let userId = matrixClient.getUserId();
      let replySenderId = this.reply["reply-message"].getSender();
      let roomId = this.reply["reply-message"].getRoomId();
      let room = matrixClient.getRoom(roomId);
      let eventId = this.reply["reply-message"].getId();
      let timeline = room.getTimelineForEvent(eventId);

      // remove event from timeline and redact on homeserver
      if (userId == replySenderId) {
        if (window.confirm("Sure to delete this reply?")) {
          timeline.removeEvent(eventId);
          matrixClient.redactEvent(roomId, eventId, "", {
            reason: "Reply deleted by user.",
          });
        }
      }
    },
  }
};
</script>

<style scoped lang="css">
.reply-meta-info {
  margin-bottom: 2%;
  font-size: 0.7em;
}

.clickable {
  margin-right: 5%;
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}
</style>
