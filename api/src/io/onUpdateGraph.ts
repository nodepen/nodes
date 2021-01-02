import { Socket } from 'socket.io'
import { sessions } from '../store'
import { db } from '../db'

export const onUpdateGraph = (socket: Socket, graph: string): void => {
  const { id } = socket
  const sessionId = sessions[id]

  const key = `session:${sessionId}:graph-gl`

  db.set(key, graph, () => {
    console.log(`Updated graph for session ${sessionId}`)
  })
}
