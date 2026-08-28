import React, { useCallback, type ReactElement } from "react"
import type * as NodePen from '@/types'
import type { ContextMenu } from "../../types"
import type { NumberSliderValueContextMenuContext } from "../../types/ContextMenuContext"
import { useDispatch, useStore } from '$'
import { tryGetSingleValue } from "@/utils/data-trees"
import { usePageSpaceToOverlaySpace, useWorldSpaceToPageSpace } from "@/hooks"
import { DIMENSIONS } from "@/constants"
import { createSingleValue } from "@/utils/data-trees/createSingleValue"
import { clamp } from "@/utils"
import { expireSolution } from "@/store/utils"
import { getDomainParameter } from "@/utils/numerics/domain"

const { INTERACTION_BUFFER } = DIMENSIONS

type ContextMenuProps = {
    context: NumberSliderValueContextMenuContext
}

const NumberSliderContextMenu = ({ context }: ContextMenuProps) => {
    const worldSpaceToPageSpace = useWorldSpaceToPageSpace()

    const { apply } = useDispatch()

    const ref = useStore((state) => state.registry.numberSliderInputRef)

    const zoom = useStore((state) => state.camera.zoom)
    const slider = useStore((state) => state.document.nodes[context.nodeInstanceId])

    if (!slider) {
        return null
    }

    const { x, y } = slider.position
    const { width, height } = slider.dimensions
    const { min, max, precision } = slider.nodeConfiguration as NodePen.NumberSliderConfig

    const currentValue = tryGetSingleValue(slider.values['input'])?.value ?? tryGetSingleValue(slider.values['output'])?.value
    const t = getDomainParameter([min, max], Number.parseFloat(currentValue ?? '0'))

    const topLeft = {
        x: x - INTERACTION_BUFFER,
        y: y - INTERACTION_BUFFER
    }

    const topRight = {
        x: x + width + INTERACTION_BUFFER,
        y: y - INTERACTION_BUFFER
    }

    const center = {
        x: x + ((width - (2 * INTERACTION_BUFFER)) * t) + (INTERACTION_BUFFER),
        y: y + height / 2
    }

    const bottomRight = {
        x: x + width + INTERACTION_BUFFER,
        y: y + height + INTERACTION_BUFFER
    }

    const [outerLeft, outerTop] = worldSpaceToPageSpace(topLeft.x, topLeft.y)
    const [outerRight] = worldSpaceToPageSpace(topRight.x, topRight.y)
    const [, outerBottom] = worldSpaceToPageSpace(bottomRight.x, bottomRight.y)

    const outerWidth = outerRight - outerLeft
    const outerHeight = outerBottom - outerTop

    const [anchorX, anchorY] = worldSpaceToPageSpace(center.x, center.y)

    const innerWidth = 150
    const innerHeight = 48

    const offsetTop = 48 * zoom

    const innerLeft = anchorX - outerLeft - innerWidth / 2
    const innerTop = anchorY - outerTop - offsetTop - innerHeight / 2

    const inputEl = ref.current
    if (inputEl && currentValue) {
        inputEl.value = currentValue
    }

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        e.currentTarget.select()
    }, [])

    const commitValue = useCallback((newValue: string) => {
        const numericValue = Number.parseFloat(newValue)

        // Invalid number
        if (inputEl && currentValue && Number.isNaN(numericValue)) {
            inputEl.value = currentValue
            return
        }

        // Valid number
        apply((state) => {
            const node = state.document.nodes[context.nodeInstanceId]

            if (!node) {
                return
            }

            node.values['input'] = createSingleValue(clamp(numericValue, min, max).toFixed(precision), 'number')
            expireSolution(state)
        })
    }, [currentValue, min, max, precision])

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key.toLowerCase() !== 'enter') {
            return
        }
        commitValue(e.currentTarget.value)
    }, [commitValue])

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        commitValue(e.currentTarget.value)
    }, [commitValue])

    return (
        <div className="np-absolute np-z-50 np-overflow-visible"
            style={{ pointerEvents: 'none', width: `${outerWidth}px`, height: `${outerHeight}px`, left: outerLeft, top: outerTop }}
        >
            <div className="np-w-full np-h-full np-relative">
                <div className="np-absolute" style={{ width: `${innerWidth}px`, height: `${innerHeight}px`, left: innerLeft, top: innerTop }}>
                    <div className="np-w-full np-h-full np-flex np-flex-col np-justify-end np-items-center">
                        <div className="np-h-8 np-p-2 np-rounded-md np-bg-green np-flex np-items-center np-justify-center">
                            <input ref={ref} className="np-text-sm np-font-semibold np-text-darkgreen np-text-center np-pointer-events-auto np-rounded-sm hover:np-bg-swampgreen" size={currentValue?.toString().length || 1} defaultValue={currentValue} onFocus={handleFocus} onKeyDown={handleKeyDown} onBlur={handleBlur} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(NumberSliderContextMenu)