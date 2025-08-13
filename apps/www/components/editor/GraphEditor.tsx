'use client'

import type React from 'react'
import { useCallback, useState } from 'react'
import { print } from 'graphql'
import gql from 'graphql-tag'
import type * as NodePen from '@nodepen/core'
import { NodesApp, DocumentView, SpeckleModelView, NodesDialog } from '@nodepen/nodes'
import type { NodesAppState, NodesAppCallbacks, } from '@nodepen/nodes'
import { useNodepenSession } from '@/hooks/useNodepenSession'
import { getPublicEnv } from '@/utils/env'
import { signOut } from 'next-auth/react'
import DocumentSelectionModal from './modals/DocumentSelectionModal'

type NodesAppContainerProps = {
  templates: NodePen.NodeTemplate[]
}

const NodesAppContainer = ({ templates }: NodesAppContainerProps): React.ReactElement => {
  const { user, speckle } = useNodepenSession()

  const {
    NEXT_PUBLIC_SPECKLE_SERVER_URL,
    NEXT_PUBLIC_SPECKLE_APP_ID,
    NEXT_PUBLIC_SPECKLE_APP_CHALLENGE
  } = getPublicEnv()

  const stream = {
    id: process.env.NEXT_PUBLIC_STREAM_ID!,
    url: process.env.NEXT_PUBLIC_STREAM_URL!,
    token: process.env.NEXT_PUBLIC_STREAM_TOKEN!,
  }

  const initialDocument: NodePen.Document = {
    id: '',
    version: 1,
    nodes: {},
    meta: {
      name: 'My cool document',
      speckle: {
        model: {
          id: '',
          name: '',
          rootObjectId: ''
        }
      }
    },
    configuration: {
      inputs: [],
      outputs: []
    }
  }
  const [document, setDocument] = useState(initialDocument)

  const [showDialog, setShowDialog] = useState(false)

  const callbacks: NodesAppCallbacks = {
    onSignOut: async () => {
      await signOut({ redirect: false })
    },
    onOpenDocumentSettings: () => setShowDialog(true)
  }

  const solution: NodePen.DocumentSolutionData | undefined = undefined

  const userData = {
    name: user?.name ?? undefined,
    email: user?.email ?? undefined,
    image: user?.image ?? undefined,
    token: speckle.token ?? undefined,
  }

  const speckleConfig = {
    serverUrl: NEXT_PUBLIC_SPECKLE_SERVER_URL,
    appId: NEXT_PUBLIC_SPECKLE_APP_ID,
    appChallenge: NEXT_PUBLIC_SPECKLE_APP_CHALLENGE
  }


  return (
    <NodesApp document={document} templates={templates} solution={solution} user={userData} speckle={speckleConfig} {...callbacks} >
      <DocumentView editable />
      <SpeckleModelView stream={stream} rootObjectId={undefined} />
      {showDialog ? (
        <NodesDialog onClose={() => setShowDialog(false)}>
          <DocumentSelectionModal />
        </NodesDialog>
      ) : null}
    </NodesApp>
  )
}

export default NodesAppContainer
