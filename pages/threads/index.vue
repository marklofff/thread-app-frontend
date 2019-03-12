<template>
  <section 
    class="container"
    style="margin-top:50px;">
    <div class="columns">
      <div class="column is-10">
        <div class="box">
          <div class="content">
            <h1 class="title is-5 has-text-grey">あなたのスレッド</h1>
            <article
              v-for="(thread, i) of threads"
              :key="i"
              class="post">
              
              <h4 class="has-text-weight-bold for-text-link">
                <i 
                  :class="isClosed(thread)"
                  class="fas"/>
                <span
                  :class="getType(thread)"
                  class="tag">{{ thread.type }}</span>
                <nuxt-link :to="{ name: 'threads-id', params: { id: thread.id }}">
                  {{ thread.title }}
                </nuxt-link>
              </h4>

              <div class="media">
                <div class="media-left">
                  <p class="image is-32x32">
                    <img
                      :src="userAvatar(thread)"
                      class="is-rounded">
                  </p>
                </div>

                <div class="media-content">
                  <div class="content">
                    <p>
                      {{ thread.user.username }}#{{ thread.user.discriminator }}
                      <!--  が{{ thread.time }}前にメッセージを送りました -->
                    </p>
                  </div>
                </div>

                <div class="media-right">
                  <div class="field has-addons">
                    <p class="control">
                      <a
                        class="button"
                        @click="openEditModal(thread)">
                        <span class="has-text-grey-dark"><i class="fas fa-edit"/></span>
                      </a>
                    </p>
                    <p class="control">
                      <a
                        class="button"
                        @click="openModal(thread)">
                        <span class="has-text-danger">
                          <i class="fas fa-trash-alt"/>
                        </span>
                      </a>
                    </p>
                    <p
                      v-if="!thread.closed"
                      class="control">
                      <a
                        class="button"
                        @click="closeThread(thread)">
                        <span class="has-text-orange">
                          <i class="fas fa-ban"/>
                        </span>
                      </a>
                    </p>
                    <p
                      v-else-if="thread.closed"
                      class="control">
                      <a
                        class="button"
                        @click="reopenThread(thread)">
                        <span class="has-text-success">
                          <i class="fas fa-lock-open"/>
                        </span>
                      </a>
                    </p>
                  </div>
                </div>

                <a
                  style="margin-left:5px;"
                  class="button is-static">
                  <span class="has-text-grey-dark"><i class="fa fa-comments"/> {{ thread.posts.length }}</span>
                </a>

              </div>
            </article>
          </div>

          <hr>

          <section v-if="pagination">
            <b-pagination
              :total="pagination.total_entries"
              :current.sync="current"
              :per-page="pagination.page_size"
              @change="fetchNextPage"/>
          </section>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import modal from '~/components/modal'
import edit from '~/components/edit'

export default {
  data: () => ({
      current: 1,
      perPage: 5,
  }),
  async fetch ({ store, params }) {
    await store.dispatch('fetchThreads', params.page)
  },
  computed: {
    threads () {
      return this.$store.state.threads
    },
    pagination () {
      return this.$store.state.pagination
    },
  },
  watch: {
    '$route': function(to, from) {
      this.fetchNextPage(to.query.page)
      this.current = Number(to.query.page)
    }
  },
  mounted () {
    if (this.$route.query.page) {
      this.current = Number(this.$route.query.page)
    }
  },
  methods: {
    isClosed(thread) {
      return thread.closed ? 'fa-ban has-text-danger' : 'fa-check-circle has-text-success'
    },

    getType(thread) {
      return thread.type === 'buy' ? 'is-danger' : 'is-link'
    },

    deleteThread (thread) {
      this.$store.dispatch('deleteThread', thread.id)
        .then(() => {
          this.$snackbar.open(`スレッド: ${thread.title}が正常に削除されました`) 
        })
        this.$snackbar.open({
          message: `スレッド: ${thread.title}が正常に削除されました。`,
          type: 'is-warning',
          position: 'is-top',
          queue: false
        })
    },

    closeThread (thread) {
      this.$store.dispatch('closeThread', thread.id)
        .then(() => {
          this.$snackbar.open({
            message: `スレッド: ${thread.title}が正常に閉じました。`,
            type: 'is-warning',
            queue: false
          }) 
            
        })
    },

    reopenThread (thread) {
      this.$store.dispatch('reopenThread', thread.id)
        .then(() => {
          this.$snackbar.open({
            message: `スレッド: ${thread.title}が正常に開きました。`,
            type: 'is-success',
            queue: false
          }) 
        })
    },

    updateThread (thread) {
      this.$store.dispatch('updateThread', thread)
        .then(() => {
          this.$snackbar.open({
            message: `スレッド: ${thread.id}#${thread.title}を更新しました。`,
            type: 'is-success',
            queue: false
          }) 
        })
    },

    userAvatar (thread) {
      return `https://cdn.discordapp.com/avatars/${thread.user.userid}/${thread.user.avatar}?size=256`
    },

    openModal (thread) {
      this.$modal.open({
        props: { thread: thread },
        parent: this,
        component: modal,
        hasModalCard: true
      })
    },

    openEditModal (thread) {
      this.$modal.open({
        props: { thread: thread },
        parent: this,
        component: edit,
        hasModalCard: true
      })
    },

    fetchNextPage (pageNumber) {
      this.$store.dispatch('fetchThreads', { page: pageNumber })
        .then(() => {
          this.$router.push({path: this.$route.path, query: { page: pageNumber }})
        })
    }
  },
}
</script>
