import React, { useEffect, useReducer, useState } from 'react'
import { context as Context, initial, reducer } from './state'
import { useGraphManager } from '@/context/graph'
import { useSessionManager } from '@/context/session'
import { useQuery } from '@apollo/client'
import { SESSION_CURRENT_SOLUTION, GRAPH_JSON } from '~/queries'

type SceneManagerProps = {
  children?: React.ReactNode
}

export const SceneManager = ({ children }: SceneManagerProps): React.ReactElement => {
  const { session } = useSessionManager()
  const { dispatch: graphManager } = useGraphManager()

  const [store, dispatch] = useReducer(reducer, initial)

  const onStorageChange = (e: StorageEvent): void => {
    if (e.key === 'gh:selection') {
      const selection = JSON.parse(e.newValue)
      dispatch({ type: 'selection/set', selection })
    }
  }

  useEffect(() => {
    window.addEventListener('storage', onStorageChange)

    return () => {
      window.removeEventListener('storage', onStorageChange)
    }
  })

  useEffect(() => {
    // Puase execution on load
    graphManager({ type: 'graph/config/set-execution-mode', mode: 'paused' })
  }, [])

  const [stagedSolutionId, setStagedSolutionId] = useState<string | undefined>()
  const [graphIsCurrent, setGraphIsCurrent] = useState(true)

  const { data } = useQuery(SESSION_CURRENT_SOLUTION, { variables: { id: session.id }, pollInterval: 1000 })
  const { data: graph, startPolling, stopPolling } = useQuery(GRAPH_JSON, {
    variables: { sessionId: session.id, solutionId: stagedSolutionId },
  })

  useEffect(() => {
    if (!data) {
      return
    }

    const incoming = data.getSession.current

    if (incoming && incoming !== session.id) {
      console.log(`🔔 Detected new solution: ${incoming}`)

      setStagedSolutionId(incoming)
      setGraphIsCurrent(false)
    }
  }, [data])

  useEffect(() => {
    // Response to graph changes
    if (!graph) {
      return
    }

    // Update local copy of graph
    graphManager({ type: 'session/restore-session', elements: graph.getGraphJson })
    setGraphIsCurrent(true)
  }, [graph])

  useEffect(() => {
    if (graphIsCurrent) {
      console.log(`🔔 Graph is now current!`)
      graphManager({ type: 'session/declare-solution', id: stagedSolutionId })
      stopPolling()
    } else {
      console.log(`🔔 Graph is not current!`)
      startPolling(500)
    }
  }, [graphIsCurrent])

  const value = { store, dispatch }

  return <Context.Provider value={value}>{children}</Context.Provider>
}
