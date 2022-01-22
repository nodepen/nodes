import { useMemo } from 'react'
import { NodePen } from 'glib'
import { useGraphElements } from '../store/graph/hooks'

type PersistentElement = NodePen.Element<'static-component' | 'static-parameter' | 'number-slider' | 'panel' | 'wire'>

export const usePersistedGraphElements = (): PersistentElement[] => {
  const graphElements = useGraphElements()

  const persistedGraphElements = useMemo(() => {
    const persistedTypes: NodePen.ElementType[] = [
      'static-component',
      'static-parameter',
      'number-slider',
      'panel',
      'wire',
    ]
    return Object.values(graphElements).filter((element): element is PersistentElement =>
      persistedTypes.includes(element.template.type)
    )
  }, [graphElements])

  return persistedGraphElements
}
