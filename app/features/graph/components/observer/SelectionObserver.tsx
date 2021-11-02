import { useSubscription, gql, useMutation } from '@apollo/client'
import React, { useEffect, useRef } from 'react'
import { useGraphDispatch, useGraphSelection, useGraphId } from '../../store/graph/hooks'
import { firebase } from 'features/common/context/session/auth/firebase'
import { useSessionManager } from '@/features/common/context/session'

const SelectionObserver = (): React.ReactElement => {
  const { token } = useSessionManager()

  const { updateSelection } = useGraphDispatch()
  const graphId = useGraphId()
  const selection = useGraphSelection()

  const internalSelection = useRef<string[]>([])

  const [mutateSelection] = useMutation(
    gql`
      mutation UpdateSelection($graphId: String!, $selection: [String]!) {
        updateSelection(graphId: $graphId, selection: $selection) {
          selection
        }
      }
    `,
    { variables: { graphId, selection } }
  )

  useEffect(() => {
    const isSameLength = selection.length === internalSelection.current.length
    const isSameContent = !selection.some((id) => !internalSelection.current.includes(id))

    if (!isSameLength || !isSameContent) {
      // Local change, broadcast to all sessions
      internalSelection.current = selection

      mutateSelection().then(() => console.log('@@'))
    }
  }, [selection])

  const { error } = useSubscription(
    gql`
      subscription WatchSelectionChange($graphId: String!) {
        onUpdateSelection(graphId: $graphId) {
          selection
        }
      }
    `,
    {
      variables: { graphId },
      skip: !token,
      shouldResubscribe: true,
      onSubscriptionData: ({ subscriptionData }) => {
        const { data } = subscriptionData

        if (!data || !data.onUpdateSelection) {
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
