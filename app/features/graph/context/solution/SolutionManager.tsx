import React, { useEffect } from 'react'
import { useSubscription, gql, useApolloClient } from '@apollo/client'
import { useGraphSolution } from '../../store/graph/hooks'
import { useSolutionDispatch } from '../../store/solution/hooks'
import { useSessionManager } from '@/features/common/context/session'

type SolutionManagerProps = {
  children?: JSX.Element
}

/**
 * Watch for changes in graphSlice.solution.id
 * Expire solutionSlice in response to changes
 * Schedule solution
 * Consume initial results
 * @param param0
 * @returns
 */
export const SolutionManager = ({ children }: SolutionManagerProps): React.ReactElement => {
  const { isAuthenticated } = useSessionManager()

  const client = useApolloClient()

  const solution = useGraphSolution()

  const { expireSolution } = useSolutionDispatch()

  useEffect(() => {
    const solutionId = solution.id

    if (!solutionId) {
      return
    }

    console.log(`New solution: ${solutionId}`)

    expireSolution(solutionId)

    client
      .mutate({
        mutation: gql`
          mutation ScheduleSolutionFromManager($context: ScheduleSolutionInput!) {
            scheduleSolution(context: $context)
          }
        `,
        variables: {
          context: {
            graphId: 'test-id',
            graphElements: JSON.stringify(['test', 'elements', 'array']),
          },
        },
      })
      .then((res) => {
        console.log(res)
      })

    // Schedule new solution for all `immediate` parameters
  }, [solution.id, expireSolution])

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
        graphId: 'graphSlice.meta.id',
      },
      skip: !isAuthenticated,
      shouldResubscribe: true,
    }
  )

  useEffect(() => {
    // Data arrived from subscription
  }, [data])

  return <>{children}</>
}
