import { useState, useEffect } from 'react'
import { useQuery, useApolloClient } from '@apollo/client'
import { NEW_SOLUTION, SOLUTION_STATUS } from '@/queries'
import { GraphStore } from '../types'

type SolutionInfo = {
  status: 'WAITING' | 'SUCCEEDED' | 'FAILED' | 'TIMEOUT'
  duration: number
}

/**
 *
 * @param target The id of the 'current' solution we care about.
 */
export const useSolutionQuery = (session: string, target: string, store: GraphStore): SolutionInfo => {
  const [waitingFor, setWaitingFor] = useState(target)

  const client = useApolloClient()

  const { data: solutionStatus, startPolling, stopPolling } = useQuery(SOLUTION_STATUS, {
    variables: {
      sessionId: session,
      solutionId: waitingFor,
    },
  })

  useEffect(() => {
    if (target === waitingFor) {
      console.log('🐍 Skipping useSolutionQuery because incoming target matches current.')
      return
    }

    setWaitingFor(target)
    console.log(`Beginning polling for solution ${target}`)
    startPolling(500)
  }, [target])

  useEffect(() => {
    console.log('Value of `waitingFor` changed, triggering new solution.')

    if (!session || !target) {
      return
    }

    if (store.config.executionMode == 'paused') {
      console.log('Blocking new solution because execution is paused.')
      return
    }

    client.mutate({
      mutation: NEW_SOLUTION,
      variables: {
        sessionId: session,
        solutionId: target,
        graph: JSON.stringify(store.elements),
      },
    })
  }, [waitingFor])

  useEffect(() => {
    if (!solutionStatus) {
      console.log(undefined)
      return
    }

    const status = solutionStatus?.getSolutionStatus?.status

    if (status === 'SUCCEEDED' || status === 'FAILED') {
      stopPolling()
    }
  }, [solutionStatus])

  return {
    status: solutionStatus?.getSolutionStatus?.status.toUpperCase() ?? 'WAITING',
    duration: solutionStatus?.getSolutionStatus?.duration ?? 0,
  }
}
