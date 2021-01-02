import { Socket } from 'socket.io'
import { sessions } from '../store'
import { db } from '../db'

export const onJoinSession = (socket: Socket, id: string): void => {
  sessions[socket.id] = id

  socket.join(id)

  socket.emit('join-session-handshake', `Successfully joined session ${id}`)

  const key = `session:${id}:graph-gl`

  db.get(key, (err, graph) => {
    socket.emit('restore-session', graph ?? 'none')
  })
}
