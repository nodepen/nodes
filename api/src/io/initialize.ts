import socketIO, { Socket } from 'socket.io'
import { Server } from 'http'
import { serverConfig } from '../store'

export let io = new socketIO.Server()

export const initialize = (server: Server): void => {
  io = new socketIO.Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket: Socket) => {
    console.log(`Connection made! ${socket.id}`)
    socket.on('connect_error', (err) => {
      console.log(err)
    })
    socket.on('disconnect', (reason) => {
      console.log(reason)
    })
    socket.emit('lib', serverConfig)

    socket.on('join_request', (id) => {
      console.log(id)
      socket.join(id)
    })
  })
}
