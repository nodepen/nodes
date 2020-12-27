import express from 'express'
import { Server } from 'http'
import { setup } from './routes'
import { configure } from './startup'
import { serverConfig } from './store'
import * as db from './db'
import * as io from './io'

const PORT = process.env.PORT || 3100

const router = express().set('port', PORT)
const server = new Server(router)

db.initialize()
io.initialize(server)

setup(router)

configure().then(() => {
  server.listen(PORT)
  console.log(
    `Server started with ${serverConfig.length} available components.`
  )
})
