import React, { useEffect } from 'react'
import { NodePen } from 'glib'
import { useSubscription, gql, useApolloClient } from '@apollo/client'
import { useGraphElements, useGraphSolution } from '../../store/graph/hooks'
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

  const elements = useGraphElements()
  const solution = useGraphSolution()

  const { expireSolution } = useSolutionDispatch()

  useEffect(() => {
    const solutionId = solution.id

    if (!solutionId) {
      return
    }

    console.log(`New solution: ${solutionId}`)

    expireSolution(solutionId)

    const validElementTypes: NodePen.ElementType[] = ['static-component', 'static-parameter', 'number-slider']
    const validElements = Object.values(elements).filter((element) => validElementTypes.includes(element.template.type))

    const elementsJson = JSON.stringify(validElements)

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
            graphElements: elementsJson,
          },
        },
      })
      .then((res) => {
        // console.log(res)
      })
  }, [solution.id])

  // Subscribe to all solution events for session
  const { data } = useSubscription(
    gql`
      subscription {
        onSolution {
          solutionId
          # id
          # manifest {
          #   status
          #   duration
          #   runtimeMessages {
          #     level
          #     elementId
          #     message
          #   }
          # }
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
    console.log(data)

    // Request values for all `immediate` parameters
  }, [data])

  return <>{children}</>
}
