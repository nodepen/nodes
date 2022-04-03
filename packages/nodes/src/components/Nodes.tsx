import type React from 'react'
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
  return <div className="np-w-full np-h-full np-bg-red-200">{COLORS.GREEN}</div>
}
