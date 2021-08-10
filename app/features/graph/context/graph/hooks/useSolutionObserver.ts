import { useEffect, useRef } from 'react'
import { useGraphElements, useGraphSolution } from '@/features/graph/store/graph/hooks'
import { useSessionManager } from '@/features/common/context/session'
import { gql, useSubscription } from '@apollo/client'

export const useSolutionObserver = (): void => {
  const { session } = useSessionManager()

  const elements = useGraphElements()
  const solution = useGraphSolution()

  const currentSolution = useRef<string>('unset')

  useEffect(() => {
    if (!solution.id) {
      return
    }

    if (solution.id === currentSolution.current) {
      return
    }

    console.log('🏃‍♂️🏃‍♂️🏃‍♂️ New solution requested!')
    currentSolution.current = solution.id

    // Clear values

    // Dispatch `requestSolution` query
  }, [solution.id, elements])

  // Subscribe to all solution events for session
  const { data } = useSubscription(
    gql`
      subscription {
        onSolution {
          id
          manifest {
            status
            duration
            runtimeMessages {
              level
              elementId
              message
            }
          }
        }
      }
    `,
    {
      variables: {
        session: session.id,
      },
      skip: !session.id,
      shouldResubscribe: true,
    }
  )

  useEffect(() => {
    const { id } = data.onSolution

    if (id !== currentSolution.current) {
      // We don't care about this solution anymore
      return
    }

    // Apply manifest to graphSlice

    // Fetch all `immediate` values
  }, [data])
}
