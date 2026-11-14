import type * as NodePen from '@/types'
import { COLORS, DIMENSIONS } from '@/constants'
import { useNodeInternalState } from '../../context/node-state'
import { useCallback, useEffect, useState } from 'react'
import { LinearGraph } from './graphs/LinearGraph'
import { GraphMapperCanvasGrip } from './GraphMapperCanvasGrip'

const { NODE_INTERNAL_PADDING, NODE_PORT_RADIUS } = DIMENSIONS

type GraphMapperCanvasProps = {
    node: NodePen.DocumentNode
    config?: NodePen.GraphMapperConfig
}

export const GraphMapperCanvas = ({ node, config }: GraphMapperCanvasProps) => {
    const { position } = useNodeInternalState()

    const { width, height } = node.dimensions

    const graphType = config?.graphType ?? null

    const o = 2 * NODE_INTERNAL_PADDING

    const x = position.x + o
    const y = position.y + o

    const w = width - 2 * o
    const h = height - 2 * o

    // Control circle radius
    const cr = NODE_PORT_RADIUS
    const r = cr + 2 + 2

    // Interactive area is not inset because control can hit edges
    const worldDomainX: [min: number, max: number] = [
        x,
        x + w
    ]
    const worldDomainY: [min: number, max: number] = [
        y,
        y + h
    ]

    const innerW = worldDomainX[1] - worldDomainX[0]
    const innerH = worldDomainY[1] - worldDomainY[0]

    const [internalGrips, setInternalGrips] = useState(config?.grips ?? [])
    useEffect(() => {
        setInternalGrips(config?.grips ?? [])
    }, [config?.grips])

    const updateInternalGrip = useCallback((i: number, grip: NodePen.GraphMapperGrip) => {
        setInternalGrips((grips) => {
            if (!grips.at(i)) {
                return grips
            }

            const nextGrips = structuredClone(grips)

            nextGrips[i] = grip

            return nextGrips
        })
    }, [])

    const extents = { x, y, w, h }

    if (internalGrips.length === 0) {
        return null
    }

    return <g id={`graph-mapper-canvas-${node.instanceId}`}>
        <rect x={x} y={y} width={w} height={h} stroke={COLORS.DARK} strokeWidth={2} fill={COLORS.LIGHT} />
        <mask id={`graph-mapper-mask-${node.instanceId}`}>
            <rect x={x} y={y} width={w} height={h} fill={COLORS.LIGHT} stroke={COLORS.LIGHT} strokeWidth={2} />
        </mask>
        {(() => {
            switch (graphType) {
                case 'linear': {
                    return <LinearGraph nodeInstanceId={node.instanceId} extents={extents} grips={internalGrips} />
                }
                default: {
                    return null
                }
            }
        })()}
        {
            internalGrips.map(({ x, y }, i) => <GraphMapperCanvasGrip key={`grip-${i}`} extents={extents} grip={{ x, y, i }} />)
        }
    </g>

}
