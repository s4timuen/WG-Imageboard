<template>
  <div id="room-page" class="container-fluid">
    <div id="room-create-post" class="row">
      <CreatePost :roomId="roomId" />
    </div>
    <div id="room-posts" class="row">
      <Post
        v-for="(post, key) in posts"
        :key="key"
        :postData="post"
        :roomId="roomId"
      />
    </div>
  </div>
</template>

<script>
import Post from "@/components/views/room/Post.vue";
import CreatePost from "@/components/views/room/CreatePost.vue";
import { checkSession } from "@/utils/session.js";
import { buildPosts, applyEdits } from "@/utils/posts.js";

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
  methods: {
    async getPosts(timeline) {
      let postsHelper = {};
      postsHelper = await buildPosts(timeline);
      postsHelper = await applyEdits(postsHelper);
      return postsHelper;
    },
  },
  mounted: async function () {
    const THIS = this;
    let matrixClient = this.$store.getters.matrixClient;
    let accessToken = this.$cookie.get("matrix-user-token");

    // check valid login and session
    await checkSession(this, accessToken);

    // get room timeline events and create posts data structure
    let room = matrixClient.getRoom(this.roomId);
    this.posts = await this.getPosts(room.timeline);

    // listen to timeline events (new posts and replies)
    matrixClient.on("Room.timeline", async function (event) {
      if (
        event.getType() === "m.room.message" ||
        event.getType() === "m.room.redaction"
      ) {
        if (event.getRoomId() === THIS.roomId) {
          THIS.posts = await THIS.getPosts(room.timeline);
        }
      }
    });
  },
};
</script>

<style scoped lang="css">
</style>
