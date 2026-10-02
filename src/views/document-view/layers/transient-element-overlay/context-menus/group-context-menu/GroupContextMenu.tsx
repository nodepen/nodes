import React, { useCallback, useState } from 'react'
import type { ContextMenu } from '../../types'
import type { GroupContextMenuContext } from '../../types/ContextMenuContext'
import { MenuBody, MenuDivider } from '../../common'
import { PickColorButton } from '../color-swatch-context-menu/buttons'
import { SelectGroupButton, UngroupButton, AddToGroupButton, RemoveFromGroupButton } from './buttons'
import { useDispatch, useStore } from '$'
import { Dialog, ColorPicker } from '@/views/components'
import { saveDocument } from '@/store/utils/saveDocument'
import { COLORS } from '@/constants'
import { hexToRgb, rgbToHex, type RGB } from '@/utils/color'

type GroupContextMenuProps = {
    position: ContextMenu['position']
    context: GroupContextMenuContext
}

// Matches the group's own default (see `Ctrl+G` in useGlobalHotkeys).
const DEFAULT_COLOR: RGB = hexToRgb(COLORS.DARK) ?? { r: 0, g: 0, b: 0 }

const GroupContextMenu = ({ position, context }: GroupContextMenuProps) => {
    const { groupId } = context

    const { apply, clearInterface } = useDispatch()

    const group = useStore((state) => state.document.groups[groupId])

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
            const targetGroup = state.document.groups[groupId]

            if (!targetGroup) {
                console.log(`🐍 Could not find group ${groupId} to set color`)
                return
            }

            targetGroup.color = rgbToHex(value)

            // Cosmetic-only change, no need to expire the solution -- just save.
            saveDocument(state)
        })
        handleCloseDialog()
    }, [groupId, handleCloseDialog])

    if (!group) {
        return null
    }

    const currentColor = hexToRgb(group.color) ?? DEFAULT_COLOR

    return (
        <>
            {!showColorPicker ? (
                <MenuBody position={position}>
                    <SelectGroupButton groupId={groupId} />
                    <MenuDivider />
                    <UngroupButton groupId={groupId} />
                    <AddToGroupButton groupId={groupId} />
                    <RemoveFromGroupButton groupId={groupId} />
                    <MenuDivider />
                    <PickColorButton onClick={handlePickColorClick} />
                </MenuBody>
            ) : null}
            {showColorPicker ? (
                <Dialog onClose={handleCloseDialog}>
                    <ColorPicker value={currentColor} onSubmit={handleSubmitColor} onClose={handleCloseDialog} />
                </Dialog>
            ) : null}
        </>
    )
}

export default React.memo(GroupContextMenu)
