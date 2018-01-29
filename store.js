import { Store } from 'svelte/store.js'

class WebSocketStore extends Store {
  getSocket () {
    if (this.socket && this.socket.readyState !== 3) return this.socket

    return new Promise((resolve, _reject) => {
      this.socket = new window.WebSocket(`wss://${document.location.host}`)

      this.socket.onopen = () => {
        console.log('socket:onopen')
        this.set({ connected: true })
        resolve(this.socket)
      }

      this.socket.onclose = () => {
        console.log('socket:close')
        this.set({ connected: false })
      }

      this.socket.onmessage = (event) => {
        console.log('socket:onmessage', event.data)
        const { channels, messages, subscribedChannel, name } = JSON.parse(event.data)
        this.set({ channels, messages, subscribedChannel, name })
      }
    })
  }

  initialize () {
    return this.getSocket()
  }

  async subscribe (channel) {
    const socket = await this.getSocket()
    socket.send(JSON.stringify({ action: 'subscribe', channel }))
  }

  async sendMessage (message) {
    const { subscribedChannel: channel, name } = this.get()
    const socket = await this.getSocket()
    socket.send(JSON.stringify({ action: 'sendMessage', name, channel, message }))
  }

  async createChannel (channel) {
    const socket = await this.getSocket()
    socket.send(JSON.stringify({ action: 'createChannel', channel }))
  }

  async setName (name) {
    const socket = await this.getSocket()
    socket.send(JSON.stringify({ action: 'setName', name }))
  }
}

export default new WebSocketStore({
  connected: false,
  channels: [],
  messages: null,
  subscribedChannel: null,
  name: 'Anon',
  layout: {
    drawerOpen: false,
  },
})
