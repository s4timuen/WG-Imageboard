<template>
  <div class="container-fluid border rounded">
    <div :id="postData['initial-message'].getId()" class="row">
      <h5 class="col-12">
        {{ postData["initial-message"].getContent().header }}
      </h5>
      <div class="post-meta-info col-12">
        <span>{{ postData["initial-message"].getSender() }}</span>
        <span>{{ postData["initial-message"].getDate() }}</span>
      </div>
      <div class="col-12">
        <img
          :src="getHttpUrl(postData['initial-message'].getContent().url)"
          :alt="postData['initial-message'].getContent().body"
        />
      </div>
      <div class="col-12 post-message">
        {{ postData["initial-message"].getContent().body }}
      </div>
    </div>
    <div v-if="postData.replies.length > 0" class="row reply-messages">
      <Reply
        v-for="(subReply, key) in postData.replies"
        :key="key"
        :roomId="roomId"
        :reply="subReply"
      />
    </div>
    <div class="row">
      <span
        class="clickable"
        @click="
          changeElementVisibility('CR<' + postData['initial-message'].getId())
        "
        >{{ $t("show-reply-input") }}
      </span>
      <span
        class="clickable"
        @click="
          changeElementVisibility('UM<' + postData['initial-message'].getId())
        "
        >{{ $t("show-update-input") }}
      </span>
      <span class="clickable" @click="deletePost()"
        >{{ $t("show-delete-post") }}
      </span>
      <CreateReply
        :createReplyId="'CR<' + postData['initial-message'].getId()"
        :roomId="roomId"
        hidden
      />
      <UpdateMessage
        :updateMessageId="'UM<' + postData['initial-message'].getId()"
        :roomId="roomId"
        :postMessage="postData['initial-message'].getContent().body"
        hidden
      />
    </div>
  </div>
</template>

<script>
import Reply from "@/components/views/room/Reply.vue";
import CreateReply from "@/components/views/room/CreateReply.vue";
import UpdateMessage from "@/components/views/room/UpdateMessage.vue";
import { changeElementVisibility } from "@/utils/utils.js";

export default {
  name: "Post",
  components: {
    Reply,
    CreateReply,
    UpdateMessage,
  },
  props: {
    postData: Object,
    roomId: String,
  },
  methods: {
    changeElementVisibility,
    getHttpUrl(mxcUrl) {
      let matrixClient = this.$store.getters.matrixClient;
      return matrixClient.mxcUrlToHttp(mxcUrl, 50, 50, "scale", false);
    },
    deletePost() {
      let matrixClient = this.$store.getters.matrixClient;
      let userId = matrixClient.getUserId();
      let postSenderId = this.postData["initial-message"].getSender();
      let room = matrixClient.getRoom(this.roomId);

      // get IDs of the post and all related replies
      let eventIds = this.getEventIds(this.postData);

      // remove all related events from timeline and redact all on homeserver
      if (userId == postSenderId) {
        if (window.confirm("Sure to delete this post?")) {
          for (let eventId of eventIds) {
            let timeline = room.getTimelineForEvent(eventId);
            timeline.removeEvent(eventId);
            matrixClient.redactEvent(this.roomId, eventId, "", {
              reason: "Post and replies deleted by original user.",
            });
          }
        }
      }
    },
    getEventIds(postData) {
      let ids = [];
      // id of initial post
      ids.push(postData["initial-message"].getId());
      // ids of replies
      postData.replies.forEach((reply) => {
        ids.push(reply["reply-message"].getId());
      });
      return ids;
    },
  },
};
</script>

<style scoped lang="css">
.clickable {
  margin-right: 5%;
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}
.post-meta-info {
  margin-top: 2%;
  font-size: 0.7em;
  margin-bottom: 2%;
}
h5 {
  margin-top: 2.5%;
  text-decoration: underline;
}
.post-message {
  margin-top: 2.5%;
}
.reply-messages {
  margin-bottom: 5%;
}
</style>
