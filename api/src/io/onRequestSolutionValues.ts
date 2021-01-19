import { Socket } from 'socket.io'
import { Glasshopper } from 'glib'
import { sessions } from '../store'
import { db } from '../db'

export const onRequestSolutionValues = (
  socket: Socket,
  requests: Glasshopper.Payload.SolutionValueRequest[]
): void => {
  const { id } = socket
  const sessionId = sessions[id]

  const solutionsBatch = db.multi()

  requests.forEach((req) => {
    const { solutionId, elementId, parameterId } = req

    const solutionKey = `session:${sessionId}:solution:${solutionId}:${elementId}:${parameterId}`

    db.get(solutionKey)
  })

  solutionsBatch.exec((err, reply) => {
    socket.emit('solution-values', reply)
  })
}
