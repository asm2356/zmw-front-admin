<template>
  <div>
    <div>
      <div class="discuss-title">回复文章的评论:</div>
      <Discuss/>
    </div>
    <div>
      <div class="reply-discuss-title">评论者相互之间的评论:</div>
      <ReplyDiscuss/>
    </div>
  </div>
</template>

<script>
  import Discuss from "./discuss";
  import ReplyDiscuss from "./replyDiscuss";

  export default {
    name: "discussList",
    components: {Discuss, ReplyDiscuss}
  }
</script>

<style scoped>
  .discuss-title, .reply-discuss-title {
    font-size: 15px;
    color: black;
    font-weight: bold;
  }

  .reply-discuss-title {
    margin-top: 50px;
  }
</style>
