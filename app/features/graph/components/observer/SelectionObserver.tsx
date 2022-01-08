import { useSubscription, gql, useMutation } from '@apollo/client'
import React, { useEffect, useRef } from 'react'
import { useGraphDispatch, useGraphSelection, useGraphId } from '../../store/graph/hooks'
import { firebase } from 'features/common/context/session/auth/firebase'
import { useSessionManager } from '@/features/common/context/session'
import { newGuid } from '../../utils'

const SelectionObserver = (): React.ReactElement => {
  const { token } = useSessionManager()

  const observerId = useRef<string>(newGuid())

  const { updateSelection } = useGraphDispatch()
  const graphId = useGraphId()
  const selection = useGraphSelection()

  const internalSelection = useRef<string[]>([])

  const [mutateSelection] = useMutation(
    gql`
      mutation UpdateSelection($observerId: String!, $graphId: String!, $selection: [String]!) {
        updateSelection(observerId: $observerId, graphId: $graphId, selection: $selection) {
          selection
        }
      }
    `,
    { variables: { observerId: observerId.current, graphId, selection } }
  )

  useEffect(() => {
    if (!token) {
      return
    }

    const isSameLength = selection.length === internalSelection.current.length
    const isSameContent = !selection.some((id) => !internalSelection.current.includes(id))

    if (!isSameLength || !isSameContent) {
      // Local change, broadcast to all sessions
      internalSelection.current = selection

      mutateSelection()
    }
  }, [selection])

  const { error } = useSubscription(
    gql`
      subscription WatchSelectionChange($graphId: String!) {
        onUpdateSelection(graphId: $graphId) {
          observerId
          selection
        }
      }
    `,
    {
      variables: { graphId },
      skip: !token,
      onSubscriptionData: ({ subscriptionData }) => {
        const { data } = subscriptionData

        if (!data || !data.onUpdateSelection) {
          return
        }

        const sourceObserverId = data.onUpdateSelection.observerId

        if (sourceObserverId === observerId.current) {
          // Do not attempt to consume updates from same client
          return
        }

        const incomingSelection: string[] = data.onUpdateSelection.selection

        const isSameLength = incomingSelection.length === internalSelection.current.length
        const isSameContent = !incomingSelection.some((id) => !internalSelection.current.includes(id))

        if (!isSameLength || !isSameContent) {
          // Remote change, apply locally once
          internalSelection.current = incomingSelection
          updateSelection({ type: 'id', ids: incomingSelection, mode: 'default' })
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

export default React.memo(SelectionObserver)
