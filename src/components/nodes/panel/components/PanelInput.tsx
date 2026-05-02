import type * as NodePen from '@/types'
import { useStore } from '$'
import { COLORS, DIMENSIONS } from '@/constants'
import React, { useCallback, useEffect, useRef, useState } from 'react'

const {
    NODE_INTERNAL_PADDING
} = DIMENSIONS

type PanelInputProps = {
    node: NodePen.DocumentNode
    isActive: boolean
    onSubmit: (value: string) => void
}

export const PanelInput = ({ node, isActive, onSubmit }: PanelInputProps) => {
    const { position, dimensions } = node
    const { textContent, multilineData } = node.nodeConfiguration as NodePen.PanelConfig

    const isSelected = useStore((state) => state.registry.selection.nodes.includes(node.instanceId))

    const inputRef = useRef<HTMLTextAreaElement | null>(null)

    useEffect(() => {
        if (isActive) {
            inputRef.current?.focus?.()
            inputRef.current?.select?.()
        }
    }, [isActive])

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        switch (e.key.toLowerCase()) {
            case 'backspace':
            case 'del':
            case 'delete': {
                e.stopPropagation()
                e.nativeEvent.stopImmediatePropagation()
                break
            }
            case 'enter': {
                if (e.shiftKey) {
                    return
                }
                e.currentTarget.blur()
                break
            }
            case 'escape': {
                e.currentTarget.blur()
                break
            }
        }
    }, [])

    const x = position.x + NODE_INTERNAL_PADDING * 2
    const y = position.y + NODE_INTERNAL_PADDING * 2
    const width = dimensions.width - NODE_INTERNAL_PADDING * 4
    const height = dimensions.height - NODE_INTERNAL_PADDING * 4

    return isActive
        ? (
            <>
                <foreignObject
                    x={x}
                    y={y}
                    width={width}
                    height={height}>
                    <textarea ref={inputRef} xmlns="http://www.w3.org/1999/xhtml"
                        className='np-w-full np-h-full np-overflow-hidden np-border-none focus:np-outline-none np-text-sm np-text-center np-font-panel'
                        style={{ resize: 'none', background: 'transparent' }}
                        defaultValue={textContent ?? ''}
                        onKeyDown={handleKeyDown}
                        onBlur={(e) => onSubmit(e.currentTarget.value)} />
                </foreignObject>
            </>
        )
        : (
            <>
                <rect
                    className={`${isSelected ? 'hover:np-fill-swampgreen' : 'hover:np-fill-grey'} np-fill-none hover:np-cursor-pointer`}
                    style={{ pointerEvents: 'all' }}
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    rx={4}
                    ry={4}
                />
                <foreignObject
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    className='np-pointer-events-none'>
                    <textarea ref={inputRef} xmlns="http://www.w3.org/1999/xhtml"
                        className='np-w-full np-h-full np-overflow-hidden np-border-none np-pointer-events-none np-text-sm np-text-center np-font-panel'
                        style={{ resize: 'none', background: 'transparent' }}
                        value={textContent ?? ''}
                        readOnly />
                </foreignObject>
            </>
        )

}