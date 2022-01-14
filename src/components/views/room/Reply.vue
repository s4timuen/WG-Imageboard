<template>
  <div class="container-fluid">
    <div class="row">
      <div :id="reply['reply-message'].getId()" class="col-12 reply-message">
        {{ reply["reply-message"].getContent().body }}
      </div>
    </div>
  </div>
</template>

<script>
import { changeVisibilityCreateReply } from "@/utils/posts.js";

export default {
  name: "Reply",
  props: { reply: Object },
  methods: { changeVisibilityCreateReply },
};
</script>

<style scoped lang="css">
.reply-message {
  text-align: start;
  padding: 0%;
}
</style>
