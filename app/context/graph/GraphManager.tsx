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
    console.log('setting up manager')
    io.on('lib', (res: Grasshopper.Component[]) => {
      setTimeout(() => {
        dispatch({ type: 'lib/load-components', components: res })
      }, 500);
    })
  }

  useEffect(onLoad, [])

  const doSomething = useCallback((): void => {
    dispatch({ type: 'demo' })
    io.emit('message', 'doSomething from manager')
  }, [])

  const manager = { store, dispatch: { doSomething } }

  return <Context.Provider value={manager}>{children}</Context.Provider>
}