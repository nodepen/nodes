import { Glasshopper } from 'glib'
import { ElementStatus } from '../types'

export const getElementStatus = (
  element: Glasshopper.Element.StaticComponent | Glasshopper.Element.StaticParameter | Glasshopper.Element.NumberSlider,
  solutionId: string
): ElementStatus => {
  if (element.current.solution.id !== solutionId) {
    return 'waiting'
  }

  switch (element.template.type) {
    case 'number-slider': {
      return 'idle'
    }
    default: {
      const el = element as Glasshopper.Element.StaticComponent | Glasshopper.Element.StaticParameter
      return el.current.runtimeMessage?.level ?? 'idle'
    }
  }
}
