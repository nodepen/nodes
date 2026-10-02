import { useStore } from '$'
import { getNodeTypeForTemplate } from '@/utils/templates/getNodeTypeForTemplate'
import { usePortTemplate } from './usePortTemplate'

export const usePortLabel = (nodeInstanceId: string, portInstanceId: string): { currentLabel: string, defaultLabel: string, currentDescription: string, defaultDescription: string } => {
    const portTemplate = usePortTemplate(nodeInstanceId, portInstanceId)

    return useStore((state) => {
        const node = state.document.nodes[nodeInstanceId]

        if (!node) {
            return {
                defaultLabel: '',
                currentLabel: '',
                defaultDescription: '',
                currentDescription: ''
            }
        }

        const customLabel = node.portConfigurations[portInstanceId]?.label
        const customDescription = node.portConfigurations[portInstanceId]?.description

        const template = state.templates[node.templateId]

        // i.e. clusters with templateId 'cluster'
        if (!template) {
            return {
                defaultLabel: '',
                currentLabel: customLabel ?? '',
                defaultDescription: '',
                currentDescription: customDescription ?? ''
            }
        }

        const nodeType = getNodeTypeForTemplate(template)

        const defaultLabel = nodeType === 'generic-parameter' ? template.name : portTemplate?.name ?? template.name
        const defaultDescription = portTemplate?.description ?? template.description

        return {
            defaultLabel,
            currentLabel: customLabel ?? defaultLabel,
            defaultDescription,
            currentDescription: customDescription ?? defaultDescription
        }
    })
}
