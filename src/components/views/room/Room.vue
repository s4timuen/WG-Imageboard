<template>
  <div id="room-page" class="container-fluid">
    <div id="room-posts" class="row">
      <Post
        class="col-12 border rounded"
        v-for="(post, key) in posts"
        :key="key"
        :postData="post"
        @
      />
    </div>
  </div>
</template>

<script>
import Post from "@/components/views/room/Post.vue";
import { checkSession } from "@/utils/session.js";

export default {
  name: "ProfilePage",
  components: { Post },
  props: {
    roomId: String,
  },
  data: function () {
    return {
      posts: {},
    };
  },
  methods: {
    // TODO: (2) CRUD
    // TODO: (3) initial post must contain image, replies can contain image (?)
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
          console.log(event.getContent().body);
        if (event.getRoomId() === THIS.roomId) {
          THIS.posts = await buildPosts(room.timeline);
           // TODO: (4) listen to CRUD -> post builder
        }
      }
    });
  },
};

async function buildPosts(timeline) {
  let posts = [];
  await timeline.forEach((matrixEvent) => {
    if (matrixEvent.getType() === "m.room.message") {
      // new post
      // "matrixEvent.getContent()["m.relates_to"]["m.in_reply_to"].event_id"
      // should be "matrixClient.getRelation()"
      // but matrixEvent.getRelation() -> always returns null, bug?
      if (matrixEvent.getContent()["m.relates_to"] === undefined) {
        posts.push({
          "initial-message": matrixEvent,
          replies: [],
        });
      }
      // reply
      if (matrixEvent.getContent()["m.relates_to"] !== undefined) {
        // reply to post
        if (
          matrixEvent.getContent()["m.relates_to"]["m.in_reply_to"].event_id !==
          undefined
        ) {
          posts.forEach((post) => {
            // reply to initial message
            if (
              post["initial-message"].getId() ===
              matrixEvent.getContent()["m.relates_to"]["m.in_reply_to"].event_id
            ) {
              post.replies.push({
                "reply-message": matrixEvent,
                replies: [],
              });
            }
            // reply to a reply
            if (
              post["initial-message"].getId() !==
              matrixEvent.getContent()["m.relates_to"]["m.in_reply_to"].event_id
            ) {
              post.replies.forEach((reply) => {
                if (
                  reply["reply-message"].getId() ===
                  matrixEvent.getContent()["m.relates_to"]["m.in_reply_to"]
                    .event_id
                ) {
                  reply.replies.push({
                    "reply-message": matrixEvent,
                    replies: [],
                  });
                }
              });
            }
          });
        }
      }
    }
  });
  return posts;
}
</script>

<style scoped lang="css">
</style>
