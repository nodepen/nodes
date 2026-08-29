import React, { useCallback, useState } from 'react'
import type { ContextMenu } from '../../types'
import type { ColorParameterContextMenuContext } from '../../types/ContextMenuContext'
import { MenuBody } from '../../common'
import { PickColorButton } from '../color-swatch-context-menu/buttons'
import { PinButton } from '../port-context-menu/buttons'
import { useDispatch, useStore } from '$'
import { Dialog, ColorPicker } from '@/views/components'
import { createSingleValue, tryGetSingleValue } from '@/utils/data-trees'
import { colorValueStringToRgb, rgbToColorValueString, type RGB } from '@/utils/color'
import { expireSolution } from '@/store/utils'

type ColorParameterContextMenuProps = {
    position: ContextMenu['position']
    context: ColorParameterContextMenuContext
}

// Matches the Color Swatch's own default.
const DEFAULT_COLOR: RGB = { r: 243, g: 149, b: 50 }

const ColorParameterContextMenu = ({ position, context }: ColorParameterContextMenuProps) => {
    const { nodeInstanceId, portInstanceId } = context

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

    const handleSubmit = useCallback((value: RGB) => {
        apply((state) => {
            const targetNode = state.document.nodes[nodeInstanceId]

            if (!targetNode) {
                return
            }

            targetNode.values[portInstanceId] = createSingleValue(rgbToColorValueString(value), 'color')
            expireSolution(state)
        })
        handleCloseDialog()
    }, [apply, nodeInstanceId, portInstanceId, handleCloseDialog])

    if (!node) {
        return null
    }

    const currentValue = tryGetSingleValue(node.values[portInstanceId])
    const currentColor = (currentValue?.value ? colorValueStringToRgb(currentValue.value) : null) ?? DEFAULT_COLOR

    return (
        <>
            {!showColorPicker ? (
                <MenuBody position={position}>
                    <PinButton nodeInstanceId={nodeInstanceId} portInstanceId={portInstanceId} />
                    <PickColorButton onClick={handlePickColorClick} />
                </MenuBody>
            ) : null}
            {showColorPicker ? (
                <Dialog onClose={handleCloseDialog}>
                    <ColorPicker value={currentColor} onSubmit={handleSubmit} onClose={handleCloseDialog} />
                </Dialog>
            ) : null}
        </>
    )
}

export default React.memo(ColorParameterContextMenu)
