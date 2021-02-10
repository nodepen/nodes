import React, { useEffect, useReducer, useState } from 'react'
import { context as Context, initial, reducer } from './state'
import { useGraphManager } from '@/context/graph'
import { useSessionManager } from '@/context/session'
import { useQuery } from '@apollo/client'
import { GRAPH_JSON } from '~/queries'

type SceneManagerProps = {
  children?: React.ReactNode
}

export const SceneManager = ({ children }: SceneManagerProps): React.ReactElement => {
  const { session } = useSessionManager()
  const { dispatch: graphManager } = useGraphManager()

  const [store, dispatch] = useReducer(reducer, initial)

  const [stagedSolutionId, setStagedSolutionId] = useState<string | undefined>()

  const onStorageChange = (e: StorageEvent): void => {
    if (e.key === 'gh:selection') {
      const selection = JSON.parse(e.newValue)
      dispatch({ type: 'selection/set', selection })
    }

    if (e.key === 'np:solutionId') {
      setStagedSolutionId(e.newValue)
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

  const [graphIsCurrent, setGraphIsCurrent] = useState(true)

  const { data: graph, startPolling, stopPolling } = useQuery(GRAPH_JSON, {
    variables: { sessionId: session.id ?? 'invalid', solutionId: stagedSolutionId },
  })

  useEffect(() => {
    console.log(`🔔 Detected new solution: ${stagedSolutionId}`)
    setGraphIsCurrent(false)
  }, [stagedSolutionId])

  useEffect(() => {
    // Respond to graph changes
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
