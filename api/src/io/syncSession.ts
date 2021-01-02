import { io } from './initialize'
import { db } from '../db'

export const syncSession = (sessionId: string): void => {
  const key = `session:${sessionId}:graph-gl`

  db.get(key, (err, graph) => {
    if (graph) {
      io.to(sessionId).emit('restore-session', graph)
    }
  })
}
