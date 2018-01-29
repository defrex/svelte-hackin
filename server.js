const express = require('express')
const compression = require('compression')
const http = require('http')
const sapper = require('sapper')
const serveStatic = require('serve-static')
const WebSocket = require('ws')

const webSocetHandler = require('./websocket')

const { PORT = 3000 } = process.env

// this allows us to do e.g. `fetch('/api/blog')` on the server
const fetch = require('node-fetch')
global.fetch = (url, opts) => {
  if (url[0] === '/') url = `http://localhost:${PORT}${url}`
  return fetch(url, opts)
}

const app = express()
app.use(compression({ threshold: 0 }))
app.use(serveStatic('assets'))
app.use(sapper())

const server = http.createServer(app)

new WebSocket.Server({ server }).on('connection', webSocetHandler)

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
