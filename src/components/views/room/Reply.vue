<template>
  <div class="container-fluid">
    <div :id="reply['reply-message'].getId()" class="col-12 reply-message">
      {{ reply["reply-message"].getContent().body }}
    </div>

    <div v-if="reply.replies.length > 0" class="col-12 reply-message">
      <Reply
        v-for="(subReply, key) in reply.replies"
        :key="key"
        :reply="subReply"
      />
    </div>
  </div>
</template>

<script>
import Reply from "@/components/views/room/Reply.vue";

export default {
  name: "Reply",
  components: { Reply },
  props: { reply: Object },
};
</script>

<style scoped lang="css">
.reply-message {
  text-align: start;
  padding: 0%;
}
</style>
