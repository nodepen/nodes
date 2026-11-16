import { useNodeInternalState } from '@/components/nodes/context/node-state'
import { COLORS } from '@/constants'
import type * as NodePen from '@/types'
import { getDomainValue } from '@/utils/numerics/domain'
import { getMaskKey } from '../../utils/getMaskKey'

type Props = {
    // World space
    extents: {
        x: number
        y: number
        w: number
        h: number
    }
    // Normalized 0 -> 1
    grips: NodePen.GraphMapperGrip[]
}

export const BezierGraph = ({ extents, grips }: Props) => {
    const { x, y, w, h } = extents

    const { nodeInstanceId } = useNodeInternalState()

    const domainX: [min: number, max: number] = [
        x,
        x + w
    ]
    const domainY: [min: number, max: number] = [
        y + h, // Inverted
        y
    ]

    if (grips.length < 4) {
        return null
    }

    const [
        start,
        controlStart,
        controlEnd,
        end
    ] = grips

    const remapPoint = (px: number, py: number): [x: number, y: number] => {
        return [
            getDomainValue(domainX, px),
            getDomainValue(domainY, py)
        ]
    }

    const [ax, ay] = remapPoint(start.x, start.y)
    const [c1x, c1y] = remapPoint(controlStart.x, controlStart.y)
    const [c2x, c2y] = remapPoint(controlEnd.x, controlEnd.y)
    const [bx, by] = remapPoint(end.x, end.y)

    const d = `M ${ax} ${ay} C ${c1x} ${c1y} ${c2x} ${c2y} ${bx} ${by}`

    return <g>
        <path
            mask={`url(#${getMaskKey(nodeInstanceId)})`}
            d={d}
            stroke={COLORS.LIGHT}
            strokeWidth={6}
            strokeLinecap='round'
            fill='none'
        />
        <path
            d={d}
            stroke={COLORS.DARK}
            strokeWidth={2}
            strokeLinecap='round'
            fill='none'
        />
    </g>



    return null
}