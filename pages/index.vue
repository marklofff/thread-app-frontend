<template>
  <section class="section">
    <h2
      v-if="loggedIn"
      class="title is-3 has-text-black">
      ようこそ、{{ user.username }}さん
    </h2>
    <h2
      v-else
      class="title is-3 has-text-black">
      ようこそ!
    </h2>
    <a
      v-if="!loggedIn"
      style="margin-bottom:10px;"
      class="button is-primary"
      @click="authenticate">
      <b-icon
        icon="discord"
        pack="fab"
        type="is-white"/>
      <span>Discordでサインイン</span>
    </a>
    <div class="columns is-mobile">
      <div
        v-for="(feature, i) of features"
        :key="i"
        class="column">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title has-text-grey">
              {{ feature.title }}
            </p>
          </header>

          <div class="card-content">
            <div class="content has-text-centered">
              <b-icon
                :icon="feature.icon"
                :pack="feature.pack"
                size="is-large"
                type="is-primary"/>
            </div>
          </div>

          <footer class="card-footer">
            <div
              class="card-footer-item"
              v-html="feature.content"/>
          </footer>
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
    features: [
      { title: '無料', pack: 'fab', icon: 'creative-commons-nc', content: `<span>すべて<b class="has-text-grey">無料</b>で使えます</span>` },
      { title: '使いやすい', pack: 'fas', icon: 'desktop', content: `<span>負荷を与えず、視認性の高いUIデザインを採用</span>` },
      { title: 'リアルタイムに', pack: 'fas', icon: 'exchange-alt', content: `<span>リアルタイム更新で、操作をよりすばやく</span>` }
    ],
  }),
  computed: {
    loggedIn () {
      return this.$store.state.auth.loggedIn 
    },

    user () {
      return this.$store.state.auth.user
    }
  },
  mounted () {
    if (this.loggedIn) {

      if (!socket.ready) {
        socket.init(this.$store.state.token)
      }

      socket.joinUserRoom({ store: this.$store, id: this.user.id})

    }
  },
  methods: {
    authenticate () {
      this.$auth.loginWith('discord')
    }
  }
}
</script>
