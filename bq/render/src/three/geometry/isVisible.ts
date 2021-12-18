import { NodePen, assert } from 'glib'

export const isVisible = (
  elementId: string,
  parameterId: string,
  elements: NodePen.GraphElementsArray
): boolean => {
  const element = elements.find((el) => el.id === elementId)

  if (!element || !assert.element.isGraphElement(element.current)) {
    console.log('🐍 Element does not exist!')
    return false
  }

  const { current: elementState } = element

  if (!assert.element.isGraphElement(elementState)) {
    console.log('🐍 Element does not contain data!')
    return false
  }

  const { settings, outputs } = elementState

  if (settings.visibility !== 'visible') {
    console.log('🐍 Element is not visible!')
    return false
  }

  if (!Object.keys(outputs).includes(parameterId)) {
    console.log('🐍 Element is an input!')
    return false
  }

  return true
}
