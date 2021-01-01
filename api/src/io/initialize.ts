import { Socket, Server } from 'socket.io'
import { Server as HTTP } from 'http'
import { serverConfig } from '../store'

export let io = new Server()

export const initialize = (server: HTTP): void => {
  io = new Server(server, {
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
      io.to(id).emit('handshake', 'howdy from io')
    })
  })
}
