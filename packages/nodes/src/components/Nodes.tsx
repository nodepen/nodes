import React, { useRef } from 'react'
import '@/styles.css'
import { COLORS } from '@/constants'

type NodesProps = {
  library: []
  graph: unknown
  solution: unknown
  onSave?: (graph: unknown) => void
  children?: React.ReactNode
}

export const Nodes = (): React.ReactElement => {
  const rootRef = useRef<HTMLDivElement>(null)

  return (
    <div className="np-w-full np-h-full np-bg-blue-200" ref={rootRef}>
      <div>{COLORS.GREEN}</div>
    </div>
  )
}
