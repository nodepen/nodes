import { Socket } from 'socket.io'
import axios from 'axios'
import { Glasshopper } from 'glib'
import { sessions } from '../store'
import { db } from '../db'
import { syncSession } from './syncSession'

export const onUpdateGraph = async (
  socket: Socket,
  graph: string
): Promise<void> => {
  const { id } = socket
  const sessionId = sessions[id]

  const jsonKey = `session:${sessionId}:graph-gl`

  db.set(jsonKey, graph, () => {
    console.log(`Updated graph json for session ${sessionId}`)
    // syncSession(sessionId)
  })

  // Begin new solution
  const solutionId = newGuid()

  socket.emit('solution-start', solutionId)

  // Generate new graph
  const ghxKey = `session:${sessionId}:graph-ghx`

  const elements = Object.values(JSON.parse(graph)).filter(
    (el: Glasshopper.Element.Base) =>
      el.template.type === 'static-component' ||
      el.template.type === 'static-parameter'
  )

  const { data: ghx } = await axios.post(
    `http://localhost:8081/grasshopper/graph`,
    elements
  )

  db.set(ghxKey, ghx, () => {
    console.log(`Updated graph ghx for session ${sessionId}`)
  })

  const now = Date.now()

  console.log(`Dispatched solution ${solutionId}`)

  // Dispatch a solution
  const { data: solution } = await axios.post(
    `http://localhost:8081/grasshopper/solve`,
    ghx
  )

  console.log(`Solution ${solutionId} complete in ${Date.now() - now}ms.`)

  socket.emit('solution-ready', solution)
}

// Snippet shared by StackOverflow user Fenton
// https://stackoverflow.com/questions/26501688/a-typescript-guid-class

const newGuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
