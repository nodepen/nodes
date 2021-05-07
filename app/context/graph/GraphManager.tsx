import React, { useEffect, useReducer } from 'react'
import { Grasshopper, Glasshopper } from 'glib'
import { context as Context, reducer, initial } from './state'
import { useSessionManager } from '~/context/session'
import { useQuery, useApolloClient } from '@apollo/client'
import { COMPUTE_CONFIGURATION, SESSION_CURRENT_GRAPH, SOLUTION_MESSAGES, SOLUTION_VALUE } from '@/queries'
import { useSolutionQuery } from './hooks'

type GraphManagerProps = {
  children?: React.ReactNode
  config?: Grasshopper.Component[]
}

export const GraphManager = ({ children, config }: GraphManagerProps): React.ReactElement => {
  const { session, user, error } = useSessionManager()
  const client = useApolloClient()

  const [store, dispatch] = useReducer(reducer, initial)

  const { data } = useQuery(COMPUTE_CONFIGURATION, {})

  useEffect(() => {
    if (store.preflight.getLibrary) {
      console.log('🐍 Ignoring change in config query because library has already been loaded.')
      return
    }

    if (data || config) {
      dispatch({ type: 'session/load-components', components: data?.getComputeConfiguration ?? config })
    }
  }, [data, config])

  const { status } = useSolutionQuery(session.id, store.solution.id, store)

  useEffect(() => {
    if (!session.id) {
      // No session yet, do no work
      console.log('⌚ Not restoring session yet because no id exists.')
      return
    }

    if (Object.keys(store.elements).length > 0) {
      console.log('🐍 Ignoring new session id because we have already restored it once.')
      return
    }

    const getCurrentGraph = async (sessionId: string): Promise<string> => {
      const { data } = await client.query({
        query: SESSION_CURRENT_GRAPH,
        variables: {
          sessionId: sessionId,
        },
      })

      const elements = data.getSessionCurrentGraph

      return elements
    }

    // Restore graph
    console.log(`Restoring session for session:${session.id}`)
    getCurrentGraph(session.id).then((elements) => {
      dispatch({ type: 'session/restore-session', elements })
    })
  }, [session.id])

  useEffect(() => {
    if (!store.solution.id || !session.id) {
      return
    }

    const fetchSolutionMessages = async (
      session: string,
      solution: string
    ): Promise<Glasshopper.Payload.SolutionMessage[]> => {
      const { data } = await client.query({
        query: SOLUTION_MESSAGES,
        variables: {
          sessionId: session,
          solutionId: solution,
        },
      })

      const messages: any[] = JSON.parse(data.getSolutionMessages)

      const result: Glasshopper.Payload.SolutionMessage[] = messages.map(({ elementId, message, level }) => ({
        element: elementId,
        message,
        level: level.toLowerCase(),
      }))

      return result
    }

    const fetchSolutionValue = async (
      session: string,
      solution: string,
      element: string,
      parameter: string
    ): Promise<Glasshopper.Payload.SolutionValue> => {
      const { data } = await client.query({
        query: SOLUTION_VALUE,
        variables: {
          sessionId: session,
          solutionId: solution,
          elementId: element,
          parameterId: parameter,
        },
      })

      const tree: Glasshopper.Data.DataTree = JSON.parse(data.getSolutionValue.data)

      return {
        for: {
          solution,
          element,
          parameter,
        },
        data: tree,
      }
    }

    console.log({ status })

    if (status === 'SUCCEEDED') {
      fetchSolutionMessages(session.id, store.solution.id)
        .then((messages) => {
          // Store messages
          dispatch({ type: 'graph/values/consume-solution-messages', messages })

          // Collect all value requests that need to happen
          const requests: { session: string; solution: string; element: string; parameter: string }[] = []

          Object.values(store.elements).forEach((element) => {
            switch (element.template.type) {
              case 'static-parameter': {
                requests.push({
                  session: session.id,
                  solution: store.solution.id,
                  element: element.id,
                  parameter: 'output',
                })
                break
              }
              case 'static-component': {
                const component = element as Glasshopper.Element.StaticComponent

                ;[...Object.keys(component.current.inputs), ...Object.keys(component.current.outputs)].forEach(
                  (parameterId) => {
                    requests.push({
                      session: session.id,
                      solution: store.solution.id,
                      element: element.id,
                      parameter: parameterId,
                    })
                  }
                )
                break
              }
              case 'number-slider': {
                requests.push({
                  session: session.id,
                  solution: store.solution.id,
                  element: element.id,
                  parameter: 'output',
                })
                break
              }
            }
          })

          return Promise.allSettled(
            requests.map((r) => fetchSolutionValue(r.session, r.solution, r.element, r.parameter))
          )
        })
        .then((values) => {
          const resolved: PromiseFulfilledResult<Glasshopper.Payload.SolutionValue>[] = []
          const rejected: PromiseRejectedResult[] = []

          values.forEach((value) => {
            switch (value.status) {
              case 'fulfilled': {
                resolved.push(value)
                break
              }
              case 'rejected': {
                rejected.push(value)
                break
              }
            }
          })

          dispatch({ type: 'graph/values/consume-solution-values', values: resolved.map(({ value }) => value) })

          rejected.forEach(({ reason }) => {
            console.error(reason)
          })
        })
    }

    if (status === 'FAILED') {
      console.error('Compute failed to execute solution!')
    }

    if (status === 'TIMEOUT') {
      console.error('Solution timed out!')
    }
  }, [status])

  useEffect(() => {
    if (store.ready) {
      return
    }

    if (!Object.values(store.preflight).some((done) => !done)) {
      dispatch({ type: 'session/set-ready' })
      dispatch({ type: 'session/expire-solution' })
    }
  })

  const manager = { store, dispatch }

  return <Context.Provider value={manager}>{children}</Context.Provider>
}
