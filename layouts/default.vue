<template>
  <div>
    <nav
      class="navbar header has-shadow is-primary"
      role="navigation"
      aria-label="main navigation">
      <div class="navbar-brand">

        <a
          class="navbar-item has-text-weight-semibold"
          href="/">
          <p>Discord Thread</p>
        </a>

        <div class="navbar-burger">
          <span/>
          <span/>
          <span/>
        </div>
      </div>
      <div class="navbar-menu">
        <div class="navbar-end">
          <div class="navbar-item">
            <div class="field is-grouped">
              <p class="control">
                <a
                  v-if="loggedIn"
                  class="button is-white"
                  @click="logout">
                  <span class="icon">
                    <i class="fab fa-discord is-medium fa-lg"/>
                  </span>
                  <span>Sign out</span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <section class="main-content columns">
      <aside class="column is-2 section">
        <p
          class="menu-label is-hidden-touch"
          style="font-size:16px; letter-spacing:1px;">General</p>
        <ul class="menu-list">
          <li
            v-for="(item, key) of items"
            :key="key">
            <nuxt-link
              :to="item.to"
              exact-active-class="is-active">
              <b-icon
                :pack="item.pack"
                :icon="item.icon"
                size="is-small"/>
              <span class="is-uppercase has-text-weight-semibold">{{ item.title }}</span>
            </nuxt-link>
          </li>
        </ul>
      </aside>

      <div class="container column is-10">
        <nuxt />
      </div>

    </section>
  </div>
</template>

<script>
let socket = null

if (process.browser) {
  socket = require('~/lib/socket').socket
}

export default {
  data: () => ({
      items: [
        { title: 'Home', pack: 'fas', icon: 'home', to: { name: 'index' } },
        { title: 'Threads', pack: 'fas', icon: 'comment-alt', to: { name: 'threads' } }
      ]
  }),
  computed: {
    loggedIn () {
      return this.$auth.loggedIn 
    },
  },
  mounted () {
    if (this.loggedIn) {
      console.log('init socket')
      socket.init(this.$store.state.token)
    }
  },
  methods: {
    async logout () {
      await this.$auth.logout()
    }
  }
}
</script>
