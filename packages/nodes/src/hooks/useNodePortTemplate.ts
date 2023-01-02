import type * as NodePen from '@nodepen/core'
import shallow from 'zustand/shallow'
import { useStore } from '$'

export const useNodePortTemplate = (nodeInstanceId: string, portInstanceId: string): NodePen.PortTemplate | null => {
    const template = useStore((state) => {
        const node = state.document.nodes[nodeInstanceId]

        if (!node) {
            return null
        }

        const nodeTemplate = state.templates[node.templateId]

        if (!nodeTemplate) {
            return null
        }

        const direction = Object.keys(node.inputs).includes(portInstanceId) ? 'input' : Object.keys(node.outputs).includes(portInstanceId) ? 'output' : null

        if (!direction) {
            return null
        }

        const portTemplate = direction === 'input' ? nodeTemplate.inputs[node.inputs[portInstanceId]] : nodeTemplate.outputs[node.outputs[portInstanceId]]

        if (!portTemplate) {
            return null
        }

        return portTemplate
    }, shallow)

    return template
}