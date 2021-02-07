import React, { useEffect, useReducer } from 'react'
import { Grasshopper, Glasshopper } from 'glib'
import { context as Context, reducer, initial } from './state'
import { useSessionManager } from '~/context/session'
import { useQuery, useApolloClient } from '@apollo/client'
import { COMPUTE_CONFIGURATION, SESSION_CURRENT_GRAPH } from '@/queries'
import { useSolutionQuery } from './hooks'

type GraphManagerProps = {
  children?: React.ReactNode
}

export const GraphManager = ({ children }: GraphManagerProps): React.ReactElement => {
  const { session, user } = useSessionManager()
  const client = useApolloClient()

  const [store, dispatch] = useReducer(reducer, initial)

  const { data: config } = useQuery(COMPUTE_CONFIGURATION)

  useEffect(() => {
    if (store.preflight.getLibrary) {
      console.log('🐍 Ignoring change in config query because library has already been loaded.')
      return
    }

    if (config) {
      dispatch({ type: 'session/load-components', components: config.getComputeConfiguration })
    }
  }, [config])

  useSolutionQuery(session.id, store.solution.id)

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

    const getCurrentGraph = async (sessionId: string): Promise<Glasshopper.Element.Base[]> => {
      const { data } = await client.query({
        query: SESSION_CURRENT_GRAPH,
        variables: {
          sessionId: sessionId,
        },
      })

      const elements = JSON.parse(data.getSessionCurrentGraph)

      return elements
    }

    // Restore graph
    console.log(`Restoring session for session:${session.id}`)
    getCurrentGraph(session.id).then((elements) => {
      dispatch({ type: 'session/restore-session', elements })
    })
  }, [session.id])

  const onLoad = (): void => {
    // dispatch({ type: 'session/register-socket', socket: io, id })
    // io.on('lib', (res: Grasshopper.Component[]) => {
    //   dispatch({ type: 'session/load-components', components: res })
    // })
    // io.on('restore-session', (res: string) => {
    //   dispatch({ type: 'session/restore-session', elements: res })
    // })
    // io.on('solution-start', (res: string) => {
    //   dispatch({ type: 'graph/values/expire-solution', newSolutionId: res })
    // })
    // io.on('solution-ready', (res: Glasshopper.Payload.SolutionReady) => {
    //   dispatch({ type: 'graph/values/prepare-solution', status: res })
    // })
    // io.on('solution-values', (values: Glasshopper.Payload.SolutionValue[]) => {
    //   dispatch({ type: 'graph/values/consume-solution-values', values })
    // })
    // io.on('solution-failed', (res: any) => {
    //   console.error(`Failed to run solution!`)
    //   console.error(res)
    // })
  }

  useEffect(onLoad, [])

  // useEffect(() => {
  //   if (store.ready) {
  //     return
  //   }

  //   if (!Object.values(store.preflight).some((done) => !done)) {
  //     dispatch({ type: 'session/set-ready' })
  //   }
  // })

  const manager = { store, dispatch }

  return <Context.Provider value={manager}>{children}</Context.Provider>
}
