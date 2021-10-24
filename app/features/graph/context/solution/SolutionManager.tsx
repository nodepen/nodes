import React, { useEffect } from 'react'
import { NodePen } from 'glib'
import { useSubscription, gql, useApolloClient } from '@apollo/client'
import { useGraphElements } from '../../store/graph/hooks'
import { useSolutionDispatch, useSolutionId, useSolutionPhase } from '../../store/solution/hooks'
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

  const { expireSolution, updateSolution } = useSolutionDispatch()
  const solutionId = useSolutionId()
  const solutionPhase = useSolutionPhase()

  useEffect(() => {
    switch (solutionPhase) {
      case 'expired': {
        console.log(`🏃🏃🏃 DETECTED`)

        const validElementTypes: NodePen.ElementType[] = ['static-component', 'static-parameter', 'number-slider']
        const validElements = Object.values(elements).filter((element) =>
          validElementTypes.includes(element.template.type)
        )

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
          .then(({ data }) => {
            const newSolutionId = data.scheduleSolution

            updateSolution({
              meta: {
                id: newSolutionId,
                phase: 'scheduled',
              },
            })

            console.log('??')
          })
        break
      }
      case 'scheduled': {
        console.log(`🏃🏃🏃 SCHEDULED ${solutionId} New solution successfully scheduled!`)
        break
      }
      case 'idle': {
        if (!solutionId) {
          // TODO: Surface meta.error
          console.log(`🏃🏃🏃 FAILED`)
        }

        console.log(`🏃🏃🏃 SUCCEEDED ${solutionId}`)
        break
      }
    }
  }, [solutionPhase])

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
