import type * as NodePen from '@/types'
import { shallow } from 'zustand/shallow'
import { useStore } from '$'
import { getPortTemplateFromConfiguration } from '@/utils/ports/getPortTemplateFromConfiguration'

export const useNodePortTemplate = (nodeInstanceId: string, portInstanceId: string): NodePen.PortTemplate | null => {
    const template = useStore((state) => {
        const node = state.document.nodes[nodeInstanceId]

        if (!node) {
            return null
        }

        const nodeTemplate = state.templates[node.templateId]

        if (!nodeTemplate) {
            const direction = Object.keys(node.inputs).includes(portInstanceId)
                ? 'input'
                : Object.keys(node.outputs).includes(portInstanceId)
                    ? 'output'
                    : null

            return direction ? getPortTemplateFromConfiguration(node, portInstanceId, direction) : null
        }

        const direction = Object.keys(node.inputs).includes(portInstanceId)
            ? 'input'
            : Object.keys(node.outputs).includes(portInstanceId)
                ? 'output'
                : null

        if (!direction) {
            return null
        }

        const portTemplate =
            direction === 'input'
                ? nodeTemplate.inputs[node.inputs[portInstanceId]]
                : nodeTemplate.outputs[node.outputs[portInstanceId]]

        if (!portTemplate) {
            return null
        }

        return portTemplate
    }, shallow)

    return template
}
