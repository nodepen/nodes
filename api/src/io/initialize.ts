import socketIO from 'socket.io'
import { Server } from 'http'
import { serverConfig } from '../store'

export let io = socketIO()

export const initialize = (server: Server): void => {
  io = socketIO(server)

  io.on('connect', (socket) => {
    socket.emit('lib', serverConfig)
  })
}
