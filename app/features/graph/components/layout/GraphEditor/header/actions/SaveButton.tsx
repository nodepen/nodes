import React, { useMemo, useRef } from 'react'
import { NodePen } from 'glib'
import { useGraphAuthor, useGraphElements, useGraphId } from '@/features/graph/store/graph/hooks'
import { newGuid } from '@/features/graph/utils'
import { useMutation, useSubscription, gql } from '@apollo/client'
import { useSessionManager } from '@/features/common/context/session'
import { useRouter } from 'next/router'

const SaveButton = (): React.ReactElement => {
  const router = useRouter()
  const { token, user, userRecord } = useSessionManager()

  const graphElements = useGraphElements()
  const graphAuthor = useGraphAuthor()
  const graphId = useGraphId()

  const isGraphAuthor = userRecord?.username && userRecord.username == graphAuthor
  const isNewGraph = router.pathname === '/gh'

  // The elements that we want to save and load with a graph
  const persistedGraphElements = useMemo(() => {
    const persistedTypes: NodePen.ElementType[] = [
      'static-component',
      'static-parameter',
      'number-slider',
      'panel',
      'wire',
    ]
    return Object.values(graphElements).filter((element) => persistedTypes.includes(element.template.type))
  }, [graphElements])

  // The solution id associated with saving this graph revision
  const saveSolutionId = useRef(newGuid())

  const [scheduleSaveGraph] = useMutation(
    gql`
      mutation ScheduleSaveGraph($solutionId: String!, $graphId: String!, $graphJson: String!) {
        scheduleSaveGraph(solutionId: $solutionId, graphId: $graphId, graphJson: $graphJson)
      }
    `
  )

  const handleSaveGraph = (): void => {
    const nextSolutionId = newGuid()

    saveSolutionId.current = nextSolutionId
    scheduleSaveGraph({
      variables: {
        solutionId: nextSolutionId,
        graphId,
        graphJson: JSON.stringify(persistedGraphElements),
      },
    }).then((res) => {
      const revision = res.data.scheduleSaveGraph
      console.log(`Scheduled save for revision ${revision}. ${saveSolutionId.current}`)
    })
  }

  // Watching for save events to know the latest save is complete
  // If save completes, and we're not the graph owner, or it's a new graph,
  // then navigate to that page.
  const { error } = useSubscription(
    gql`
      subscription WatchSaveGraph($graphId: String!) {
        onSaveFinish(graphId: $graphId) {
          solutionId
          graphId
        }
      }
    `,
    {
      variables: { graphId },
      skip: !token,
      onSubscriptionData: ({ subscriptionData }) => {
        const { data } = subscriptionData

        if (!data || !data.onSaveFinish) {
          return
        }

        const { solutionId: incomingSolutionId, graphId: incomingGraphId } = data.onSaveFinish

        if (incomingGraphId !== graphId) {
          console.log('🐍 Received save event data for a different graph!')
          return
        }

        if (incomingSolutionId !== saveSolutionId.current) {
          console.log(`⚠️ Ignoring save event data for out-of-date save.`)
          console.log(`Incoming: ${incomingSolutionId}`)
          console.log(`Local: ${saveSolutionId.current}`)
          return
        }

        if (process.env.NEXT_PUBLIC_DEBUG) {
          console.log('Save is complete!')
        }

        if (router.pathname === '/gh') {
          router.push(`/${userRecord?.username}/gh/${incomingGraphId}`, undefined)
          return
        }

        if (!isGraphAuthor) {
          // User has saved their own copy of another user's graph
          router.push(`/${userRecord?.username}/gh/${incomingGraphId}`, undefined)
        }
      },
    }
  )

  return (
    <button
      className="h-6 mr-2 pl-1 pr-2 rounded-sm border-2 border-dark flex items-center leading-5 text-dark font-semibold text-xs"
      onClick={handleSaveGraph}
    >
      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z"></path>
      </svg>
      <p>{isGraphAuthor || isNewGraph ? 'Save' : 'Save Copy'}</p>
    </button>
  )
}

export default React.memo(SaveButton)
