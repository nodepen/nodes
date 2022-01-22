import React, { useEffect, useRef, useState } from 'react'
import { useGraphDispatch, useGraphManifest } from '@/features/graph/store/graph/hooks'
import { newGuid } from '@/features/graph/utils'
import { useMutation, useSubscription, gql } from '@apollo/client'
import { useSessionManager } from '@/features/common/context/session'
import { Modal } from '@/features/common/layout'
import { Popover } from '@/features/common/popover'
import { useRouter } from 'next/router'
import { usePersistedGraphElements } from '@/features/graph/hooks'
import { SaveProgressMenu } from '../menus'
import Link from 'next/link'

const SaveButton = (): React.ReactElement => {
  const router = useRouter()
  const { token, user, userRecord } = useSessionManager()

  const buttonRef = useRef<HTMLButtonElement>(null)
  const buttonPosition = useRef<[number, number]>([0, 0])

  const { setGraphFileUrl } = useGraphDispatch()
  const {
    name: graphName,
    author: { name: graphAuthor },
    id: graphId,
  } = useGraphManifest()

  const isGraphAuthor = userRecord?.username && userRecord.username == graphAuthor
  const isNewGraph = router.pathname === '/gh'
  const isQuickSave = isGraphAuthor && !isNewGraph

  // The elements that we want to save and load with a graph
  const persistedGraphElements = usePersistedGraphElements()

  // The solution id associated with saving this graph revision
  const saveSolutionId = useRef(newGuid())

  const saveProgress = useRef(0)
  const [saveProgressMessage, setSaveProgressMessage] = useState('Saving...')
  const [showSaveProgress, setShowSaveProgress] = useState(false)

  const [scheduleSaveGraph] = useMutation(
    gql`
      mutation ScheduleSaveGraph($solutionId: String!, $graphId: String!, $graphJson: String!, $graphName: String!) {
        scheduleSaveGraph(solutionId: $solutionId, graphId: $graphId, graphJson: $graphJson, graphName: $graphName)
      }
    `
  )

  const [showModal, setShowModal] = useState(false)

  const handleSaveGraph = (): void => {
    if (!user || user.isAnonymous) {
      // Block save, show modal
      setShowModal(true)
      return
    }

    const button = buttonRef.current

    if (button) {
      const { top, left, width, height } = button.getBoundingClientRect()

      buttonPosition.current = [left + width, top + height + 8]
    }

    saveProgress.current = 5
    setSaveProgressMessage('Saving...')
    setShowSaveProgress(true)

    const nextSolutionId = newGuid()
    saveSolutionId.current = nextSolutionId

    const persisted = JSON.parse(JSON.stringify(persistedGraphElements)) as typeof persistedGraphElements

    for (const el of persisted) {
      if ('icon' in el.template) {
        el.template.icon = ''
      }
    }

    scheduleSaveGraph({
      variables: {
        solutionId: nextSolutionId,
        graphId,
        graphJson: JSON.stringify(persisted),
        graphName,
      },
    })
      .then((res) => {
        if (process?.env?.NEXT_PUBLIC_DEBUG === 'true') {
          const revision = res.data.scheduleSaveGraph
          console.log(`Scheduled save for revision ${revision}. ${saveSolutionId.current}`)
        }

        if (isQuickSave) {
          // Do not wait for further processing, show success immediately
          saveProgress.current = 100
          setSaveProgressMessage('Save successful')
          buttonRef.current?.blur()
          setTimeout(() => {
            setShowSaveProgress(false)
          }, 1000 * 1.5)
        } else {
          // Wait for full processing, so we know when to navigate to the new graph
          saveProgress.current = 33
          setSaveProgressMessage('Creating new graph')
        }
      })
      .catch(() => {
        saveProgress.current = 0
        setSaveProgressMessage('Error saving!')
        button?.blur()
        setTimeout(() => {
          setShowSaveProgress(false)
        }, 1000 * 3)
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
          graphBinariesUrl
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

        const { solutionId: incomingSolutionId, graphId: incomingGraphId, graphBinariesUrl } = data.onSaveFinish

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

        if (process?.env?.NEXT_PUBLIC_DEBUG === 'true') {
          console.log('Save is complete!')
        }

        if (isNewGraph) {
          saveProgress.current = 100
          setSaveProgressMessage('Save successful')
          buttonRef.current?.blur()
          setTimeout(() => {
            setShowSaveProgress(false)
          }, 1000 * 2)

          router.push(`/${userRecord?.username}/gh/${incomingGraphId}`, undefined)
          router.reload()
          return
        }

        if (!isGraphAuthor) {
          // User has saved their own copy of another user's graph
          saveProgress.current = 100
          setSaveProgressMessage('Save successful')
          buttonRef.current?.blur()
          setTimeout(() => {
            setShowSaveProgress(false)
          }, 1000 * 2)

          router.push(`/${userRecord?.username}/gh/${incomingGraphId}`, undefined, { shallow: false })
          router.reload()
          return
        }

        // If a save does not require navigation, then set the .gh link in state
        setGraphFileUrl('graphBinaries', graphBinariesUrl)
      },
    }
  )

  useEffect(() => {
    if (!error) {
      return
    }

    console.error(error)

    saveProgress.current = 0
    setSaveProgressMessage('Error saving!')
    setTimeout(() => {
      setShowSaveProgress(false)
    }, 1000 * 3)
  }, [error])

  return (
    <button
      className="h-6 mr-2 pl-1 pr-2 rounded-sm border-2 border-dark flex items-center leading-5 text-dark font-semibold text-xs hover:bg-green"
      onClick={handleSaveGraph}
      ref={buttonRef}
    >
      {user?.isAnonymous ? (
        <svg className="w-4 h-4 mr-1" fill="#333" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-4 h-4 mr-1" fill="#333" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z"></path>
        </svg>
      )}
      <p>{user?.isAnonymous ? 'Save Disabled' : isGraphAuthor || isNewGraph ? 'Save' : 'Save Copy'}</p>
      {showSaveProgress ? (
        <Popover position={buttonPosition.current} anchor="TR" onClose={() => setShowSaveProgress(false)}>
          <SaveProgressMenu progress={saveProgress.current} message={saveProgressMessage} />
        </Popover>
      ) : null}
      {showModal ? (
        <Modal
          onClose={() => {
            setShowModal(false)
          }}
        >
          <div className="w-full flex flex-col items-center" style={{ minWidth: 250 }}>
            <h3 className="mb-1 text-2xl font-bold text-dark">Sorry!</h3>
            <p className="text-lg mb-4 font-semibold text-dark">Saving scripts requires a NodePen account.</p>
            <Link href="/signup">
              <a className="p-2 pl-4 pr-4 rounded-md bg-green hover:bg-swampgreen text-darkgreen font-semibold">
                Sign up for free
              </a>
            </Link>
            <Link href="/signin">
              <a className="p-2 pl-4 pr-4 rounded-md text-swampgreen hover:text-darkgreen font-semibold">Sign in</a>
            </Link>
          </div>
        </Modal>
      ) : null}
    </button>
  )
}

export default React.memo(SaveButton)
