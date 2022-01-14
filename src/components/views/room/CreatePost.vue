<template>
  <div class="container-fluid col-12 border rounded">
    <h4 class="col-12 create-post">{{ $t("create-post") }}</h4>
    <div class="row">
      <label class="col-8 offset-2 d-flex justify-content-start">{{
        $t("title")
      }}</label>
      <input
        id="create-post-title-input"
        type="text"
        class="col-8 offset-2 d-flex justify-content-start"
        placeholder="Enter Title"
        required="true"
      />
    </div>

    <div class="row">
      <label class="col-8 offset-2 d-flex justify-content-start">{{
        $t("message")
      }}</label>
      <textarea
        id="create-post-message-input"
        type="text"
        class="col-8 offset-2 d-flex justify-content-start"
        placeholder="Enter Messge"
        required="true"
      />
    </div>

    <div class="row">
      <button
        id="create-post-image-button"
        class="offset-2 d-flex justify-content-center"
        type="button"
        @click="uploadImage()"
      >
        {{ $t("upload-image-button") }} 
      </button>
    </div>

    <div class="row">
      <button
        id="create-post-send-button"
        class="offset-2 d-flex justify-content-center"
        type="button"
        @click="sendPost()"
      >
        {{ $t("send-button") }} 
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreatePost",
  methods: {
    uploadImage() {
      // TODO: see (2.2)
      console.log("todo");
    },
    sendPost() {
        // TODO: see (1.1)
    }
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
#create-post-image-button {
  margin-top: 2.5%;
  margin-bottom: 2.5%;
}
</style>
