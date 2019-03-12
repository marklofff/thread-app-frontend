<template>
  <div
    class="modal-card"
    style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">確認</p>
    </header>
    <footer class="modal-card-foot">
      <button
        class="button"
        type="button"
        @click="$parent.close()">キャンセル</button>
      <button
        class="button is-danger"
        @click="deleteThread()">削除する</button>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    thread: {
      type: Object,
      default: null
    }, 
  },

  methods: {
    deleteThread() {
      this.$parent.$parent.deleteThread(this.thread)
      this.$parent.close()
    }
  }
}
</script>