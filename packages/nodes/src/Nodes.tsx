import type React from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

type NodesProps = {
  library: []
  graph: unknown
  solution: unknown
  onSave?: (graph: unknown) => void
  children?: JSX.Element
}

export const Nodes = (): React.ReactElement => {
  return (
    <TransformWrapper initialScale={1}>
      <div className="?" />
    </TransformWrapper>
  )
}
