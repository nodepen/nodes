import type * as NodePen from '@/types'
import { useResizableNode } from '../../hooks/useResizableNode'
import { useCallback } from 'react'
import { useNodeInternalState } from '../../context/node-state'

type ResizeTargetsProps = {
    node: NodePen.DocumentNode
}

export const PanelResizeTargets = ({ node }: ResizeTargetsProps) => {
    const { position } = useNodeInternalState()

    const { x, y } = position
    const { width, height } = node.dimensions

    const computeAnchors = useCallback((next: NodePen.DocumentNode): NodePen.DocumentNode['anchors'] => {
        return {
            'labelDeltaX': {
                dx: 0,
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

    const {
        topRight,
        topLeft,
        bottomLeft,
        bottomRight,
        top,
        left,
        bottom,
        right
    } = useResizableNode(node.instanceId, { computeAnchors })

    const s = 32
    const h = height - s
    const w = width - s

    return (
        <>
            <g ref={topRight}>
                <rect
                    x={x + width - (s / 2)}
                    y={y - (s / 2)}
                    width={s}
                    height={s}
                    fill="transparent"
                />
            </g>
            <g ref={top}>
                <rect
                    x={x + (s / 2)}
                    y={y - (s / 2)}
                    width={w}
                    height={s}
                    fill="transparent"
                />
            </g>
            <g ref={topLeft}>
                <rect
                    x={x - (s / 2)}
                    y={y - (s / 2)}
                    width={s}
                    height={s}
                    fill="transparent"
                />
            </g>
            <g ref={left}>
                <rect
                    x={x - (s / 2)}
                    y={y + (s / 2)}
                    width={s}
                    height={h}
                    fill="transparent"
                />
            </g>
            <g ref={bottomLeft}>
                <rect
                    x={x - (s / 2)}
                    y={y + height - (s / 2)}
                    width={s}
                    height={s}
                    fill="transparent"
                />
            </g>
            <g ref={bottom}>
                <rect
                    x={x + (s / 2)}
                    y={y + height - (s / 2)}
                    width={w}
                    height={s}
                    fill="transparent"
                />
            </g>
            <g ref={bottomRight}>
                <rect
                    x={x + width - (s / 2)}
                    y={y + height - (s / 2)}
                    width={s}
                    height={s}
                    fill="transparent"
                />
            </g>
            <g ref={right}>
                <rect
                    x={x + width - (s / 2)}
                    y={y + (s / 2)}
                    width={s}
                    height={h}
                    fill="transparent"
                />
            </g>
        </>
    )
}