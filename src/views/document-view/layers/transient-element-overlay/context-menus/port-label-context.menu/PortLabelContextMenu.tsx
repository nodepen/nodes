import { MenuBody, MenuInput } from "../../common"
import type { ContextMenu } from "../../types"
import type { PortLabelContextMenuContext } from "../../types/ContextMenuContext"
import { useDispatch, useStore } from '$'
import { tryGetSingleValue } from "@/utils/data-trees"
import { getDataTreeValueString } from "@/utils/data-trees/getDataTreeValueString"
import { useCallback } from "react"
import { usePortLabel } from "@/hooks/usePortLabel"
import { saveDocument } from "@/store/utils/saveDocument"

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
            node.portConfigurations[portInstanceId].label = val
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