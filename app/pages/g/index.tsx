import React from 'react'
import { Editor, Layout } from '@/components'

const GraphPage = (): JSX.Element => {
  return (
    <Layout.Root>
      <Editor.Context>
        <Editor.Header />
        <Editor.Graph />
        <Editor.Controls />
      </Editor.Context>
    </Layout.Root>
  )
}

export default GraphPage
