import { MenuBody, MenuInput } from "../../common"
import type { ContextMenu } from "../../types"
import type { PortValueContextMenuContext } from "../../types/ContextMenuContext"
import { useDispatch, useStore } from '$'
import { tryGetSingleValue } from "@/utils/data-trees"
import { getDataTreeValueString } from "@/utils/data-trees/getDataTreeValueString"
import { useCallback } from "react"
import { createSingleValue } from "@/utils/data-trees/createSingleValue"
import type * as NodePen from '@/types'
import { expireSolution } from "@/store/utils"

type PortValueContextMenuProps = {
    position: ContextMenu['position']
    context: PortValueContextMenuContext
}

export const PortValueContextMenu = ({ position, context }: PortValueContextMenuProps) => {
    const { nodeInstanceId, portInstanceId, valueType } = context

    const { apply, clearInterface } = useDispatch()

    const node = useStore.getState().document.nodes[nodeInstanceId]

    const handleSubmit = useCallback((val: string) => {
        apply((state) => {
            const node = state.document.nodes[nodeInstanceId]

            if (!node) {
                return
            }

            node.values[portInstanceId] = createSingleValue(val, valueType as NodePen.DataTreeValueType)
            expireSolution(state)
        })
        clearInterface()
    }, [])

    if (!node) {
        return null
    }

    const initialDataTree = node.values[portInstanceId]
    const initialSingleValue = tryGetSingleValue(initialDataTree)
    const initialValue = getDataTreeValueString(initialSingleValue)

    return (
        <MenuBody position={position} animate={false}>
            <MenuInput valueType={valueType} initialValue={initialValue} onSubmit={handleSubmit} />
        </MenuBody>
    )
}