import { useSessionManager } from '@/features/common/context/session'
import { useMutation, gql, useSubscription } from '@apollo/client'
import React, { useEffect, useRef } from 'react'
import { useGraphDispatch, useGraphElements, useGraphId, useGraphSelection } from '../../store/graph/hooks'
import { useVisibilityHotkey } from '../../store/hotkey/hooks'
import { newGuid } from '../../utils'
import { firebase } from 'features/common/context/session/auth/firebase'

const VisibilityHotkeyObserver = (): React.ReactElement => {
  const { token } = useSessionManager()

  const observerId = useRef<string>(newGuid())

  const { toggleVisibility } = useGraphDispatch()
  const elements = useGraphElements()
  const graphId = useGraphId()
  const selection = useGraphSelection()

  const shouldToggle = useVisibilityHotkey()

  const [mutateVisibility] = useMutation(
    gql`
      mutation UpdateVisibility($observerId: String!, $graphId: String!, $graphJson: String!) {
        updateVisibility(observerId: $observerId, graphId: $graphId, graphJson: $graphJson) {
          graphId
        }
      }
    `,
    {
      variables: { observerId: observerId.current, graphId, graphJson: JSON.stringify(elements) },
    }
  )

  useEffect(() => {
    if (!shouldToggle || selection.length === 0) {
      return
    }

    toggleVisibility(selection)
    mutateVisibility()
    // Emit
  }, [shouldToggle])

  const { error } = useSubscription(
    gql`
      subscription WatchVisibilityChange($graphId: String!) {
        onUpdateVisibility(graphId: $graphId) {
          observerId
          graphJson
        }
      }
    `,
    {
      variables: { graphId },
      skip: !token,
      shouldResubscribe: true,
      onSubscriptionData: ({ subscriptionData }) => {
        const { data } = subscriptionData

        if (!data || !data.onUpdateVisibility) {
          return
        }

        const sourceObserverId = data.onUpdateVisibility.observerId

        if (sourceObserverId === observerId.current) {
          console.log('Skipping visibility change from self!')
          return
        }
      },
    }
  )

  useEffect(() => {
    if (error) {
      console.log(`🐍 Error while trying to watch subscription changes!`)
      firebase.auth().currentUser?.getIdToken(true)
    }
  }, [error])

  return <></>
}

export default React.memo(VisibilityHotkeyObserver)
