import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { NEW_SOLUTION } from '@/queries'

/**
 *
 * @param target The id of the 'current' solution we care about.
 */
export const useSolutionQuery = (session: string, target: string): void => {
  const [waitingFor, setWaitingFor] = useState(target)

  // const { data, startPolling, stopPolling } = useQuery(NEW_SOLUTION, { variables: {
  //   sessionId: session,
  //   solutionId: target,
  //   graph: JSON.stringify([]),
  // }})

  useEffect(() => {
    if (target === waitingFor) {
      console.log('🐍 Skipping useSolutionQuery become incoming target matches current.')
      return
    }

    setWaitingFor(target)
    console.log(`Beginning polling for solution ${waitingFor}`)
    // startPolling(500)
  }, [target])

  return
}
