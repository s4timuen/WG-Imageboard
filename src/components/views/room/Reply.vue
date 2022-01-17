<template>
  <div class="container-fluid border rounded">
    <div class="row">
      <div class="reply-meta-info col-12">
        <span>{{ reply["reply-message"].getSender() }}</span>
        <span>{{ reply["reply-message"].getDate() }}</span>
      </div>
      <div :id="reply['reply-message'].getId()" class="col-12">
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
.reply-meta-info {
  font-size: 0.7em;
}
</style>
