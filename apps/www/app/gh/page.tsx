import NodesAppContainer from "@/components/editor/GraphEditor";
import type * as NodePen from '@nodepen/core'

export default function Page() {
  const document: NodePen.Document = {
    id: '',
    version: 1,
    nodes: {},
    configuration: {
      inputs: [],
      outputs: []
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <NodesAppContainer document={document} templates={[]} />
    </div>
  )
}