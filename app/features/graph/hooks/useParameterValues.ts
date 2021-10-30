import { NodePen, assert } from 'glib'
import { useGraphElements } from '../store/graph/hooks'
import { useSolutionValues } from '../store/solution/hooks'
import { flattenDataTree, getParameterType, isInputOrOutput } from '../utils'

export const useParameterValues = (
  elementId: string,
  parameterId: string
): [tree: NodePen.DataTree | undefined, details: string] => {
  const elements = useGraphElements()
  const values = useSolutionValues()

  const element = elements[elementId] as NodePen.Element<'static-component' | 'static-parameter' | 'number-slider'>

  if (!element) {
    return [undefined, '']
  }

  const graphElements: NodePen.ElementType[] = ['static-component', 'static-parameter', 'number-slider', 'panel']

  const { template, current } = element

  if (!graphElements.includes(template.type)) {
    return [undefined, '']
  }

  if (!assert.element.isGraphElement(current)) {
    return [undefined, '']
  }

  const tree: NodePen.DataTree | undefined = values?.[elementId]?.[parameterId] ?? current?.values?.[parameterId]
  const type = getParameterType(element, parameterId)?.toLowerCase() ?? ''
  const mode = isInputOrOutput(element, parameterId)

  const flat = flattenDataTree(tree)
  const valueOrValues = flat.length === 1 ? 'value' : 'values'

  const sources = element.current.sources[parameterId] ?? []
  const sourceOrSources = sources.length === 1 ? 'source' : 'sources'

  if (!tree || flat.length === 0) {
    return [tree, `Empty ${type} parameter`]
  }

  if (mode === 'output' || sources.length === 0) {
    return [tree, `${flat.length} locally defined ${valueOrValues}...`]
  }

  return [tree, `${flat.length} ${valueOrValues} inherited from ${sources.length} ${sourceOrSources}...`]
}
