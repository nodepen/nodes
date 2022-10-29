import type React from 'react'
import type * as NodePen from '@nodepen/core'
import { NodesAppContainer } from '../components'

const RootPage = async (): Promise<React.ReactElement> => {
  const document = await fetchDocument('test-id')
  const templates = await fetchTemplates()

  return (
    <div className="relative" style={{ width: 1000, height: 750, overflow: 'visible' }}>
      <div className="absolute" style={{ width: 1000, height: 750, top: 0, left: 0, zIndex: 10 }}>
        <NodesAppContainer document={document} templates={templates} />
      </div>
    </div>
  )
}

const fetchDocument = async (id: string): Promise<NodePen.Document> => {
  // TODO: Actually fetch it
  const document: NodePen.Document = {
    id,
    nodes: {},
    configuration: {
      pinnedPorts: [],
    },
    version: 1,
  }

  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, 100)
  })

  return document
}

const fetchTemplates = async (): Promise<NodePen.NodeTemplate[]> => {
  const response = await fetch('http://localhost:6500/grasshopper', { next: { revalidate: 600 } })
  const templates = await response.json()

  return templates
}

export default RootPage
