<template>
  <div class="container-fluid col-12 border rounded">
    <h4 class="col-12 create-post">{{ $t("create-post") }}</h4>
    <!-- input post title -->
    <div class="row">
      <label class="col-8 offset-2 d-flex justify-content-start">{{
        $t("title")
      }}</label>
      <input
        id="create-post-title-input"
        type="text"
        class="col-8 offset-2 d-flex justify-content-start"
        :placeholder="$t('placeholder-enter-title')"
      />
    </div>
    <!-- input post message -->
    <div class="row">
      <label class="col-8 offset-2 d-flex justify-content-start">{{
        $t("message")
      }}</label>
      <textarea
        id="create-post-message-input"
        type="text"
        class="col-8 offset-2 d-flex justify-content-start"
        :placeholder="$t('placeholder-enter-message')"
      />
    </div>
    <!-- input post image -->
    <div class="row">
      <input
        id="create-post-image-input"
        class="offset-2 d-flex justify-content-center"
        type="file"
        @change="onFileSelected"
      />
    </div>
    <!-- send post button -->
    <div class="row">
      <button
        id="create-post-send-button"
        class="offset-2 d-flex justify-content-center"
        type="button"
        @click="sendPost()"
      >
        {{ $t("send-post-button") }}
      </button>
    </div>
  </div>
</template>

<script>
import { updateUserGamificationData } from "@/utils/gamification.js";

export default {
  name: "CreatePost",
  props: { roomId: String },
  data: function () {
    return { selectedImage: null };
  },
  methods: {
    onFileSelected(event) {
      this.selectedImage = event.target.files[0];
    },
    async sendPost() {
      let matrixClient = this.$store.getters.matrixClient;
      let userId = matrixClient.getUserId();
      let title = document.getElementById("create-post-title-input").value;
      let message = document.getElementById("create-post-message-input").value;

      // upload image (to homeserver) and send message event (to room)
      if (Boolean(title) && Boolean(message) && Boolean(this.selectedImage)) {
        await matrixClient
          .uploadContent(this.selectedImage, {
            name: this.selectedImage.name,
            type: this.selectedImage.type,
            onlyContentUri: false,
          })
          .then((response) => {
            let content = {
              header: title,
              body: message,
              game: {
                likes: [],
                dislikes: [],
              },
              msgtype: "m.image",
              url: response.content_uri,
            };

            matrixClient.sendEvent(
              this.roomId,
              "m.room.message",
              content,
              "",
              (err) => {
                console.log(err);
              }
            );

            // gamification event
            updateUserGamificationData(
              userId,
              this.roomId,
              undefined,
              "increment-posts-count"
            );

            // reset input fields
            document.getElementById("create-post-title-input").value = "";
            document.getElementById("create-post-message-input").value = "";
            document.getElementById("create-post-image-input").value = "";
            this.selectedImage = null;
          })
          .catch((error) => {
            throw error;
          });
      }
    },
  },
};
</script>

<style scoped lang="css">
.create-post {
  text-align: start;
  margin-top: 1%;
  margin-bottom: 0%;
}
label {
  margin-top: 2.5%;
}
#create-post-send-button,
#create-post-image-input {
  margin-top: 2.5%;
  margin-bottom: 2.5%;
}
</style>
