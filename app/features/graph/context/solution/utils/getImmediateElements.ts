import { NodePen } from 'glib'

/**
 * Given a collection of elements, return all elements that want their solution values to arrive as soon as possible.
 * This means:
 * settings.solution === 'immediate'
 * settings.visibility === 'visible'
 */
export const getImmediateElements = (
  elements: NodePen.Element<NodePen.ElementType>[]
): NodePen.Element<'static-component' | 'static-parameter' | 'number-slider'>[] => {
  return elements.filter(
    (element): element is NodePen.Element<'static-component' | 'static-parameter' | 'number-slider'> =>
      'settings' in element.current &&
      (element.current.settings.solution === 'immediate' || element.current.settings.visibility === 'visible')
  )
}
