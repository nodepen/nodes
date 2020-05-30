import http from 'http'

import express from 'express'
import SocketIO from 'socket.io'
import consola from 'consola'
import { Nuxt, Builder } from 'nuxt'

// Import and Set Nuxt.js options
import config from '../nuxt.config'
// const config = require('../nuxt.config.js')

import { rootSocket } from './io/socket'
;(config as any).dev = process.env.NODE_ENV !== 'production'

const app = express()
const server = http.createServer(app)
const io = SocketIO(server)

// const express = require('express')
// const consola = require('consola')
// const { Nuxt, Builder } = require('nuxt')
// const app = express()

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if ((config as any).dev) {
    const builder = new Builder(nuxt)
    // await builder.build()
    builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  server.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

io.on('connection', rootSocket)

start()
