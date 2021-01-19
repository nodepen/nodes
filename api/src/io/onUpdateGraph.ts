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

  const start = Date.now()

  console.log(`Solution ${solutionId} dispatched`)

  // Dispatch a solution
  const { data: solution } = await axios.post(
    `http://localhost:8081/grasshopper/solve`,
    ghx
  )

  console.log(`Solution ${solutionId} received in ${Date.now() - start}ms`)

  const solutionBatch = db.multi()
  let valueCount = 0

  solution['Data'].forEach((value: any) => {
    const { ElementId: element, ParameterId: parameter, Values: values } = value

    valueCount = valueCount + values.length

    const result: Glasshopper.Data.DataTree = {}

    values.forEach((branch: any) => {
      const path: number[] = branch['Path']
      const data: { Type: Glasshopper.Data.ValueType; Value: string }[] =
        branch['Data']

      const pathString = `{${path.join(';')}}`

      result[pathString] = data.map(({ Type: type, Value: value }) => {
        switch (type) {
          case 'number': {
            const branchValue: Glasshopper.Data.DataTreeValue<'number'> = {
              from: 'solution',
              type,
              data: Number.parseFloat(value),
            }

            return branchValue
          }
          case 'point': {
            const { X: x, Y: y, Z: z } = JSON.parse(value)

            const branchValue: Glasshopper.Data.DataTreeValue<'point'> = {
              from: 'solution',
              type,
              data: {
                x: Number.parseFloat(x),
                y: Number.parseFloat(y),
                z: Number.parseFloat(z),
              },
            }

            return branchValue
          }
          default: {
            const branchValue: Glasshopper.Data.DataTreeValue<'string'> = {
              from: 'solution',
              type: 'string',
              data: '' + value,
            }

            return branchValue
          }
        }
      })
    })

    const solutionValueKey = `session:${sessionId}:solution:${solutionId}:${element}:${parameter}`

    solutionBatch.set(solutionValueKey, JSON.stringify(result))
  })

  const runtimeMessages: Glasshopper.Payload.SolutionMessage[] = solution[
    'Messages'
  ].map((msg: any) => {
    const { ElementId: element, Message: message } = msg

    const level: any = msg['Level'].toLowerCase()

    const runtimeMessage: Glasshopper.Payload.SolutionMessage = {
      element,
      level,
      message,
    }

    return runtimeMessage
  })

  const solutionReady: Glasshopper.Payload.SolutionReady = {
    solutionId,
    runtimeMessages,
  }

  solutionBatch.exec((err, reply) => {
    console.log(
      `Solution ${solutionId} cached with ${valueCount} values over ${solution['Data'].length} branches`
    )
    setTimeout(() => {
      socket.emit('solution-ready', solutionReady)
    }, 900)
  })
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
