import { useSessionManager } from '@/features/common/context/session'
import { useMutation, gql, useSubscription } from '@apollo/client'
import React, { useEffect, useRef } from 'react'
import { useGraphDispatch, useGraphId, useGraphSelection, useVisibilityRegistry } from '../../store/graph/hooks'
import { useVisibilityHotkey } from '../../store/hotkey/hooks'
import { newGuid } from '../../utils'
import { firebase } from 'features/common/context/session/auth/firebase'

/**
 * Watches `ctrl + q` and for `setVisibility` changes
 */
const VisibilityHotkeyObserver = (): React.ReactElement => {
  const { token, user } = useSessionManager()

  const observerId = useRef<string>(newGuid())

  const { toggleVisibility } = useGraphDispatch()
  const graphId = useGraphId()
  const selection = useGraphSelection()

  const shouldToggle = useVisibilityHotkey()

  const [mutateVisibility] = useMutation(
    gql`
      mutation UpdateVisibility($observerId: String!, $graphId: String!, $ids: [String]!) {
        updateVisibility(observerId: $observerId, graphId: $graphId, ids: $ids) {
          graphId
        }
      }
    `,
    { variables: { observerId: observerId.current, graphId, ids: selection } }
  )

  useEffect(() => {
    if (!token || user?.isAnonymous) {
      return
    }

    if (!shouldToggle || selection.length === 0) {
      return
    }

    toggleVisibility(selection)
    mutateVisibility()
  }, [shouldToggle])

  const { error } = useSubscription(
    gql`
      subscription WatchVisibilityChange($graphId: String!) {
        onUpdateVisibility(graphId: $graphId) {
          observerId
          ids
        }
      }
    `,
    {
      variables: { graphId },
      skip: !token,
      onSubscriptionData: ({ subscriptionData }) => {
        const { data } = subscriptionData

        if (!data || !data.onUpdateVisibility) {
          return
        }

        const sourceObserverId = data.onUpdateVisibility.observerId

        if (sourceObserverId === observerId.current) {
          return
        }

        toggleVisibility(data.onUpdateVisibility.ids)
      },
    }
  )

  useEffect(() => {
    if (error) {
      console.log(`🐍 Error while trying to watch subscription changes!`)
      firebase.auth().currentUser?.getIdToken(true)
    }
  }, [error])

  const registry = useVisibilityRegistry()
  const internalRegistry = useRef<string[]>([])

  useEffect(() => {
    const isSameLength = registry.length === internalRegistry.current.length
    const isSameContent = !registry.some((id) => !internalRegistry.current.includes(id))

    if (!isSameLength || !isSameContent) {
      // Some work needs to be emitted
      internalRegistry.current = registry
      mutateVisibility({ variables: { observerId: observerId.current, graphId, ids: registry } })
    }
  }, [registry])

  return <></>
}

export default React.memo(VisibilityHotkeyObserver)
