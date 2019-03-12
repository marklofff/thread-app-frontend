import { Socket } from '~/lib/phoenix'

let _socket

export const socket = {
  rooms: [],
  ready: false,

  init: (token) => {
    _socket = new Socket('/socket', {
      params: {token: token}
    })

    if(_socket.connect()) {
      socket.ready = true
    }
  },

  joinUserRoom: ({ store, id }) => {
    let channel = _socket.channel(`user:${id}`, {})

    for (let i = 0; i < socket.rooms.length; i++) {
      if (socket.rooms[i].topic === channel.topic) {
        return socket.rooms[i]
      }
    }

    socket.rooms.push(channel)

    channel.join()
      .receive('ok', _ => {
        console.log(`Joined Notificationm room: ${id}`)
      })

    channel.on('thread:new', data => {
      store.commit('ADD_THREAD', data.thread)
    })

    return channel
  },

  joinRoom: ({ store, id }) => {
    let roomChannel = _socket.channel(`room:${id}`, {})

    for (let i = 0; i < socket.rooms.length; i++) {
      if (socket.rooms[i].topic === roomChannel.topic) {
        return socket.rooms[i]
      }
    }

    socket.rooms.push(roomChannel)

    roomChannel.join()
      .receive('ok', _ => { console.log(`Joined room: ${id}`)  })

    roomChannel.on('message:new', message => {
      store.commit('ADD_POST', message)
    })

    roomChannel.on('thread:new', thread => {
      store.commit('ADD_THREAD', thread)
    })

    roomChannel.on('user:delete_notification', _ => {
      store.dispatch('getNotifications')
    })

    return roomChannel
  }
}
