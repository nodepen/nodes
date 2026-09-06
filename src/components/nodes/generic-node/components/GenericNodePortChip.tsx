import type * as NodePen from '@/types'
import { useNodeInternalState } from '../../context/node-state'
import { useDispatch, useStore } from '@/store'
import { useNodeContextAnchorPosition } from '@/hooks'
import { COLORS, DIMENSIONS } from '@/constants'
import React, { useCallback } from 'react'

const { NODE_PORT_HEIGHT, NODE_LABEL_WIDTH, NODE_PORT_CHIP_SIZE, NODE_INTERNAL_PADDING } = DIMENSIONS

type GenericNodePortChipProps = {
    nodeInstanceId: string
    portInstanceId: string
    portDirection: "input" | "output"
    portOperation: "add" | "remove"
    isLast?: boolean
}

export const GenericNodePortChip = ({ nodeInstanceId, portInstanceId, portDirection, portOperation, isLast }: GenericNodePortChipProps) => {
    const { position } = useNodeInternalState()

    const { addParameter, removeParameter } = useDispatch()

    const portAnchor = useNodeContextAnchorPosition(nodeInstanceId, portInstanceId)
    const cx = useStore((state) => state.document.nodes[nodeInstanceId].anchors.labelDeltaX.dx)
    const cy = portAnchor?.y ?? 0

    const xOffset = (NODE_LABEL_WIDTH / 2) + NODE_INTERNAL_PADDING + (portDirection === 'input' ? NODE_PORT_CHIP_SIZE : 0)
    const dx = xOffset * (portDirection === 'output' ? 1 : -1)
    const dy = portOperation === 'add' ? (NODE_PORT_HEIGHT / (2 * (isLast ? 1 : -1))) - (NODE_PORT_CHIP_SIZE / 2) : (NODE_PORT_CHIP_SIZE / -2)

    const portIndex = useStore((state) => (state.document.nodes[nodeInstanceId]?.[`${portDirection}s`]?.[portInstanceId] ?? -2) + (isLast ? 1 : 0))
    const isEnabled = useStore((state) => {
        if (state.solution.flags.isExpired) {
            // Do not show ZUI chips when solution is expired
            return false
        }

        if (state.camera.zoom < 3) {
            return false
        }

        switch (portOperation) {
            case 'add': {
                return state.solution.data?.nodeSolutionData[nodeInstanceId]?.nodeDynamicData?.ports?.[portDirection]?.canAdd[portIndex] ?? false
            }
            case 'remove': {
                return state.solution.data?.nodeSolutionData[nodeInstanceId]?.nodeDynamicData?.ports?.[portDirection]?.canRemove[portIndex] ?? false
            }
        }
    })

    const handlePointerDown = useCallback((e: React.PointerEvent<SVGGElement>) => {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
    }, [])

    const handleClick = useCallback((e: React.MouseEvent<SVGGElement>) => {
        e.stopPropagation()

        switch (portOperation) {
            case 'add': {
                addParameter(nodeInstanceId, portDirection, portIndex)
                break
            }
            case 'remove': {
                removeParameter(nodeInstanceId, portDirection, portIndex)
                break
            }
        }
    }, [portOperation, addParameter, removeParameter, nodeInstanceId, portDirection, portIndex])

    if (portIndex < 0 || !isEnabled) {
        return null
    }

    const w = NODE_PORT_CHIP_SIZE

    const x = position.x + cx + dx
    const y = cy + dy

    const glyphInset = 2
    const glyphCenterX = x + w / 2
    const glyphCenterY = y + w / 2

    return <g className='np-group hover:np-cursor-pointer' style={{ pointerEvents: 'all' }} onPointerDownCapture={handlePointerDown} onClick={handleClick}>
        <rect x={x} y={y} width={w} height={w} fill={COLORS.LIGHT} stroke={COLORS.DARK} strokeWidth={2} rx={1} ry={1} className='group-hover:np-fill-grey' />
        <line x1={x + glyphInset} y1={glyphCenterY} x2={x + w - glyphInset} y2={glyphCenterY} stroke={COLORS.DARK} strokeWidth={1.5} strokeLinecap='butt' />
        {portOperation === 'add' && (
            <line x1={glyphCenterX} y1={y + glyphInset} x2={glyphCenterX} y2={y + w - glyphInset} stroke={COLORS.DARK} strokeWidth={1.5} strokeLinecap='butt' />
        )}
    </g>
}