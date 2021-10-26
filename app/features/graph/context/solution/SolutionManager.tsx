import React, { useEffect } from 'react'
import { NodePen } from 'glib'
import { useSubscription, gql, useApolloClient } from '@apollo/client'
import { useGraphElements, useGraphId } from '../../store/graph/hooks'
import { useSolutionDispatch, useSolutionMetadata } from '../../store/solution/hooks'
import { useSessionManager } from '@/features/common/context/session'
import { newGuid } from '../../utils'

type SolutionManagerProps = {
  children?: JSX.Element
}

/**
 * Expire solutionSlice in response to changes
 * Schedule solution
 * Consume initial results summary (duration, runtimeMessages)
 * Request any `immediate` values like panels
 * @param param0
 * @returns
 */
export const SolutionManager = ({ children }: SolutionManagerProps): React.ReactElement => {
  const { isAuthenticated } = useSessionManager()

  const client = useApolloClient()

  const elements = useGraphElements()
  const graphId = useGraphId()

  const { updateSolution, tryApplySolutionManifest } = useSolutionDispatch()
  const meta = useSolutionMetadata()

  useEffect(() => {
    switch (meta.phase) {
      case 'expired': {
        // console.log(`🏃🏃🏃 DETECTED`)

        const newSolutionId = newGuid()

        const validElementTypes: NodePen.ElementType[] = ['static-component', 'static-parameter', 'number-slider']
        const validElements = Object.values(elements).filter((element) =>
          validElementTypes.includes(element.template.type)
        )

        const elementsJson = JSON.stringify(validElements)

        updateSolution({
          meta: {
            id: newSolutionId,
            phase: 'scheduled',
          },
        })

        // console.log(`🏃🏃🏃 SCHEDULED ${newSolutionId}`)

        client
          .mutate({
            mutation: gql`
              mutation ScheduleSolutionFromManager($graphJson: String!, $graphId: String!, $solutionId: String!) {
                scheduleSolution(graphJson: $graphJson, graphId: $graphId, solutionId: $solutionId)
              }
            `,
            variables: {
              graphId: graphId,
              solutionId: newSolutionId,
              graphJson: elementsJson,
            },
          })
          .then(() => {
            // Do nothing
          })
          .catch((_err) => {
            // console.error(err)

            updateSolution({
              meta: {
                phase: 'idle',
                error: 'Failed to schedule a new solution.',
              },
            })
          })
        break
      }
      case 'scheduled': {
        // Do nothing
        break
      }
      case 'idle': {
        if (meta.error) {
          // console.log(`🏃🏃🏃 FAILED`)
          // console.error(meta.error)
          break
        }

        // console.log(`🏃🏃🏃 SUCCEEDED ${meta.id}`)
        break
      }
    }
  }, [meta])

  // Subscribe to all solution events for session
  const { data, error } = useSubscription(
    gql`
      subscription WatchGraphUpdates($graphId: String) {
        onSolution(graphId: $graphId) {
          solutionId
          graphId
          duration
          exceptionMessages
          runtimeMessages {
            elementId
            message
            level
          }
        }
      }
    `,
    {
      variables: {
        graphId,
      },
      skip: !isAuthenticated,
      shouldResubscribe: true,
    }
  )

  useEffect(() => {
    if (error) {
      console.error(error)
      return
    }

    if (!data) {
      return
    }

    if (!data.onSolution) {
      return
    }

    if (!meta.id) {
      console.log('🐍 Received solution manifest while graph was stale.')
      return
    }

    // Data arrived from subscription
    const { solutionId, duration, exceptionMessages, runtimeMessages } = data.onSolution

    if (exceptionMessages) {
      updateSolution({
        meta: {
          phase: 'idle',
          error: exceptionMessages[0],
        },
      })

      // console.error(exceptionMessages[0])

      return
    }

    const messages = runtimeMessages.reduce((all: any, current: any) => {
      const { elementId, ...message } = current

      if (elementId in all) {
        all[elementId].push(message)
      } else {
        all[elementId] = [message]
      }

      return all
    }, {})

    // console.log({ duration })

    tryApplySolutionManifest({
      solutionId,
      manifest: {
        duration,
        messages,
      },
    })

    // Request values for all `immediate` parameters
    // console.log('Querying!')

    const immediateElements = Object.values(elements).filter(
      (element): element is NodePen.Element<'static-component' | 'static-parameter' | 'number-slider'> =>
        'solution' in element.current && element.current.solution.mode === 'immediate'
    )

    console.log(`Requesting values for ${immediateElements.length} immediate mode components.`)

    const getSolutionValue = async (
      graphId: string,
      solutionId: string,
      elementId: string,
      parameterId: string
    ): Promise<any> => {
      const { data } = await client.query({
        query: gql`
          query GetSolutionValue($graphId: String!, $solutionId: String!, $elementId: String!, $parameterId: String!) {
            solution(graphId: $graphId, solutionId: $solutionId) {
              value(elementId: $elementId, parameterId: $parameterId) {
                path
                data {
                  type
                  value
                }
              }
            }
          }
        `,
        variables: {
          graphId,
          solutionId,
          elementId,
          parameterId,
        },
      })

      return data.solution.value
    }

    const getParameterInstanceIds = (
      element: NodePen.Element<'static-component' | 'static-parameter' | 'number-slider'>
    ): string[] => {
      return [...Object.keys(element.current.inputs), ...Object.keys(element.current.outputs)]
    }

    const immediateValuePaths: [elementInstanceId: string, parameterInstanceId: string][] = []

    for (const element of immediateElements) {
      const { id } = element
      const parameterInstanceIds = getParameterInstanceIds(element)

      for (const parameterId of parameterInstanceIds) {
        immediateValuePaths.push([id, parameterId])
      }
    }

    Promise.allSettled(
      immediateValuePaths.map(([elementId, parameterId]) =>
        getSolutionValue(graphId, solutionId, elementId, parameterId)
      )
    ).then((res) => {
      console.log(res)
    })
  }, [data])

  return <>{children}</>
}
