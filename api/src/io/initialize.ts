import { Socket, Server } from 'socket.io'
import { Server as HTTP } from 'http'
import { serverConfig, registerSession, clearSession } from '../store'
import { onJoinSession } from './onJoinSession'
import { onUpdateGraph } from './onUpdateGraph'
import { onRequestSolutionValues } from './onRequestSolutionValues'
import { Glasshopper } from 'glib'

export let io = new Server()

export const initialize = (server: HTTP): void => {
  io = new Server(server, {
    cors: {
      origin: ['http://localhost:3000', 'https://glasshopper.io'],
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

    socket.on('join-session', (id: string) => {
      onJoinSession(socket, id)
    })

    socket.on('update-graph', (graph: string) => {
      onUpdateGraph(socket, graph).catch((err) => {
        socket.emit('solution-failed', err)
      })
    })

    socket.on(
      'solution-values',
      (request: Glasshopper.Payload.SolutionValueRequest[]) => {
        onRequestSolutionValues(socket, request)
      }
    )
  })
}
