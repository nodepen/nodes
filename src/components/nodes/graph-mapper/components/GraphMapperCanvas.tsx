import type * as NodePen from '@/types'
import { COLORS, DIMENSIONS } from '@/constants'
import { useNodeInternalState } from '../../context/node-state'
import { useCallback, useEffect, useState } from 'react'
import { LinearGraph } from './graphs/LinearGraph'
import { GraphMapperCanvasGrip } from './GraphMapperCanvasGrip'
import { useDispatch } from '@/store'
import { getMaskKey } from '../utils/getMaskKey'
import { expireSolution } from '@/store/utils'
import { BezierGraph } from './graphs/BezierGraph'

const { NODE_INTERNAL_PADDING, NODE_PORT_RADIUS } = DIMENSIONS

type GraphMapperCanvasProps = {
    node: NodePen.DocumentNode
    config?: NodePen.GraphMapperConfig
}

export const GraphMapperCanvas = ({ node, config }: GraphMapperCanvasProps) => {
    const { position } = useNodeInternalState()

    const { apply } = useDispatch()

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

    const extents = { x, y, w, h }

    const getLimits = (graphType: NodePen.GraphMapperGraphType | null | undefined, i: number): {
        x: [min: number, max: number],
        y: [min: number, max: number]
    } => {
        switch (graphType) {
            case 'linear': {
                return {
                    x: [0, 1],
                    y: [0, 1]
                }
            }
            case 'bezier': {
                return [
                    {
                        x: [0, 0],
                        y: [0, 1]
                    },
                    {
                        x: [0, 1],
                        y: [0, 1]
                    },
                    {
                        x: [0, 1],
                        y: [0, 1]
                    },
                    {
                        x: [1, 1],
                        y: [0, 1]
                    }
                ][i] as {
                    x: [min: number, max: number],
                    y: [min: number, max: number]
                }
            }
            default: {
                return {
                    x: [0, 1],
                    y: [0, 1]
                }
            }
        }
    }

    const [internalGrips, setInternalGrips] = useState(config?.grips ?? [])
    useEffect(() => {
        setInternalGrips(config?.grips ?? [])
    }, [config?.grips])

    const handleUpdateGrip = useCallback((i: number, grip: { x: number, y: number }) => {
        const nextGrips = structuredClone(internalGrips)

        if (!nextGrips[i]) {
            return
        }

        nextGrips[i] = grip

        setInternalGrips(nextGrips)
    }, [internalGrips])

    const handleCommitGrips = useCallback(() => {
        apply((state) => {
            const config = state.document.nodes[node.instanceId].nodeConfiguration as NodePen.GraphMapperConfig
            config.grips = internalGrips

            expireSolution(state)
        })
    }, [internalGrips])

    return <g id={`graph-mapper-canvas-${node.instanceId}`}>
        <rect x={x} y={y} width={w} height={h} stroke={COLORS.DARK} strokeWidth={2} fill={COLORS.LIGHT} />
        <mask id={getMaskKey(node.instanceId)}>
            <rect x={x} y={y} width={w} height={h} fill={COLORS.LIGHT} stroke={COLORS.LIGHT} strokeWidth={2} />
        </mask>
        {(() => {
            switch (graphType) {
                case 'linear': {
                    return <LinearGraph extents={extents} grips={internalGrips} />
                }
                case 'bezier': {
                    return <BezierGraph extents={extents} grips={internalGrips} />
                }
                default: {
                    return <svg x={x + (w / 2) - 12} y={y + (h / 2) - 12} width={24} height={24} aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                }
            }
        })()}
        {
            internalGrips.map(({ x, y }, i) => <GraphMapperCanvasGrip
                key={`grip-${i}`}
                extents={extents}
                grip={{ x, y }}
                limits={getLimits(config?.graphType, i)}
                onUpdate={(x, y) => {
                    handleUpdateGrip(i, { x, y })
                }}
                onCommit={handleCommitGrips}
            />)

        }
    </g>

}
