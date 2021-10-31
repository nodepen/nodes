import { useSolutionValues, useSolutionPhase } from '@/features/graph/store/solution/hooks'
import { NodePen } from 'glib'

export const useVisibleGeometry = (
  element: NodePen.Element<'static-component' | 'static-parameter'>,
  parameterId: string
): NodePen.SolutionValueGoo[] => {
  const { id, current } = element

  const values = useSolutionValues()
  const phase = useSolutionPhase()
}
