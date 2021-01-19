import { Glasshopper } from 'glib'
import { ElementStatus } from '../types'

export const getElementStatus = (
  element: Glasshopper.Element.StaticComponent | Glasshopper.Element.StaticParameter,
  solutionId: string
): ElementStatus => {
  if (element.current.solution.id !== solutionId) {
    return 'waiting'
  }

  if (element.current.runtimeMessage) {
    return element.current.runtimeMessage.level
  }

  return 'idle'
}
