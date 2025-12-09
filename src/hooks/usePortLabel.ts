import { useStore } from '$'
import { getPortDirection } from '@/utils/ports/getPortDirection'
import { getNodeTypeForTemplate } from '@/utils/templates/getNodeTypeForTemplate'
import { shallow } from 'zustand/shallow'

export const usePortLabel = (nodeInstanceId: string, portInstanceId: string): { currentLabel: string, defaultLabel: string } => {
  return useStore((state) => {
    const node = state.document.nodes[nodeInstanceId]
    const template = state.templates[node.templateId]

    const nodeType = getNodeTypeForTemplate(template)
    const direction = getPortDirection(node, portInstanceId)

    const defaultLabel = nodeType === 'generic-parameter' ? template.name : template[`${direction}s`][node[`${direction}s`][portInstanceId]].nickName
    const customLabel = node.portConfigurations[portInstanceId]?.label

    return {
      defaultLabel,
      currentLabel: customLabel ?? defaultLabel
    }
  })
}