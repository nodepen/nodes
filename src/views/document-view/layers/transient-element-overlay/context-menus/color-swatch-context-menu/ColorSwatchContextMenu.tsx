import React, { useCallback, useState } from 'react'
import type * as NodePen from '@/types'
import type { ContextMenu } from '../../types'
import type { ColorSwatchContextMenuContext } from '../../types/ContextMenuContext'
import { MenuBody } from '../../common'
import { PickColorButton } from './buttons'
import { PinButton } from '../port-context-menu/buttons'
import { useDispatch, useStore } from '$'
import { Dialog, ColorPicker } from '@/views/components'
import { expireSolution } from '@/store/utils'
import type { RGB } from '@/utils/color'

type ColorSwatchContextMenuProps = {
    position: ContextMenu['position']
    context: ColorSwatchContextMenuContext
}

const ColorSwatchContextMenu = ({ position, context }: ColorSwatchContextMenuProps) => {
    const { nodeInstanceId } = context

    const { apply, clearInterface } = useDispatch()

    const node = useStore((state) => state.document.nodes[nodeInstanceId])

    const [showColorPicker, setShowColorPicker] = useState(false)

    const handlePickColorClick = useCallback(() => {
        setShowColorPicker(true)
    }, [])

    const handleCloseDialog = useCallback(() => {
        setShowColorPicker(false)
        clearInterface()
    }, [clearInterface])

    const handleSubmitColor = useCallback((value: RGB) => {
        apply((state) => {
            const config = state.document.nodes[nodeInstanceId]?.nodeConfiguration as NodePen.ColorSwatchConfig | undefined

            if (!config) {
                console.log(`🐍 Could not find config for color swatch ${nodeInstanceId}`)
                return
            }

            config.r = value.r
            config.g = value.g
            config.b = value.b

            expireSolution(state)
        })
        handleCloseDialog()
    }, [nodeInstanceId, handleCloseDialog])

    if (!node) {
        return null
    }

    const config = node.nodeConfiguration as NodePen.ColorSwatchConfig

    return (
        <>
            {!showColorPicker ? (
                <MenuBody position={position}>
                    <PinButton nodeInstanceId={nodeInstanceId} portInstanceId="input" />
                    <PickColorButton onClick={handlePickColorClick} />
                </MenuBody>
            ) : null}
            {showColorPicker ? (
                <Dialog onClose={handleCloseDialog}>
                    <ColorPicker value={{ r: config.r, g: config.g, b: config.b }} onSubmit={handleSubmitColor} onClose={handleCloseDialog} />
                </Dialog>
            ) : null}
        </>
    )
}

export default React.memo(ColorSwatchContextMenu)
