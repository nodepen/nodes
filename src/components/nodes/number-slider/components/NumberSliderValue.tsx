import React, { useCallback, useEffect, useRef, useState } from 'react'
import type * as NodePen from '@/types'
import { useDispatch, useStore } from '$'
import { COLORS, DIMENSIONS } from '@/constants'
import { tryGetSingleValue } from '@/utils/data-trees'
import { useNumberSliderValuePosition } from '@/utils/node-dimensions/getNumberSliderValueExtents'
import { useNodeInternalState } from '../../context/node-state'
import { useIsEditable } from '@/hooks/useIsEditable'

type NumberSliderValueProps = {
    node: NodePen.DocumentNode
    onClick: () => void
}

const {
    NODE_INTERNAL_PADDING,
    NODE_VALUE_FONT_SIZE
} = DIMENSIONS

// TODO: How to handle large number overflow?

export const NumberSliderValue = ({ node, onClick }: NumberSliderValueProps) => {
    const { position } = useNodeInternalState()

    const isEditable = useIsEditable()

    const currentValue = useStore((state) => {
        const currentNode = state.document.nodes[node.instanceId]

        if (!currentNode) {
            return
        }

        const { values, nodeConfiguration } = currentNode

        if (!nodeConfiguration) {
            return
        }

        const value = tryGetSingleValue(values['input'])?.value ?? tryGetSingleValue(values['output'])?.value
        const config = nodeConfiguration as NodePen.NumberSliderConfig

        if (!value) {
            return
        }

        return Number.parseFloat(value).toFixed(config.precision)
    })

    const { x, y, width, height } = useNumberSliderValuePosition(position)

    const start = {
        x: x + NODE_INTERNAL_PADDING,
        y: y + height - NODE_INTERNAL_PADDING * 1.5
    }
    const end = {
        x: start.x + width - NODE_INTERNAL_PADDING * 2,
        y: start.y
    }

    const pathId = `number-slider-value-${node.instanceId}`

    const handlePointerDown = useCallback((e: React.PointerEvent<SVGRectElement>) => {
        if (!isEditable) {
            return
        }

        switch (e.pointerType) {
            case 'mouse': {
                onClick()
                break
            }
            case 'pen':
            case 'touch': {
                break
            }
        }
    }, [isEditable, onClick])

    return <>
        <rect x={x} y={y} width={width} height={height} rx={4} ry={4} stroke={COLORS.DARK} strokeWidth={2} fill={COLORS.LIGHT} />
        <rect x={x} y={y + 1} width={width} height={height} rx={4} ry={4} stroke={COLORS.DARK} strokeWidth={2} fill={COLORS.LIGHT} className={`${isEditable ? 'hover:cursor-pointer hover:np-fill-grey' : ''}`} onPointerDown={handlePointerDown} />
        <path id={pathId} d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`} stroke="none" className='np-pointer-events-none' />
        <text
            className="np-font-panel np-select-none np-pointer-events-none"
            fill={COLORS.DARK}
            fontSize={NODE_VALUE_FONT_SIZE}
        >
            <textPath href={`#${pathId}`} startOffset="50%" textAnchor='middle'>
                {currentValue}
            </textPath>
        </text>
        {/* <line x1={x + 2} y1={y + 1} x2={x + width - 2} y2={y + 1} stroke={COLORS.DARK} strokeWidth={2} /> */}
    </>
}