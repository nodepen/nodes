import { useState } from 'react'
import { NodePen } from 'glib'
import { useParameterValues } from 'features/graph/hooks'
import { useSolutionPhase } from 'features/graph/store/solution/hooks'
import { useEffect } from 'react'

export const useWireType = (elementId?: string, parameterId?: string): 'item' | 'list' | 'tree' => {
  const [tree] = useParameterValues(elementId ?? 'unset', parameterId ?? 'unset')
  const phase = useSolutionPhase()

  const [internalTree, setInternalTree] = useState<NodePen.DataTree>()

  useEffect(() => {
    if (phase === 'idle') {
      setInternalTree(tree)
    }
  }, [phase, tree])

  if (!elementId || !parameterId || !internalTree) {
    return 'item'
  }

  const branches = Object.entries(internalTree)

  if (branches.length === 0) {
    return 'item'
  }

  if (branches.length > 1) {
    return 'tree'
  }

  const values = branches[0][1]

  return values.length > 1 ? 'list' : 'item'
}
