import { useState, useEffect } from 'react'
import { useQuery, useApolloClient } from '@apollo/client'
import { NEW_SOLUTION, SOLUTION_STATUS } from '@/queries'

/**
 *
 * @param target The id of the 'current' solution we care about.
 */
export const useSolutionQuery = (session: string, target: string): void => {
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

    client.mutate({
      mutation: NEW_SOLUTION,
      variables: {
        sessionId: session,
        solutionId: target,
        graph: JSON.stringify([]),
      },
    })
  }, [waitingFor])

  useEffect(() => {
    console.log('New solution status polling data:')

    if (!solutionStatus) {
      console.log(undefined)
      return
    }

    console.log(solutionStatus)

    const status = solutionStatus?.getSolutionStatus?.status

    if (status === 'SUCCEEDED' || status === 'FAILED') {
      console.log(`Done waiting for solution ${waitingFor}`)

      // Handle success or failure here!

      stopPolling()
    }
  }, [solutionStatus])

  return
}
