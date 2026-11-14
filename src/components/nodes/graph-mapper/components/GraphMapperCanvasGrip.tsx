import { COLORS, DIMENSIONS } from "@/constants"
import { getDomainValue } from "@/utils/numerics/domain"

const { NODE_PORT_RADIUS } = DIMENSIONS

type Props = {
    // World coordinates
    extents: {
        x: number
        y: number
        w: number
        h: number
    }
    // Normalized 0-1
    grip: {
        x: number
        y: number
        i: number
    }
}

export const GraphMapperCanvasGrip = ({ extents, grip }: Props) => {
    const { x, y, w, h } = extents

    const cx = getDomainValue([x, x + w], grip.x)
    const cy = getDomainValue([y + h, y], grip.y)

    return <circle cx={cx + x} cy={cy + y + h} r={NODE_PORT_RADIUS} stroke={COLORS.DARK} strokeWidth={2} fill={COLORS.LIGHT} />
}