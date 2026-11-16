import { useNodeInternalState } from '@/components/nodes/context/node-state'
import { COLORS } from '@/constants'
import type * as NodePen from '@/types'
import { getLine } from '@/utils/geometry/lines/getLine'
import { getSquareIntersection } from '@/utils/geometry/lines/getSquareIntersection'
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

export const LinearGraph = ({ extents, grips }: Props) => {
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

    const [from, to] = grips

    const line = getSquareIntersection(getLine(from, to))

    const ax = getDomainValue(domainX, line.from.x)
    const ay = getDomainValue(domainY, line.from.y)
    const bx = getDomainValue(domainX, line.to.x)
    const by = getDomainValue(domainY, line.to.y)

    return <>
        <line mask={`url(#${getMaskKey(nodeInstanceId)})`} x1={ax} y1={ay} x2={bx} y2={by} stroke={COLORS.LIGHT} strokeWidth={6} strokeLinecap='round' />
        <line x1={ax} y1={ay} x2={bx} y2={by} stroke={COLORS.DARK} strokeWidth={2} strokeLinecap='round' />
    </>
}