import type React from 'react'
import { COLORS } from '@/constants'

type NodesProps = {
  library: []
  graph: unknown
  solution: unknown
  onSave?: (graph: unknown) => void
  children?: React.ReactNode
}

export const Nodes = (): React.ReactElement => {
  return <div>{COLORS.GREEN}</div>
}
