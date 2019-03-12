import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      token: null,
      threads: [],
      thread: null,
      pagination: null
    }),
    mutations: {
      SET_TOKEN: (state, token) => {
        state.token = token
      },

      SET_THREADS: (state, threads) => {
        state.threads = threads.data
        state.pagination = threads.pagination
      },

      SET_THREAD: (state, thread) => {
        state.thread = thread
      },

      ADD_THREAD: (state, thread) => {
        state.threads.push(thread)
      },

      DELETE_THREAD: (state, id) => {
        for (let i = 0; i < state.threads.length; i++) {
          if (state.threads[i]['id'] === id) {
            state.threads.splice(i, 1)
            break
          } 
        }
      },

      CLOSE_THREAD: (state, id) => {
        for (let i = 0; i < state.threads.length; i++) {
          if (state.threads[i]['id'] === id) {
            state.threads[i].closed = true
            break
          } 
        }
      },

      REOPEN_THREAD: (state, id) => {
        for (let i = 0; i < state.threads.length; i++) {
          if (state.threads[i]['id'] === id) {
            state.threads[i].closed = false
            break
          } 
        }
      },

      UPDATE_THREAD: (state, thread) => {
        for (let i = 0; i < state.threads.length; i++) {
          if (state.threads[i]['id'] === thread.id) {
            state.threads[i] = thread
            break
          } 
        }
      },

      ADD_POST: (state, message) => {
        state.thread.posts.push(message.post)
      },
    },
    actions: {
      async nuxtServerInit ({ state, dispatch }, { req, app: { $auth } }) {
        if (process.browser) {
          this.$axios.defaults.baseURL = process.env.frontendApiUrl
        } else {
          this.$axios.defaults.baseURL = process.env.API_URL
        }

        if ($auth.loggedIn && !state.token) {
          await $auth.fetchUser()
          await dispatch('fetchToken')

          this.$axios.defaults.headers.common.authorization = `Bearer ${state.token}`
        }
      },

      fetchToken ({ state, commit }) {
        let { user } = state.auth

        return this.$axios.post('/api/token', { user })
          .then((res) => {
            if (res.data.token) {
              commit('SET_TOKEN', res.data.token)
            }
          }).catch(error => {
            console.log(error)
          })
      },

      fetchThreads ({ state, commit }, params) {

        return this.$axios.get('/api/threads', { params })
          .then((res) => {
            commit('SET_THREADS', res.data)
          }).catch(error => {
            console.log(error)
          })
      },

      fetchThreadById ({ commit }, id) {
        return this.$axios.get(`/api/threads/${id}`)
          .then((res) => {
            commit('SET_THREAD', res.data.data)
          }).catch(error => {
            console.log(error)
          })
      },

      deleteThread({ commit }, id) {
        return this.$axios.delete(`/api/threads/${id}`)
          .then(() => {
            commit('DELETE_THREAD', id)
          })
      },

      updateThread({ commit }, thread) {
        return this.$axios.patch(`/api/threads/${thread.id}`, {
            thread: {
              title: thread.title,
              type: thread.type
            }
          })
          .then(() => {
            commit('UPDATE_THREAD', thread)
          })
      },

      closeThread({ commit }, id) {
        return this.$axios.post(`/api/threads/close/${id}`)
          .then(() => {
            commit('CLOSE_THREAD', id)
          })
      },

      reopenThread({ commit }, id) {
        return this.$axios.post(`/api/threads/reopen/${id}`)
          .then(() => {
            commit('REOPEN_THREAD', id)
          })
      }
    }
  })
}

export default createStore
