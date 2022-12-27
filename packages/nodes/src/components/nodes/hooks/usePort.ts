import { useMemo } from 'react'
import type * as NodePen from '@nodepen/core'
import { useStore } from '$'
import { useNodeAnchorPosition } from '@/hooks'

type PortInfo = {
    direction: 'input' | 'output'
    position: {
        x: number
        y: number
    }
    template: NodePen.PortTemplate
}

export const usePort = (nodeInstanceId: string, portInstanceId: string): PortInfo | null => {
    const position = useNodeAnchorPosition(nodeInstanceId, portInstanceId)

    const { direction, template } = useMemo((): Partial<PortInfo> => {
        const node = useStore.getState().document.nodes[nodeInstanceId]

        if (!node) {
            return {}
        }

        const nodeTemplate = useStore.getState().templates[node.templateId]

        if (!nodeTemplate) {
            return {}
        }

        const direction = Object.keys(node.inputs).includes(portInstanceId) ? 'input' : Object.keys(node.outputs).includes(portInstanceId) ? 'output' : null

        if (!direction) {
            return {}
        }

        const portTemplate = direction === 'input' ? nodeTemplate.inputs[node.inputs[portInstanceId]] : nodeTemplate.outputs[node.outputs[portInstanceId]]

        if (!portTemplate) {
            return {}
        }

        return { direction, template }
    }, [nodeInstanceId, portInstanceId])

    if (!direction || !position || !template) {
        return null
    }

    return { direction, position, template }
}