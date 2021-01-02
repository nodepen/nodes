import { Socket, Server } from 'socket.io'
import { Server as HTTP } from 'http'
import { serverConfig, registerSession, clearSession } from '../store'

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
      clearSession(socket.id)
      console.log(reason)
    })
    socket.emit('lib', serverConfig)

    socket.on('join-session', (id) => {
      socket.join(id)
      registerSession(socket.id, id)

      io.to(id).emit(
        'join-session-handshake',
        `Successfully joined session ${id}`
      )
    })
  })
}
