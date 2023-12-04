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
      <NodesAppContainer document={document} templates={templates} />
    </div>
  )
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const fetchDocument = async (id: string): Promise<NodePen.Document> => {
    // TODO: Actually fetch it
    const document: NodePen.Document = {
      id: id,
      nodes: {
        // 'test-element-id-a': {
        //   instanceId: 'test-element-id-a',
        //   templateId: '845527a6-5cea-4ae9-a667-96ae1667a4e8',
        //   position: {
        //     x: 475,
        //     y: -375,
        //   },
        //   dimensions: {
        //     width: 20,
        //     height: 20,
        //   },
        //   sources: {},
        //   anchors: {},
        //   values: {
        //     ['input-a']: {},
        //     ['input-b']: {
        //       '{0}': [
        //         {
        //           type: 'number',
        //           value: 3,
        //         },
        //       ],
        //     },
        //     ['input-c']: {
        //       '{0}': [
        //         {
        //           type: 'number',
        //           value: 6,
        //         },
        //       ],
        //     },
        //     ['input-d']: {},
        //   },
        //   inputs: {
        //     ['input-a']: 0,
        //     ['input-b']: 1,
        //     ['input-c']: 2,
        //     ['input-d']: 3,
        //   },
        //   outputs: {
        //     ['output-a']: 0,
        //     ['output-b']: 1,
        //   },
        // },
      },
      configuration: {
        inputs: [],
        outputs: [],
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
    const response = await fetch('http://localhost:4000/grasshopper', { cache: 'no-store' })
    const templates = await response.json()

    return templates
  }

  const templates = await fetchTemplates()

  return {
    props: {
      document,
      templates,
    },
    revalidate: 600,
  }
}

export default Page
