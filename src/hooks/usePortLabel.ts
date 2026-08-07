import { useStore } from '$'
import { getNodeTypeForTemplate } from '@/utils/templates/getNodeTypeForTemplate'
import { usePortTemplate } from './usePortTemplate'

export const usePortLabel = (nodeInstanceId: string, portInstanceId: string): { currentLabel: string, defaultLabel: string } => {
    const portTemplate = usePortTemplate(nodeInstanceId, portInstanceId)

    return useStore((state) => {
        const node = state.document.nodes[nodeInstanceId]
        const template = state.templates[node.templateId]

        const nodeType = getNodeTypeForTemplate(template)

        const defaultLabel = nodeType === 'generic-parameter' ? template.name : portTemplate?.name ?? template.name
        const customLabel = node.portConfigurations[portInstanceId]?.label

        return {
            defaultLabel,
            currentLabel: customLabel ?? defaultLabel
        }
    })
}
