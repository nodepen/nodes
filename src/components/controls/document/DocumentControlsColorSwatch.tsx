import React, { useCallback, useState } from 'react'
import type * as NodePen from '@/types'
import { COLORS } from '@/constants'
import { useDispatch } from '@/store'
import { expireSolution } from '@/store/utils'
import { Dialog, ColorPicker } from '@/views/components'
import { rgbToHex, type RGB } from '@/utils/color'

type DocumentControlsColorSwatchProps = {
    nodeInstanceId: string
    config: NodePen.ColorSwatchConfig
    isDisabled?: boolean
}

export const DocumentControlsColorSwatch = ({ nodeInstanceId, config, isDisabled }: DocumentControlsColorSwatchProps) => {
    const { apply } = useDispatch()

    const [showColorPicker, setShowColorPicker] = useState(false)

    const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (isDisabled) {
            return
        }

        if (e.button !== 0) {
            return
        }

        e.stopPropagation()

        setShowColorPicker(true)
    }, [isDisabled])

    const handleClose = useCallback(() => {
        setShowColorPicker(false)
    }, [])

    const handleSubmit = useCallback((value: RGB) => {
        apply((state) => {
            const nextConfig = state.document.nodes[nodeInstanceId]?.nodeConfiguration as NodePen.ColorSwatchConfig | undefined

            if (!nextConfig) {
                console.log(`🐍 Could not find config for color swatch ${nodeInstanceId}`)
                return
            }

            nextConfig.r = value.r
            nextConfig.g = value.g
            nextConfig.b = value.b

            expireSolution(state)
        })
        setShowColorPicker(false)
    }, [apply, nodeInstanceId])

    return (
        <>
            <div
                className={`np-w-full np-h-5 np-pl-1 np-pr-2 np-flex np-items-center np-rounded-sm ${isDisabled ? '' : 'hover:np-bg-grey hover:np-cursor-pointer'}`}
                onClick={handleClick}
            >
                <div
                    className="np-w-3 np-h-3 np-mr-1 np-flex-shrink-0 np-rounded-full"
                    style={{ background: `rgb(${config.r}, ${config.g}, ${config.b})` }}
                />
                <p className={`np-pt-0.5 np-min-w-0 np-truncate np-text-xs np-font-panel np-select-none ${isDisabled ? 'np-text-grey-3' : 'np-text-dark'}`}>
                    {rgbToHex(config)}
                </p>

            </div>
            {showColorPicker ? (
                <Dialog onClose={handleClose}>
                    <ColorPicker value={{ r: config.r, g: config.g, b: config.b }} onSubmit={handleSubmit} onClose={handleClose} />
                </Dialog>
            ) : null}
        </>
    )
}
