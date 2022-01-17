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
      <div
        class="col-12"
        v-if="postData['initial-message'].getContent().msgtype == 'm.text'"
      >
        {{ postData["initial-message"].getContent().body }}
      </div>
      <div
        class="col-12"
        v-if="postData['initial-message'].getContent().msgtype == 'm.image'"
      >
        <img
          :src="getHttpUrl(postData['initial-message'].getContent().url)"
          :alt="postData['initial-message'].getContent().body"
        />
      </div>
    </div>
    <div v-if="postData.replies.length > 0" class="row reply-message">
      <Reply
        v-for="(subReply, key) in postData.replies"
        :key="key"
        :reply="subReply"
      />
    </div>
    <div class="row">
      <span
        class="clickable"
        @click="
          changeVisibilityCreateReply(
            'CR<' + postData['initial-message'].getId()
          )
        "
        >{{ $t("show-reply-input") }}</span
      >
      <CreateReply
        :createReplyId="'CR<' + postData['initial-message'].getId()"
        :roomId="roomId"
        hidden
      />
    </div>
  </div>
</template>

<script>
import Reply from "@/components/views/room/Reply.vue";
import CreateReply from "@/components/views/room/CreateReply.vue";
import { changeVisibilityCreateReply } from "@/utils/posts.js";

export default {
  name: "Post",
  components: { Reply, CreateReply },
  props: { postData: Object, roomId: String },
  methods: {
    changeVisibilityCreateReply,
    getHttpUrl(mxcUrl) {
      let matrixClient = this.$store.getters.matrixClient;
      return matrixClient.mxcUrlToHttp(mxcUrl, 50, 50, "scale", false);
    },
  },
  mounted: function () {
    console.log(this.postData);
  },
};
</script>

<style scoped lang="css">
.clickable {
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}
.post-meta-info {
  font-size: 0.7em;
}
h5 {
  text-decoration: underline;
}
</style>
