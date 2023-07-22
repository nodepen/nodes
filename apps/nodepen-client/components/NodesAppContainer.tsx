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
  const [solution, setSolution] = useState<NodePen.DocumentSolutionData>()

  const [streamRootObjectId, setStreamRootObjectId] = useState<string>()

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
    const solutionId = state.solution.solutionId

    const requestSolution = async (): Promise<string> => {
      const response = await fetch('http://localhost:6500/grasshopper/id/solution', {
        method: 'POST',
        body: JSON.stringify({ solutionId, document: state.document }),
      })

      return await response.text()
    }

    const fetchSolutionRuntimeData = async (rootObjectId: string): Promise<NodePen.DocumentSolutionData> => {
      const query = gql`
        query GetObjects($streamId: String!, $objectId: String!) {
          stream(id: $streamId) {
            object(id: $objectId) {
              data
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
            objectId: rootObjectId,
          },
        }),
      })

      const { data } = await response.json()

      const { data: streamSolutionData } = data.stream.object

      const documentSolutionData: NodePen.DocumentSolutionData = {
        solutionId: streamSolutionData['SolutionData']['SolutionId'],
        documentRuntimeData: {
          durationMs: streamSolutionData['SolutionData']['DocumentRuntimeData']['DurationMs'],
        },
        nodeSolutionData: [],
      }

      for (const entry of streamSolutionData['SolutionData']['NodeSolutionData']) {
        const nodeSolutionData: NodePen.NodeSolutionData = {
          nodeInstanceId: entry['NodeInstanceId'],
          nodeRuntimeData: {
            durationMs: entry['NodeRuntimeData']['DurationMs'],
            messages: entry['NodeRuntimeData']['Messages'].map((message: any) => ({
              level: message['Level'],
              message: message['Message'],
            })),
          },
          portSolutionData: [],
        }

        documentSolutionData.nodeSolutionData.push(nodeSolutionData)
      }

      return documentSolutionData
    }

    requestSolution()
      .then((rootObjectId) => {
        setStreamRootObjectId(rootObjectId)
        return fetchSolutionRuntimeData(rootObjectId)
      })
      .then((documentSolutionData) => {
        console.log(documentSolutionData)
        setSolution(documentSolutionData)
      })
  }, [])

  const handleGetPortSolutionData = useCallback(
    async (nodeInstanceId: string, portInstanceId: string): Promise<NodePen.PortSolutionData> => {
      const query = gql`
        query GetObjects($streamId: String!, $objectId: String!) {
          stream(id: $streamId) {
            object(id: $objectId) {
              data
              # NodePenPortSolutionData queried by specific node & port reference
              # Do: speckle_type, NodeInstanceId, PortInstanceId
              children(query: $portSolutionDataQuery) {
                objects {
                  # NodePenDataTreeBranch ordered by Order
                  children(orderBy: ["Order"]) {
                    totalCount
                    cursor
                    data # The data we want
                  }
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
            objectId: streamRootObjectId,
          },
        }),
      })
    },

    [stream.id, streamRootObjectId]
  )

  const callbacks: NodesAppCallbacks = {
    onExpireSolution: handleExpireSolution,
    onFileUpload: handleFileUpload,
  }

  return (
    <NodesApp document={document} templates={templates} solution={solution} {...callbacks}>
      <DocumentView editable />
      <SpeckleModelView stream={stream} rootObjectId={streamRootObjectId} />
    </NodesApp>
  )
}

export default NodesAppContainer
