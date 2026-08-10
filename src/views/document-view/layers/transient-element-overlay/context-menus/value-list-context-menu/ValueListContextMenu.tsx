import React, { useCallback, useState } from 'react'
import type * as NodePen from '@/types'
import type { ContextMenu } from '../../types'
import type { ValueListContextMenuContext } from '../../types/ContextMenuContext'
import { MenuBody, MenuHeader } from '../../common'
import { EditOptionsButton } from './buttons'
import { useDispatch, useStore } from '$'
import { getIconAsImage } from '@/utils/templates'
import { Dialog } from '@/views/components'
import { ValueListOptionsForm } from '@/components/nodes/value-list/forms/ValueListOptionsForm'
import { PinButton } from '../port-context-menu/buttons'

type ValueListContextMenuProps = {
    position: ContextMenu['position']
    context: ValueListContextMenuContext
}

const ValueListContextMenu = ({ position, context }: ValueListContextMenuProps) => {
    const { nodeInstanceId } = context

    const { clearInterface } = useDispatch()

    const node = useStore((state) => state.document.nodes[nodeInstanceId])

    const [showEditDialog, setShowEditDialog] = useState(false)

    const handleEditOptionsClick = useCallback(() => {
        setShowEditDialog(true)
    }, [])

    const handleCloseDialog = useCallback(() => {
        setShowEditDialog(false)
        clearInterface()
    }, [clearInterface])

    return (
        <>
            {!showEditDialog ? (
                <MenuBody position={position}>
                    <PinButton nodeInstanceId={nodeInstanceId} portInstanceId="input" />
                    <EditOptionsButton onClick={handleEditOptionsClick} />
                </MenuBody>
            ) : null}
            {showEditDialog ? (
                <Dialog onClose={handleCloseDialog}>
                    <ValueListOptionsForm node={node} config={node.nodeConfiguration as NodePen.ValueListConfig} onClose={handleCloseDialog} />
                </Dialog>
            ) : null}
        </>
    )
}

export default React.memo(ValueListContextMenu)
