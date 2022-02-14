<template>
  <div id="profile-page" class="container-fluid rounded">
    <!-- user info section -->
    <div id="user-info-section" class="row border rounded">
      <div class="col-12 data-field">
        {{ $t("user-displayname") + userData.displayName }}
      </div>
      <div class="col-12 data-field">
        {{ $t("user-id") + userData.userId }}
      </div>
    </div>
    <!-- user gamification section -->
    <div id="user-game-section" class="row border rounded">
      <div class="col-12 data-field">
        {{ $t("profile-game-rank") + userGameData.rank }}
      </div>
      <div class="col-12 data-field">
        {{ $t("profile-game-total-likes") + totalLikes }}
      </div>
      <div class="col-12 data-field">
        {{ $t("profile-game-total-posts") + totalPosts }}
      </div>
      <div class="col-12 data-field">
        {{ $t("profile-game-total-replies") + totalReplies }}
      </div>
      <div class="col-12 data-field">
        {{ $t("profile-game-badges") }}
        <!-- display badges here after badges implementation -->
        <div
          class="col-12 data-field"
          v-for="(badge, key) in userGameData.badges"
          :key="key"
        >
          <div>
            {{ badge.name + ": " + badge.rank + ", " + badge.obtained }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { checkSession } from "@/utils/session.js";
import { getUserGamificationData } from "@/utils/gamification.js";

export default {
  name: "ProfilePage",
  data: function () {
    return {
      userData: {
        displayName: "",
        userId: "",
      },
      userGameData: {
        rooms: {},
        rank: "new user",
        badges: [],
      },
    };
  },
  computed: {
    totalLikes() {
      let counter = 0;
      if (this.userGameData !== null) {
        for (const value of Object.values(this.userGameData.rooms)) {
          counter += value.likes_count;
        }
      }
      return counter;
    },
    totalPosts() {
      let counter = 0;
      if (this.userGameData !== null) {
        for (const value of Object.values(this.userGameData.rooms)) {
          counter += value.posts_count;
        }
      }
      return counter;
    },
    totalReplies() {
      let counter = 0;
      if (this.userGameData !== null) {
        for (const value of Object.values(this.userGameData.rooms)) {
          counter += value.replies_count;
        }
      }
      return counter;
    },
  },
  mounted: async function () {
    // check valid login and session
    let accessToken = this.$cookie.get("matrix-user-token");
    await checkSession(this, accessToken);
  },
  created: async function () {
    // get user gamification data
    let matrixClient = this.$store.getters.matrixClient;
    let userId = matrixClient.getUserId();
    this.userData = matrixClient.getUser(userId);
    this.userGameData = await getUserGamificationData(userId);
  },
};
</script>

<style scoped lang="css">
.data-field {
  text-align: left;
}
</style>
