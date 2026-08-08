import type * as NodePen from '@/types'
import { useCallback } from 'react'
import { useResizableNode } from '../hooks/useResizableNode'
import { useNodeInternalState } from '../context/node-state'
import { COLORS } from '@/constants'
import { useSelectionColor } from '@/hooks/useSelectionColor'

type ResizeHandleProps = {
    node: NodePen.DocumentNode
}

export const GenericParameterResizeHandle = ({ node }: ResizeHandleProps) => {
    const { position } = useNodeInternalState()
    const { sessionColor, presenceColor } = useSelectionColor(node.instanceId)

    const { instanceId, dimensions } = node

    const computeAnchors = useCallback((next: NodePen.DocumentNode): NodePen.DocumentNode['anchors'] => {
        return {
            'labelDeltaX': {
                dx: 21,
                dy: 0
            },
            'input': {
                dx: 0,
                dy: next.dimensions.height / 2
            },
            'output': {
                dx: next.dimensions.width,
                dy: next.dimensions.height / 2
            }
        }
    }, [])

    const { right } = useResizableNode(instanceId, { computeAnchors, minWidth: 120, maxWidth: 350 })

    const x = position.x + dimensions.width - 20
    const y = position.y + 8
    const height = dimensions.height - 16

    return <g ref={right} className='np-invisible group-hover:np-visible'>
        <rect
            x={x}
            y={y}
            width={10}
            height={height}
            fill={presenceColor ?? sessionColor}
        />
        <line x1={x + 3} y1={y} x2={x + 3} y2={y + height} stroke={COLORS.DARK} strokeWidth={2} strokeLinecap='round' />
        <line x1={x + 7} y1={y} x2={x + 7} y2={y + height} stroke={COLORS.DARK} strokeWidth={2} strokeLinecap='round' />
    </g>

}