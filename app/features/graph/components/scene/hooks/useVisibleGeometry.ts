import { useState, useEffect, useMemo } from 'react'
import { NodePen } from 'glib'
import { useSolutionValues, useSolutionPhase } from 'features/graph/store/solution/hooks'
import { getFlattenedDataTreeValues, isInputOrOutput } from 'features/graph/utils'

export const useVisibleGeometry = <T extends 'curve' | 'point' | 'line'>(
  element: NodePen.Element<'static-component' | 'static-parameter'>,
  parameterId: string,
  types: T[]
): NodePen.DataTreeValue<T>[] => {
  const { id, current } = element

  const visibility = current.settings.visibility
  const sources = current.sources?.[parameterId] ?? []
  const mode = isInputOrOutput(element, parameterId)

  const values = useSolutionValues()
  const phase = useSolutionPhase()

  const [internalTree, setInternalTree] = useState<NodePen.DataTree>()

  useEffect(() => {
    if (phase !== 'idle') {
      return
    }

    if (visibility !== 'visible') {
      setInternalTree(undefined)
      return
    }

    switch (mode) {
      case 'input': {
        // Only show source geometry on inputs with sources (prevents duplication in scene)
        const tree = sources.length > 0 ? undefined : values?.[id]?.[parameterId] ?? current.values[parameterId]
        setInternalTree(tree)
        break
      }
      case 'output': {
        const tree = values?.[id]?.[parameterId] ?? current.values[parameterId]
        setInternalTree(tree)
        break
      }
    }
  }, [phase, visibility])

  // const visibleTypes: NodePen.SolutionValueType[] = useMemo(() => ['point', 'line'], [])

  const visibleGeometry = useMemo(
    () =>
      getFlattenedDataTreeValues(internalTree ?? {}).filter((entry): entry is NodePen.DataTreeValue<T> =>
        types.includes(entry.type as T)
      ),
    [internalTree, types]
  )

  return visibleGeometry
}
