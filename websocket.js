const uuid4 = require('uuid/v4')

let DATA = {}
let CONNECTIONS = {}

module.exports = function (ws, _req) {
  let subscribedChannel = null
  let currentName = 'Anon'
  let connectionId = uuid4()

  function sendUpdate () {
    ws.send(JSON.stringify({
      channels: Object.keys(DATA),
      messages: subscribedChannel ? DATA[subscribedChannel] : null,
      name: currentName,
      subscribedChannel,
    }))
  }
  CONNECTIONS[connectionId] = sendUpdate

  ws.on('message', (data) => {
    console.log('received: %s', data)
    const { action, channel, message, name } = JSON.parse(data)

    if (action === 'sendMessage') {
      DATA = {
        ...DATA,
        [channel]: [
          ...(DATA[channel] || []),
          { message, name },
        ],
      }
      Object.values(CONNECTIONS).map((update) => update())

    } else if (action === 'createChannel') {
      if (!DATA[channel]) {
        DATA = {
          ...DATA,
          [channel]: [],
        }
      }
      Object.values(CONNECTIONS).map((update) => update())

    } else if (action === 'subscribe') {
      subscribedChannel = channel
      sendUpdate()

    } else if (action === 'setName') {
      currentName = name
      sendUpdate()

    }
  })

  ws.on('close', () => {
    delete CONNECTIONS[connectionId]
  })

  sendUpdate()
}
