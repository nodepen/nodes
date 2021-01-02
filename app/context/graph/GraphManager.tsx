import React, { useEffect, useCallback, useReducer } from 'react'
import { Grasshopper } from 'glib'
import { context as Context, reducer, initial } from './state'
import { GraphStore } from './types'
import { useSessionManager } from '~/context/session'

type GraphManagerProps = {
  children?: React.ReactNode
}

export const GraphManager = ({ children }: GraphManagerProps): React.ReactElement => {
  const { io, id } = useSessionManager()

  const [store, dispatch] = useReducer(reducer, initial)

  const onLoad = (): void => {
    dispatch({ type: 'io/register-socket', socket: io, id })

    io.on('lib', (res: Grasshopper.Component[]) => {
      setTimeout(() => {
        if (!store.ready) {
          dispatch({ type: 'lib/load-components', components: res })
        }
      }, 500);
    })
  }

  useEffect(onLoad, [])

  const manager = { store, dispatch }

  return <Context.Provider value={manager}>{children}</Context.Provider>
}