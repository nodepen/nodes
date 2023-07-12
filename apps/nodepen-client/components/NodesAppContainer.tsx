'use client'

import type React from 'react'
import { useCallback, useState } from 'react'
import { print } from 'graphql'
import gql from 'graphql-tag'
import type * as NodePen from '@nodepen/core'
import { NodesApp, DocumentView, SpeckleModelView } from '@nodepen/nodes'
import type { NodesAppState, NodesAppCallbacks } from '@nodepen/nodes'

type NodesAppContainerProps = {
  document: NodePen.Document
  templates: NodePen.NodeTemplate[]
}

const NodesAppContainer = ({ document: initialDocument, templates }: NodesAppContainerProps): React.ReactElement => {
  const stream = {
    id: process.env.NEXT_PUBLIC_STREAM_ID!,
    url: process.env.NEXT_PUBLIC_STREAM_URL!,
    token: process.env.NEXT_PUBLIC_STREAM_TOKEN!,
  }

  const [document, setDocument] = useState(initialDocument)
  const [solution, setSolution] = useState<NodePen.SolutionData>()

  const handleDocumentChange = useCallback((state: NodesAppState): void => {
    console.log('Callback from app!')
  }, [])

  const handleFileUpload = useCallback(async (state: NodesAppState): Promise<void> => {
    const file = state.layout.fileUpload.activeFile

    if (!file) {
      return
    }

    const body = new FormData()
    body.append('file', file)

    const payload = { method: 'POST', body }

    const response = await fetch('http://localhost:6500/files/gh', payload)
    const data = await response.json()

    setDocument(data)
  }, [])

  const handleExpireSolution = useCallback((state: NodesAppState): void => {
    const solutionId = state.solution.id

    const requestSolution = async (): Promise<string> => {
      const response = await fetch('http://localhost:6500/grasshopper/id/solution', {
        method: 'POST',
        body: JSON.stringify({ solutionId, document: state.document }),
      })

      const data = await response.text()

      return data
    }

    const fetchObjects = async (objectId: string): Promise<void> => {
      const query = gql`
        query GetObjects($streamId: String!, $objectId: String!) {
          stream(id: $streamId) {
            object(id: $objectId) {
              data
              children {
                objects {
                  data
                }
              }
            }
          }
        }
      `

      const response = await fetch(`${stream.url}/graphql`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${stream.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: print(query),
          operationName: 'GetObjects',
          variables: {
            streamId: stream.id,
            objectId: objectId,
          },
        }),
      })

      const data = await response.json()

      console.log(data)
    }

    requestSolution()
      .then((rootObjectId) => {
        console.log(`🟢 Solution object id: ${rootObjectId}`)
        return fetchObjects(rootObjectId)
      })
      .then(() => {
        // Do nothing
      })
      .catch((e) => {
        console.log(e)
      })
  }, [])

  const callbacks: NodesAppCallbacks = {
    onDocumentChange: handleDocumentChange,
    onExpireSolution: handleExpireSolution,
    onFileUpload: handleFileUpload,
  }

  return (
    <NodesApp document={document} templates={templates} solution={solution} {...callbacks}>
      <DocumentView editable />
      <SpeckleModelView stream={stream} />
    </NodesApp>
  )
}

export default NodesAppContainer
