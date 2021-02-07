import React, { useEffect, useReducer } from 'react'
import { Grasshopper, Glasshopper } from 'glib'
import { context as Context, reducer, initial } from './state'
import { useSessionManager } from '~/context/session'
import { useQuery } from '@apollo/client'
import { COMPUTE_CONFIGURATION } from '@/queries'

type GraphManagerProps = {
  children?: React.ReactNode
}

export const GraphManager = ({ children }: GraphManagerProps): React.ReactElement => {
  const { session, user } = useSessionManager()

  const [store, dispatch] = useReducer(reducer, initial)

  const { data: config } = useQuery<Grasshopper.Component[]>(COMPUTE_CONFIGURATION)

  useEffect(() => {
    if (store.preflight.getLibrary) {
      console.log('🐍 Ignoring change in config query because library has already been loaded.')
      return
    }

    if (config) {
      dispatch({ type: 'session/load-components', components: config })
    }
  }, [config])

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

  useEffect(() => {
    if (store.ready) {
      return
    }

    if (!Object.values(store.preflight).some((done) => !done)) {
      dispatch({ type: 'session/set-ready' })
    }
  })

  const manager = { store, dispatch }

  return <Context.Provider value={manager}>{children}</Context.Provider>
}
