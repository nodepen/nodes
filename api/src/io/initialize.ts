import { Server } from 'http'
import socketIO from 'socket.io'

export let io = socketIO()

export const initialize = (server: Server): void => {
  io = socketIO(server)

  io.on('connect', () => {
    console.log('Connection!')
  })
}
