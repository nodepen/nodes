import { useState, useRef, useEffect } from 'react'
import { NodePen } from 'glib'
import { useSolutionPhase, useSolutionValues } from '@/features/graph/store/solution/hooks'

type PanelValues = {
  source: 'solution' | 'self'
  loading: boolean
  values?: NodePen.DataTree
}

export const usePanelValues = (panel: NodePen.Element<'panel'>): PanelValues => {
  const { id, current } = panel

  const solutionValues = useSolutionValues()
  const solutionPhase = useSolutionPhase()

  const [values, setValues] = useState<NodePen.DataTree>()
  const source = useRef<'solution' | 'self'>('self')

  useEffect(() => {
    if (solutionPhase !== 'idle') {
      return
    }

    const sourceCount = current.sources['input'].length

    if (sourceCount > 0) {
      source.current = 'solution'
      setValues(solutionValues?.[id]?.['output'])
    } else {
      source.current = 'self'
      setValues(current.values?.['output'])
    }
  }, [solutionPhase])

  const loading = solutionPhase !== 'idle'

  return { source: source.current, loading, values }
}
