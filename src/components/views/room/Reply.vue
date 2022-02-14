<template>
  <div class="container-fluid reply">
    <!-- reply -->
    <div class="row">
      <!-- reply meta data -->
      <div class="reply-meta-info col-12">
        <span>{{ reply["reply-message"].getSender() + ", " }}</span>
        <span>{{ reply["reply-message"].getDate() + ", " }}</span>
        <span>{{ $t("profile-game-rank") + userGameData.rank + ", " }}</span>
        <span>{{
          $t("profile-game-total-likes") +
          userGameData.rooms[roomId].likes_count +
          ", "
        }}</span>
      </div>
      <!-- reply message -->
      <div :id="reply['reply-message'].getId()" class="col-12">
        {{ reply["reply-message"].getContent().body }}
      </div>
    </div>
    <!-- reply options -->
    <div class="row">
      <!-- like reply -->
      <span class="clickable" @click="like()">{{ $t("like") }} </span>
      <!-- dislike reply -->
      <span class="clickable" @click="dislike()">{{ $t("dislike") }} </span>
      <!-- edit reply -->
      <span
        class="clickable"
        @click="changeElementVisibility('UM<' + reply['reply-message'].getId())"
        >{{ $t("show-update-input") }}
      </span>
      <!-- delete reply -->
      <span class="clickable" @click="deleteReply()"
        >{{ $t("show-delete-post") }}
      </span>
      <!-- likes sum -->
      <span>{{ $t("likes" + ": ") + likesSum }}</span>
      <!-- edit reply input -->
      <UpdateMessage
        :updateMessageId="'UM<' + reply['reply-message'].getId()"
        :roomId="roomId"
        :messageContent="reply['reply-message'].getContent()"
        hidden
      />
    </div>
  </div>
</template>

<script>
import UpdateMessage from "@/components/views/room/UpdateMessage.vue";
import { changeElementVisibility } from "@/utils/utils.js";
import {
  updateUserGamificationData,
  getUserGamificationData,
} from "@/utils/gamification.js";

export default {
  name: "Reply",
  components: { UpdateMessage },
  props: {
    reply: Object,
    roomId: String,
  },
  data: function () {
    return {
      userGameData: {
        rooms: {
          [this.roomId]: {
            likes_count: 0,
          },
        },
        rank: "new user",
      },
    };
  },
  computed: {
    // computed value of likes minus dislikes
    likesSum() {
      let likes = this.reply["reply-message"].getContent().game.likes.length;
      let dislikes =
        this.reply["reply-message"].getContent().game.dislikes.length;
      return likes - dislikes;
    },
  },
  methods: {
    changeElementVisibility,
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
        if (window.confirm(this.$t("alert-confirm-deletion-reply"))) {
          timeline.removeEvent(eventId);
          matrixClient.redactEvent(roomId, eventId, "", {
            reason: "Reply deleted by user.",
          });
        }
      }
      // alert if unauthorized user
      if (userId !== replySenderId) {
        alert(this.$t("alert-unauthorized-deletion-reply"));
      }

      // gamification event
      updateUserGamificationData(
        userId,
        this.roomId,
        undefined,
        undefined,
        "reduce-replies-count"
      );
    },
    like() {
      let matrixClient = this.$store.getters.matrixClient;
      let userId = matrixClient.getUserId();
      let eventId = this.reply["reply-message"].getId();
      updateUserGamificationData(
        userId,
        this.roomId,
        eventId,
        this,
        "increment-likes-count"
      );
    },
    dislike() {
      let matrixClient = this.$store.getters.matrixClient;
      let userId = matrixClient.getUserId();
      let eventId = this.reply["reply-message"].getId();
      updateUserGamificationData(
        userId,
        this.roomId,
        eventId,
        this,
        "reduce-likes-count"
      );
    },
  },
  mounted: async function () {
    let matrixClient = this.$store.getters.matrixClient;

    // if logged and session valid
    let userId = matrixClient.getUserId();
    this.userData = matrixClient.getUser(userId);
    let gameData = await getUserGamificationData(userId);
    if (gameData) {
      this.userGameData = gameData;
    }
  },
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
.reply {
  background-color: #c1c7cc;
  padding-top: 5%;
}
</style>
