<template>
  <div
    class="modal-card"
    style="width: 700px">
    <header class="modal-card-head">
      <p class="modal-card-title">{{ thread.title }}を編集中</p>
    </header>
    <section class="modal-card-body">
      <b-field label="スレッドのタイトル">
        <b-input
          :value="thread.title"
          v-model="thread.title"
          type="text"
          required />
      </b-field>

      <b-field label="スレッドのタイプ">
        <div class="select">
          <select v-model="thread.type">
            <option value="buy">買い</option>
            <option value="sell">売り</option>
          </select>
        </div>
      </b-field>

    </section>
    <footer class="modal-card-foot">
      <button
        class="button is-danger"
        type="button"
        @click="$parent.close()">キャンセル</button>
      <button
        class="button is-info"
        @click="updateThread">保存</button>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    thread: {
      type: Object,
      default: null
    }
  },
  methods: {
    updateThread () {
      this.$parent.$parent.updateThread(this.thread)
      this.$parent.close()
    }
  }
}
</script>
