import { use } from 'react'
import NodesAppContainer from "@/components/editor/GraphEditor";
import type * as NodePen from '@nodepen/core'

const fetchTemplates = async (): Promise<NodePen.NodeTemplate[]> => {
  const res = await fetch('http://localhost:9000/api/templates')
  const data = await res.json()
  return data.templates
}

export default function Page() {
  const templates = use(fetchTemplates())

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <NodesAppContainer templates={templates} />
    </div>
  )
}