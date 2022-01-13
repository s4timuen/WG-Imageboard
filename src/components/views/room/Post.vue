<template>
  <div class="container-fluid">
    <div :id="postData['initial-message'].getId()" class="ol-12 post-message">
      {{ postData["initial-message"].getContent().body }}
    </div>

    <div v-if="postData.replies.length > 0" class="col-12 reply-message">
      <Reply
        v-for="(subReply, key) in postData.replies"
        :key="key"
        :reply="subReply"
      />
    </div>
  </div>
</template>

<script>
import Reply from "@/components/views/room/Reply.vue";

export default {
  name: "Post",
  components: { Reply },
  props: { postData: Object },
};
</script>

<style scoped lang="css">
.post-message {
  text-align: start;
}
.reply-message {
  text-align: start;
  padding: 0%;
}
</style>
