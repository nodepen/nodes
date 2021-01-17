import React, { useEffect, useReducer } from 'react'
import { Grasshopper, Glasshopper } from 'glib'
import { context as Context, reducer, initial } from './state'
import { useSessionManager } from '~/context/session'

type GraphManagerProps = {
  children?: React.ReactNode
}

export const GraphManager = ({ children }: GraphManagerProps): React.ReactElement => {
  const { io, id } = useSessionManager()

  const [store, dispatch] = useReducer(reducer, initial)

  const onLoad = (): void => {
    dispatch({ type: 'session/register-socket', socket: io, id })

    io.on('lib', (res: Grasshopper.Component[]) => {
      dispatch({ type: 'session/load-components', components: res })
    })

    io.on('restore-session', (res: string) => {
      dispatch({ type: 'session/restore-session', elements: res })
    })

    io.on('solution-start', (res: string) => {
      dispatch({ type: 'graph/values/expire-solution', newSolutionId: res })
    })

    io.on('solution-ready', (res: string) => {
      console.log(res)
    })
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
