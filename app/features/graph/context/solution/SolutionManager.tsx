import React, { useEffect, useRef } from 'react'
import { NodePen } from 'glib'
import { useSubscription, gql, useApolloClient } from '@apollo/client'
import { useGraphDispatch, useGraphElements, useGraphId } from '../../store/graph/hooks'
import { useSolutionDispatch, useSolutionMetadata } from '../../store/solution/hooks'
import { useSessionManager } from '@/features/common/context/session'
import { newGuid } from '../../utils'
import { getImmediateElements } from './utils'
import { firebase } from '../../../common/context/session/auth/firebase'

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

  const observerId = useRef(newGuid())

  const { restore: restoreGraph } = useGraphDispatch()
  const elements = useGraphElements()
  const graphId = useGraphId()

  const { updateSolution, tryApplySolutionManifest, tryApplySolutionValues, restoreSolution } = useSolutionDispatch()
  const meta = useSolutionMetadata()

  useEffect(() => {
    switch (meta.phase) {
      case 'expired': {
        // console.log(`🏃🏃🏃 DETECTED`)

        const newSolutionId = newGuid()

        const validElementTypes: NodePen.ElementType[] = [
          'static-component',
          'static-parameter',
          'number-slider',
          'panel',
          'wire',
        ]
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
              mutation ScheduleSolutionFromManager(
                $observerId: String!
                $graphJson: String!
                $graphId: String!
                $solutionId: String!
              ) {
                scheduleSolution(
                  observerId: $observerId
                  graphJson: $graphJson
                  graphId: $graphId
                  solutionId: $solutionId
                )
              }
            `,
            variables: {
              observerId: observerId.current,
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

  // Subscribe to all solution start events for graph
  const { error: startSubscriptionError } = useSubscription(
    gql`
      subscription WatchSolutionStart($graphId: String!) {
        onSolutionStart(graphId: $graphId) {
          observerId
          solutionId
          graphId
          graphJson
        }
      }
    `,
    {
      variables: { graphId },
      skip: !isAuthenticated,
      shouldResubscribe: true,
      onSubscriptionData: ({ subscriptionData }) => {
        const { data } = subscriptionData

        if (!data || !data.onSolutionStart) {
          return
        }

        const {
          observerId: incomingObserverId,
          graphJson,
          graphId: incomingGraphId,
          solutionId: incomingSolutionId,
        } = data.onSolutionStart

        if (incomingObserverId === observerId.current) {
          console.log('Skipping change from self.')
          return
        }
        console.log(`[ GRAPH ] Current: ${graphId} | Incoming: ${incomingGraphId}`)
        console.log(`[ SOLUTION ] Current: ${meta?.id} | Incoming: ${incomingSolutionId}`)

        const elements = JSON.parse(graphJson ?? '[]').reduce((all, current) => {
          all[current.id] = current
          return all
        }, {})

        if (incomingSolutionId !== meta.id && meta.phase === 'idle') {
          restoreSolution(incomingSolutionId)
          restoreGraph(
            {
              id: incomingGraphId,
              name: 'Restored!',
              author: 'Ravid Dutten',
              elements,
            },
            false
          )
        }
      },
    }
  )

  useEffect(() => {
    if (startSubscriptionError) {
      firebase.auth().currentUser?.getIdToken(true)
    }
  }, [startSubscriptionError])

  // Subscribe to all solution finish events for graph
  const { data, error } = useSubscription(
    gql`
      subscription WatchSolutionFinish($graphId: String) {
        onSolutionFinish(graphId: $graphId) {
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
      updateSolution({
        meta: {
          phase: 'idle',
          error: 'Could not process response from subscription!',
        },
      })

      // TODO: Is this the best way to force a refresh on the subscription?
      firebase.auth().currentUser?.getIdToken(true)
      return
    }

    if (!data) {
      return
    }

    if (!data.onSolutionFinish) {
      return
    }

    if (!meta.id) {
      console.log('🐍 Received solution manifest while graph was stale.')
      return
    }

    // Data arrived from subscription
    const { solutionId, duration, exceptionMessages, runtimeMessages } = data.onSolutionFinish

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

    const immediateElements = getImmediateElements(Object.values(elements))

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
    ).then((res: PromiseSettledResult<NodePen.DataTreeBranch[]>[]) => {
      tryApplySolutionValues({
        solutionId,
        values: immediateValuePaths.reduce((all, [elementId, parameterId], i) => {
          const currentResult = res[i]

          if (currentResult?.status !== 'fulfilled') {
            return all
          }

          const data = currentResult.value.reduce((branches, current) => {
            const currentBranch = JSON.parse(JSON.stringify(current))

            for (const entry of currentBranch.data) {
              // Results arrive as stringified json
              const incoming = entry.value as string

              switch (entry.type) {
                case 'boolean': {
                  entry.value = incoming === 'true'
                  break
                }
                case 'integer': {
                  entry.value = Number.parseInt(incoming)
                  break
                }
                case 'number': {
                  entry.value = Number.parseFloat(incoming)
                  break
                }
                case 'text': {
                  entry.value = incoming
                  break
                }
                case 'domain':
                case 'vector':
                case 'point':
                case 'transform': {
                  entry.value = JSON.parse(incoming)
                  break
                }
                default: {
                  console.log(`🐍 Received unhandled value of type '${entry.type}''`)
                }
              }
            }
            return [...branches, currentBranch]
          }, [] as NodePen.DataTreeBranch[])

          return [...all, { elementId, parameterId, data }]
        }, [] as { elementId: string; parameterId: string; data: NodePen.DataTreeBranch[] }[]),
      })
    })
  }, [data])

  return <>{children}</>
}
