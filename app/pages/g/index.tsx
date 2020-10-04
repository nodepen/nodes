import React from 'react'
import { Editor, Layout } from '@/components'

const GraphPage = (): JSX.Element => {
  return (
    <Layout.Root>
      <Editor.Header />
      <Editor.Graph />
      <Editor.Controls />
    </Layout.Root>
  )
}

export default GraphPage
