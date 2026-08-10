import React, { useCallback } from 'react'
import type * as NodePen from '@/types'
import { COLORS } from '@/constants'
import { useDispatch } from '@/store'
import { usePageSpaceToOverlaySpace } from '@/hooks'

type DocumentControlsValueListProps = {
    nodeInstanceId: string
    config: NodePen.ValueListConfig
}

export const DocumentControlsValueList = ({ nodeInstanceId, config }: DocumentControlsValueListProps) => {
    const { apply } = useDispatch()
    const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

    const currentLabel = config.items.find((item) => item.isSelected)?.name ?? ''

    const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (e.button !== 0) {
            return
        }

        e.stopPropagation()

        const { pageX, pageY } = e
        const key = `value-list-options-context-menu-${nodeInstanceId}`

        const [x, y] = pageSpaceToOverlaySpace(pageX + 6, pageY + 6)

        apply((state) => {
            state.registry.contextMenus[key] = {
                position: { x, y },
                context: {
                    type: 'value-list-options',
                    nodeInstanceId,
                }
            }
        })
    }, [apply, pageSpaceToOverlaySpace, nodeInstanceId])

    return (
        <div
            className="np-w-full np-h-5 np-pl-1 np-pr-2 np-flex np-items-center np-justify-between np-rounded-sm hover:np-bg-grey hover:np-cursor-pointer"
            onClick={handleClick}
        >
            <p className="np-flex-grow np-min-w-0 np-truncate np-text-xs np-text-dark np-font-panel np-select-none">
                {currentLabel}
            </p>
            <svg width="12" height="8" viewBox="0 0 12 8" className="np-flex-shrink-0 np-ml-1 np-mr-0.5">
                <polygon points="0,1.33 12,1.33 6,6.67" fill={COLORS.DARK} stroke={COLORS.DARK} strokeWidth={2} strokeLinejoin="round" />
            </svg>
        </div>
    )
}
