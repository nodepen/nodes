import React, { useCallback, useState } from 'react'
import type * as NodePen from '@/types'
import type { ContextMenu } from '../../types'
import type { GradientContextMenuContext } from '../../types/ContextMenuContext'
import { MenuBody } from '../../common'
import { EditGradientButton } from './buttons'
import { useDispatch, useStore } from '$'
import { Dialog, GradientEditor } from '@/views/components'

type GradientContextMenuProps = {
    position: ContextMenu['position']
    context: GradientContextMenuContext
}

const GradientContextMenu = ({ position, context }: GradientContextMenuProps) => {
    const { nodeInstanceId } = context

    const { clearInterface } = useDispatch()

    const node = useStore((state) => state.document.nodes[nodeInstanceId])

    const [showEditor, setShowEditor] = useState(false)

    const handleEditGradientClick = useCallback(() => {
        setShowEditor(true)
    }, [])

    const handleCloseEditor = useCallback(() => {
        setShowEditor(false)
        clearInterface()
    }, [clearInterface])

    if (!node) {
        return null
    }

    const config = node.nodeConfiguration as NodePen.GradientConfig

    return (
        <>
            {!showEditor ? (
                <MenuBody position={position}>
                    <EditGradientButton onClick={handleEditGradientClick} />
                </MenuBody>
            ) : null}
            {showEditor ? (
                <Dialog onClose={handleCloseEditor}>
                    <GradientEditor config={config} onClose={handleCloseEditor} />
                </Dialog>
            ) : null}
        </>
    )
}

export default React.memo(GradientContextMenu)
