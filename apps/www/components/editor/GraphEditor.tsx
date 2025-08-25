'use client'

import React from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import type * as NodePen from '@nodepen/core'
import { NodesApp, DocumentView, SpeckleModelView, NodesDialog, NodesLayer } from '@nodepen/nodes'
import type { NodesAppState, NodesAppCallbacks, } from '@nodepen/nodes'
import { useNodepenSession } from '@/hooks/useNodepenSession'
import { getPublicEnv } from '@/utils/env'
import { signOut } from 'next-auth/react'
import DocumentSelectionModal from './modals/DocumentSelectionModal'
import { NodePenDocumentManifest } from '@/sdk/types'
import ObjectLoader from '@speckle/objectloader'
import { useRouter } from 'next/navigation'

type NodesAppContainerProps = {
  templates: NodePen.NodeTemplate[],
  manifest: NodePenDocumentManifest
  initialDocument?: NodePen.Document
}

const NodesAppContainer = ({ templates, manifest, initialDocument }: NodesAppContainerProps): React.ReactElement => {
  const { user, speckle } = useNodepenSession()

  const router = useRouter()

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

  const fallbackDocument: NodePen.Document = useMemo(() => ({
    id: '',
    version: 1,
    nodes: {},
    meta: {
      name: 'unset',
      speckle: {
        linkedModel: {
          id: '',
          name: '',
          rootObjectId: undefined
        }
      }
    },
    configuration: {
      inputs: [],
      outputs: []
    }
  }), [])


  const [document, setDocument] = useState(initialDocument ?? fallbackDocument)

  const [showDialog, setShowDialog] = useState(false)

  const handleExpireSolution = useCallback(async (state: NodesAppState) => {
    if (!speckle.serverUrl || !speckle.token) {
      return
    }

    console.log(`Sending document to: ${manifest.speckle.documentModel.id}`)

    const res = await fetch(`/api/documents/${manifest.meta.id}`, {
      method: 'POST',
      body: JSON.stringify({
        document: state.document,
        modelId: manifest.speckle.documentModel.id
      })
    })

    const data = await res.json()

    console.log(data)
  }, [speckle.serverUrl, speckle.token, manifest])

  const callbacks: NodesAppCallbacks = useMemo(() => ({
    onExpireSolution: handleExpireSolution,
    onSignOut: async () => {
      await signOut({ redirect: false })
    },
    onOpenDocumentSettings: () => setShowDialog(true)
  }), [handleExpireSolution])

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

  const handleSelectDocument = useCallback(async (manifest: NodePenDocumentManifest) => {
    setShowDialog(false)
    router.push(`/doc/${manifest.meta.id}`)
  }, [router])


  return (
    <NodesApp document={document} templates={templates} solution={solution} user={userData} speckle={speckleConfig} {...callbacks} >
      <DocumentView editable />
      <SpeckleModelView stream={stream} rootObjectId={undefined} />
      {showDialog ? (
        <NodesDialog onClose={() => setShowDialog(false)}>
          <DocumentSelectionModal onSelectDocument={handleSelectDocument} />
        </NodesDialog>
      ) : null}
    </NodesApp>
  )
}

export default React.memo(NodesAppContainer, (prev, next) => prev.manifest.meta.id === next.manifest.meta.id)
