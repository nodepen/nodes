import { NodePen } from 'glib'
import { GraphState } from '../types'
import { batchGetConnectedWires } from '../utils'

export const prepareLiveMotion = (state: GraphState, anchor: string, targets: string[]): void => {
  const [fromWires, toWires] = batchGetConnectedWires(state, targets)

  state.registry.move.fromWires = fromWires
  state.registry.move.toWires = toWires

  const targetsWithoutSelfReference = targets.filter((id) => id !== anchor)

  const annotations = Object.values(state.elements).filter(
    (element): element is NodePen.Element<'annotation'> => element.template.type === 'annotation'
  )
  const annotationTargets = annotations
    .filter((annotation) => [...targets, anchor].includes(annotation.template.parent))
    .map((annotation) => annotation.id)

  state.registry.move.elements = [...targetsWithoutSelfReference, ...annotationTargets]
}
