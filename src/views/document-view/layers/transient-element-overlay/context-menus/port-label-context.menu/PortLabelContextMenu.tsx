import { MenuBody, MenuInput } from "../../common"
import type { ContextMenu } from "../../types"
import type { PortLabelContextMenuContext } from "../../types/ContextMenuContext"
import { useDispatch, useStore } from '$'
import { useCallback } from "react"
import { usePortLabel } from "@/hooks/usePortLabel"
import { saveDocument } from "@/store/utils/saveDocument"
import { tryGetTemplate } from "@/utils/templates/tryGetTemplate"
import { getNodeTypeForTemplate } from "@/utils/templates/getNodeTypeForTemplate"
import { getNodeDimensions } from "@/utils/node-dimensions"

type PortLabelContextMenuProps = {
    position: ContextMenu['position']
    context: PortLabelContextMenuContext
}

export const PortLabelContextMenu = ({ position, context }: PortLabelContextMenuProps) => {
    const { nodeInstanceId, portInstanceId } = context

    const { apply, clearInterface } = useDispatch()

    const node = useStore((state) => state.document.nodes[nodeInstanceId])

    const { currentLabel } = usePortLabel(nodeInstanceId, portInstanceId)

    const handleSubmit = useCallback((val: string) => {
        apply((state) => {
            const node = state.document.nodes[nodeInstanceId]

            if (!node) {
                return
            }

            node.portConfigurations[portInstanceId] ??= {
                label: null,
                flags: []
            }

            // Clearing the label restores the default
            node.portConfigurations[portInstanceId].label = val.trim().length > 0 ? val : null

            // Generic component widths depend on port label lengths
            const template = tryGetTemplate(node.templateId)

            const nodeType = template ? getNodeTypeForTemplate(template) : 'unknown'

            if (template && (nodeType === 'generic-node' || nodeType === 'expression')) {
                const { anchors, dimensions } = getNodeDimensions(node, template, state.ui.preferences)

                node.anchors = { ...node.anchors, ...anchors }
                node.dimensions = { ...node.dimensions, ...dimensions }
            }

            saveDocument(state)
        })
        clearInterface()
    }, [])

    if (!node) {
        return null
    }

    return (
        <MenuBody position={position} animate={false}>
            <MenuInput valueType={'string'} initialValue={currentLabel} onSubmit={handleSubmit} />
        </MenuBody>
    )
}
