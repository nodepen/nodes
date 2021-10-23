import { NodePen, assert } from 'glib'
import { useGraphElements } from '../store/graph/hooks'
import { useSolutionValues } from '../store/solution/hooks'

export const useParameterValues = (elementId: string, parameterId: string): NodePen.DataTree | undefined => {
  const elements = useGraphElements()
  const values = useSolutionValues()

  const element = elements[elementId]

  if (!element) {
    return undefined
  }

  const graphElements: NodePen.ElementType[] = ['static-component', 'static-parameter', 'number-slider']

  const { template, current } = element

  if (!graphElements.includes(template.type)) {
    return undefined
  }

  if (!assert.element.isGraphElement(current)) {
    return undefined
  }

  return values?.[elementId]?.[parameterId] ?? current?.values?.[parameterId]
}
