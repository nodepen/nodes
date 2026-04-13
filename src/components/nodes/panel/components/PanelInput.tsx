import type * as NodePen from '@/types'
import { useStore } from '$'
import { COLORS, DIMENSIONS } from '@/constants'
import React, { useCallback, useEffect, useRef, useState } from 'react'

const {
    NODE_INTERNAL_PADDING
} = DIMENSIONS

type PanelInputProps = {
    node: NodePen.DocumentNode
}

export const PanelInput = ({ node }: PanelInputProps) => {
    const { position, dimensions } = node

    const { textContent, dataAccess } = node.nodeConfiguration as NodePen.PanelConfig

    const inputRef = useRef<HTMLTextAreaElement | null>(null)

    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        if (isActive) {
            inputRef.current?.focus?.()
        }
    }, [isActive])

    const x = position.x + NODE_INTERNAL_PADDING * 2
    const y = position.y + NODE_INTERNAL_PADDING * 2
    const width = dimensions.width - NODE_INTERNAL_PADDING * 4
    const height = dimensions.height - NODE_INTERNAL_PADDING * 4

    const handlePointerDown = useCallback((e: React.PointerEvent<SVGRectElement>) => {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
    }, [])

    const handlePointerUp = useCallback((e: React.PointerEvent<SVGRectElement>) => {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
    }, [])

    const handleClick = useCallback((e: React.MouseEvent<SVGRectElement>) => {
        setIsActive(true)
    }, [])

    return isActive
        ? (
            <>
                <foreignObject
                    x={x}
                    y={y}
                    width={width}
                    height={height}>
                    <textarea ref={inputRef} xmlns="http://www.w3.org/1999/xhtml"
                        className='np-w-full np-h-full np-overflow-hidden np-border-none'
                        style={{ resize: 'none', background: 'transparent' }}
                    // onBlur={() => setIsActive(false)}
                    />
                </foreignObject>
            </>
        )
        : (
            <>
                <rect
                    className='np-fill-light hover:np-fill-grey hover:np-cursor-pointer'
                    style={{ pointerEvents: 'all' }}
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    rx={4}
                    ry={4}
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onClick={handleClick}
                />
            </>
        )

}