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

  const start = Date.now()
  console.log(`Received request for ${requests.length} solutions`)

  const solutionsBatch = db.multi()

  requests.forEach((req) => {
    const { solutionId, elementId, parameterId } = req

    const solutionKey = `session:${sessionId}:solution:${solutionId}:${elementId}:${parameterId}`
    // console.log(`> ${solutionKey}`)

    solutionsBatch.get(solutionKey)
  })

  solutionsBatch.exec((err, reply: string[]) => {
    const solutions: Glasshopper.Payload.SolutionValue[] = reply.map(
      (data, i) => {
        const { solutionId, elementId, parameterId } = requests[i]

        const solution: Glasshopper.Payload.SolutionValue = {
          for: {
            solution: solutionId,
            element: elementId,
            parameter: parameterId,
          },
          data: JSON.parse(data),
        }

        return solution
      }
    )

    console.log(
      `Returned ${solutions.length} solutions in ${Date.now() - start}ms`
    )

    socket.emit('solution-values', solutions)
  })
}
