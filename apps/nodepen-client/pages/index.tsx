import type { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import type React from 'react'
import type * as NodePen from '@nodepen/core'

const NodesAppContainer = dynamic(import('../components/NodesAppContainer'), { ssr: false })

type PageProps = {
  document: NodePen.Document
  templates: NodePen.NodeTemplate[]
}

const Page = ({ document, templates }: PageProps): React.ReactElement => {
  return (
    <div className="w-vw h-vh flex justify-center items-center">
      <div className="relative" style={{ width: 1000, height: 750, overflow: 'visible' }}>
        <div className="absolute" style={{ width: 1000, height: 750, top: 0, left: 0, zIndex: 10 }}>
          <NodesAppContainer document={document} templates={templates} />
        </div>
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
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

  const document = await fetchDocument('test-id')

  const fetchTemplates = async (): Promise<NodePen.NodeTemplate[]> => {
    const response = await fetch('http://localhost:6500/grasshopper', { cache: 'no-store' })
    const templates = await response.json()

    return templates
  }

  const templates = await fetchTemplates()

  return {
    props: {
      document,
      templates,
    },
  }
}

export default Page
