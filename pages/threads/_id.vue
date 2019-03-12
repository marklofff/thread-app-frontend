<template>
  <section
    class="container"
    style="margin-top:50px;">
    <div class="columns">
      <div class="column is-10">
        <div class="box content">
          <div class="tabs-page is-show js-tabs-page js-tabs_page-design">
            <div
              v-if="thread"
              class="media">
              <div class="media-left">
                <h2 class="title title-comment is-4">
                  <i 
                    v-if="!thread.closed"
                    class="fas fa-check-circle has-text-success"/>
                  <i
                    v-else
                    class="fas fa-ban has-text-danger"/>
                  {{ thread.title }}
                  <span
                    v-if="thread.type === 'sell'"
                    class="tag is-link">{{ thread.type }}</span>
                  <span
                    v-if="thread.type === 'buy'" 
                    class="tag is-danger">{{ thread.type }}</span>
                </h2>
              </div>

              <div class="media-content"/>
              <div class="media-right">
                <h2 class="title title-comment is-4">
                  <i class="fas fa-crown has-text-warning"/> {{ thread.user.username }}#{{ thread.user.discriminator }}
                </h2>
              </div>
            </div>

            <div
              v-chat-scroll
              v-if="thread"
              class="chat-room">
              <article
                v-for="(post, i) of thread.posts"
                :key="i"
                class="media">

                <figure class="media-left">
                  <p class="image is-32x32">
                    <img
                      :src="userAvatar(post)"
                      class="is-rounded">
                  </p>
                </figure>

                <div class="media-content">
                  <div class="content">
                    <p>
                      <strong>{{ post.user.username }}#{{ post.user.discriminator }}</strong>
                      <br>{{ post.title }}
                      <img
                        v-if="post.image.length >= 1"
                        :src="getPostImage(post)">
                    </p>
                  </div>
                </div>
                
              </article>
            </div>

            <div
              v-if="!thread.closed"
              class="controls field has-addons"
              style="margin-top:20px;">
              <div
                class="control is-expanded">
                <input
                  v-model="message"
                  placeholder="メッセージを記入してください..."
                  class="input is-primary"
                  @keyup.enter="sendMessage()">
              </div>

              <div
                class="control"
                @click="sendMessage()">
                <a class="button is-primary">
                  <span class="icon">
                    <i class="fas fa-level-up-alt"/>
                  </span>
                  <span>Send</span>
                </a>
              </div>
            </div>

            <div v-if="!thread.closed">
              <div
                v-if="!image"
                class="file has-name is-fullwidth">
                <label class="file-label">
                  <input
                    class="file-input"
                    type="file"
                    name="resume"
                    @change="onFileChange">
                  <span class="file-cta">
                    <span class="file-icon">
                      <i class="fas fa-upload"/>
                    </span>
                    <span class="file-label">
                      画像を選択
                    </span>
                  </span>
                  <span class="file-name">
                    {{ filename }}
                  </span>
                </label>
              </div>

              <div
                v-else
                class="file has-name is-fullwidth">
                <label class="file-label">
                  <input
                    class="file-input"
                    type="file"
                    name="resume"
                    @click="removeImage">
                  <span class="file-cta">
                    <span class="file-icon">
                      <i class="fas fa-upload"/>
                    </span>
                    <span class="file-label">
                      画像を選択
                    </span>
                  </span>
                  <span class="file-name">
                    {{ filename }}
                  </span>
                </label>
              </div>
              <img
                :src="image"
                style="max-width:512px;max-height:256px;">
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
let socket = null

if (process.browser) {
  socket = require('~/lib/socket').socket
}

export default {
  data: () => ({
    image: null,
    files: [],
    filename: null,
    id: null,
    channel: null,
    message: ''
  }),
  async fetch ({ store, params }) {
    await store.dispatch('fetchThreadById', params.id)
  },
  computed: {
    thread () {
      return this.$store.state.thread
    },

    threads () {
      return this.$store.state.threads
    },

    loggedIn () {
      return this.$store.state.auth.loggedIn 
    },

    user () {
      return this.$store.state.auth.user
    },
  },
  mounted () {
    this.id = this.$route.params.id

    if (!socket.ready) {
      socket.init(this.$store.state.token)
    }

    this.channel = socket.joinRoom({ store: this.$store, id: this.id})

    this.scrollToEnd()
  },
  methods: {
    sendMessage () {
      if (this.image) {
        let fd = new FormData()
        let imageObj = this.files[0]

        fd.append('image_path', imageObj)
        fd.append('message', this.message)
        fd.append('thread_id', this.id)

        this.$axios.post('/api/threads/create_post', fd)
      } else {
        this.channel.push('message:new', {
          message: this.message
        })
      }

      this.message = ''
      this.image = null
    },

    onFileChange (e) {
      let files = e.target.files || e.dataTransfer.files

      if (files.length) {
        this.files = e.target.files
        this.filename = e.target.files[0].name
        this.createImage(files[0])
      }
    },

    createImage (file) {
      let image = new Image()
      let reader = new FileReader()
      let vm = this

      reader.onload = (e) => {
        vm.image = e.target.result
      }

      reader.readAsDataURL(file)
    },

    removeImage (e) {
      this.image = null
    },

    scrollToEnd() {
      let container = this.$el.querySelector('.chat-room')
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    },

    userAvatar (post) {
      return `https://cdn.discordapp.com/avatars/${post.user.userid}/${post.user.avatar}?size=256`
    },

    getPostImage (post) {
      return `${process.env.BASE_URL}/${post.image[0].path}`
    }
  }
}
</script>
