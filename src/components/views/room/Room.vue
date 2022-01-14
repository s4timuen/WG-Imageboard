<template>
  <div id="room-page" class="container-fluid">
    <div id="room-create-post" class="row">
      <CreatePost />
    </div>
    <div id="room-posts" class="row">
      <Post v-for="(post, key) in posts" :key="key" :postData="post" />
    </div>
  </div>
</template>

<script>
import Post from "@/components/views/room/Post.vue";
import CreatePost from "@/components/views/room/CreatePost.vue";
import { checkSession } from "@/utils/session.js";
import { buildPosts } from "@/utils/posts.js";

export default {
  name: "ProfilePage",
  components: {
    Post,
    CreatePost,
  },
  props: {
    roomId: String,
  },
  data: function () {
    return {
      posts: {},
    };
  },
  mounted: async function () {
    const THIS = this;
    let matrixClient = this.$store.getters.matrixClient;
    let accessToken = this.$cookie.get("matrix-user-token");

    // check valid login and session
    checkSession(this, accessToken);

    // get room timeline events and create posts data structure
    let room = matrixClient.getRoom(this.roomId);
    this.posts = await buildPosts(room.timeline);

    // listen to timeline events (new posts and replies)
    matrixClient.on("Room.timeline", async function (event) {
      if (event.getType() === "m.room.message") {
        if (event.getRoomId() === THIS.roomId) {
          THIS.posts = await buildPosts(room.timeline);
        }
      }
    });
  },
};
</script>

<style scoped lang="css">
</style>
