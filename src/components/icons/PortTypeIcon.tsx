import React from 'react'
import { COLORS } from '@/constants'
import type * as NodePen from '@/types'
import { newGuid } from '@/utils/common'

type PortTypeIconProps = {
    position?: { x: number, y: number }
    r?: number
    typeName?: NodePen.DataTreeValueType
}

export const PortTypeIcon = ({ position, r = 20, typeName }: PortTypeIconProps): React.ReactElement => {
    const { x, y } = position ?? {}

    const id = newGuid().split('-').at(0)

    const px = `${r}px`
    const s = r / 2

    const a = s
    const b = s / 2
    const f = (Math.sqrt(3) / 2) * s
    const points = `${a},0 ${b},-${f} -${b},-${f} -${a},0 -${b},${f} ${b},${f}`

    return (
        <svg x={x} y={y} width={px} height={px} viewBox={`0 0 ${s * 2} ${s * 2}`}>
            <defs>
                <clipPath id={id}>
                    <polygon points={points} />
                </clipPath>
            </defs>
            <polygon
                points={points}
                stroke={COLORS.DARK}
                strokeWidth="4px"
                fill={COLORS.DARK}
                vectorEffect="non-scaling-stroke"
                clipPath={`url(#${id})`}
                style={{ transform: `translate(${s}px, ${s}px)` }}
            />
            {getPortTypeGlyph(typeName, s)}
        </svg>
    )
}

type GlyphProps = {
    /** Half-width of the hexagon this glyph is drawn inside; the glyph's local origin is (s, s). */
    s: number
}

const BooleanGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62
    const px = (fx: number) => s + fx * r
    const py = (fy: number) => s + fy * r

    return (
        <path
            d={`M ${px(-0.9)} ${py(0.05)} L ${px(-0.3)} ${py(0.6)} L ${px(0.9)} ${py(-0.55)}`}
            stroke={COLORS.LIGHT}
            strokeWidth={s * 0.22}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
    )
}

const IntegerGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62
    const px = (fx: number) => s + fx * r
    const py = (fy: number) => s + fy * r

    return (
        <path
            d={`M ${px(-0.8)} ${py(0.55)} L ${px(-0.275)} ${py(0.55)} L ${px(-0.275)} ${py(0)} L ${px(0.275)} ${py(0)} L ${px(0.275)} ${py(-0.65)} L ${px(0.8)} ${py(-0.65)}`}
            stroke={COLORS.LIGHT}
            strokeWidth={s * 0.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
    )
}

const NumberGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62
    const px = (fx: number) => s + fx * r
    const py = (fy: number) => s + fy * r

    return (
        <path
            d={`M ${px(-0.75)} ${py(0.65)} L ${px(0.75)} ${py(-0.65)}`}
            stroke={COLORS.LIGHT}
            strokeWidth={s * 0.22}
            strokeLinecap="round"
            fill="none"
        />
    )
}

const TextGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62
    const px = (fx: number) => s + fx * r
    const py = (fy: number) => s + fy * r

    const width = s * 0.18

    return (
        <>
            <line x1={px(-0.75)} y1={py(-0.55)} x2={px(0.75)} y2={py(-0.55)} stroke={COLORS.LIGHT} strokeWidth={width} strokeLinecap="round" />
            <line x1={px(-0.75)} y1={py(0)} x2={px(0.45)} y2={py(0)} stroke={COLORS.LIGHT} strokeWidth={width} strokeLinecap="round" />
            <line x1={px(-0.75)} y1={py(0.55)} x2={px(0.65)} y2={py(0.55)} stroke={COLORS.LIGHT} strokeWidth={width} strokeLinecap="round" />
        </>
    )
}

const PointGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62

    return <circle cx={s} cy={s} r={r * 0.32} fill={COLORS.LIGHT} />
}

const LineGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62
    const px = (fx: number) => s + fx * r
    const py = (fy: number) => s + fy * r

    const dotR = s * 0.18

    return (
        <>
            <line x1={px(-0.75)} y1={py(0.55)} x2={px(0.75)} y2={py(-0.55)} stroke={COLORS.LIGHT} strokeWidth={s * 0.18} strokeLinecap="round" />
            <circle cx={px(-0.75)} cy={py(0.55)} r={dotR} fill={COLORS.LIGHT} />
            <circle cx={px(0.75)} cy={py(-0.55)} r={dotR} fill={COLORS.LIGHT} />
        </>
    )
}

const BoxGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62
    const px = (fx: number) => s + fx * r
    const py = (fy: number) => s + fy * r

    const width = s * 0.15

    const front = `M ${px(-0.6)} ${py(-0.1)} L ${px(0.15)} ${py(-0.1)} L ${px(0.15)} ${py(0.7)} L ${px(-0.6)} ${py(0.7)} Z`
    const back = `M ${px(-0.25)} ${py(-0.55)} L ${px(0.5)} ${py(-0.55)} L ${px(0.5)} ${py(0.25)} L ${px(-0.25)} ${py(0.25)} Z`

    return (
        <>
            <path d={back} stroke={COLORS.LIGHT} strokeWidth={width} strokeLinejoin="round" fill="none" />
            <path d={front} stroke={COLORS.LIGHT} strokeWidth={width} strokeLinejoin="round" fill={COLORS.DARK} />
            <line x1={px(-0.6)} y1={py(-0.1)} x2={px(-0.25)} y2={py(-0.55)} stroke={COLORS.LIGHT} strokeWidth={width} strokeLinecap="round" />
            <line x1={px(0.15)} y1={py(-0.1)} x2={px(0.5)} y2={py(-0.55)} stroke={COLORS.LIGHT} strokeWidth={width} strokeLinecap="round" />
            <line x1={px(0.15)} y1={py(0.7)} x2={px(0.5)} y2={py(0.25)} stroke={COLORS.LIGHT} strokeWidth={width} strokeLinecap="round" />
        </>
    )
}

const BrepGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62
    const px = (fx: number) => s + fx * r
    const py = (fy: number) => s + fy * r

    const rx = 0.72
    const ry = 0.28
    const topY = -0.55
    const bottomY = 0.55

    const body = `M ${px(-rx)} ${py(topY)} L ${px(-rx)} ${py(bottomY)} C ${px(-rx)} ${py(0.7)} ${px(-0.4)} ${py(0.83)} ${px(0)} ${py(0.83)} C ${px(0.4)} ${py(0.83)} ${px(rx)} ${py(0.7)} ${px(rx)} ${py(bottomY)} L ${px(rx)} ${py(topY)} Z`

    return (
        <>
            <path d={body} stroke={COLORS.LIGHT} strokeWidth={s * 0.18} strokeLinejoin="round" fill={COLORS.DARK} />
            <ellipse cx={px(0)} cy={py(topY)} rx={rx * r} ry={ry * r} stroke={COLORS.LIGHT} strokeWidth={s * 0.18} fill={COLORS.DARK} />
        </>
    )
}

const ExtrusionGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62
    const px = (fx: number) => s + fx * r
    const py = (fy: number) => s + fy * r

    const width = s * 0.16

    const front = `M ${px(-0.75)} ${py(0.6)} Q ${px(-0.1)} ${py(0.85)} ${px(0.55)} ${py(0.6)}`
    const back = `M ${px(-0.4)} ${py(-0.6)} Q ${px(0.25)} ${py(-0.35)} ${px(0.9)} ${py(-0.6)}`

    return (
        <>
            <path d={front} stroke={COLORS.LIGHT} strokeWidth={width} strokeLinecap="round" fill="none" />
            <path d={back} stroke={COLORS.LIGHT} strokeWidth={width} strokeLinecap="round" fill="none" />
            <line x1={px(-0.75)} y1={py(0.6)} x2={px(-0.4)} y2={py(-0.6)} stroke={COLORS.LIGHT} strokeWidth={width} strokeLinecap="round" />
            <line x1={px(0.55)} y1={py(0.6)} x2={px(0.9)} y2={py(-0.6)} stroke={COLORS.LIGHT} strokeWidth={width} strokeLinecap="round" />
        </>
    )
}

const CircleGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62

    return (
        <circle cx={s} cy={s} r={r * 0.8} stroke={COLORS.LIGHT} strokeWidth={s * 0.2} fill="none" />
    )
}

const CurveGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62
    const px = (fx: number) => s + fx * r
    const py = (fy: number) => s + fy * r

    return (
        <path
            d={`M ${px(-0.8)} ${py(0.55)} C ${px(-0.15)} ${py(0.55)} ${px(-0.15)} ${py(-0.55)} ${px(0.8)} ${py(-0.55)}`}
            stroke={COLORS.LIGHT}
            strokeWidth={s * 0.2}
            strokeLinecap="round"
            fill="none"
        />
    )
}

const SurfaceGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62
    const px = (fx: number) => s + fx * r
    const py = (fy: number) => s + fy * r

    const outline = `M ${px(0.25)} ${py(-0.85)} L ${px(1.1)} ${py(0)} C ${px(0.87)} ${py(0.64)} ${px(-0.02)} ${py(0.21)} ${px(-0.25)} ${py(0.85)} L ${px(-1.1)} ${py(0)} C ${px(-0.87)} ${py(-0.64)} ${px(0.02)} ${py(-0.21)} ${px(0.25)} ${py(-0.85)} Z`

    const straightIsocurve = `M ${px(-0.43)} ${py(-0.43)} L ${px(0.43)} ${py(0.43)}`
    const wavyIsocurve = `M ${px(0.68)} ${py(-0.43)} C ${px(0.45)} ${py(0.22)} ${px(-0.45)} ${py(-0.22)} ${px(-0.68)} ${py(0.43)}`

    return (
        <>
            <path d={outline} stroke={COLORS.LIGHT} strokeWidth={s * 0.18} strokeLinejoin="round" fill="none" />
            <path d={straightIsocurve} stroke={COLORS.LIGHT} strokeWidth={s * 0.1} strokeLinecap="round" fill="none" />
            <path d={wavyIsocurve} stroke={COLORS.LIGHT} strokeWidth={s * 0.1} strokeLinecap="round" fill="none" />
        </>
    )
}

const MeshGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62
    const px = (fx: number) => s + fx * r
    const py = (fy: number) => s + fy * r

    const outline = `M ${px(0)} ${py(-0.85)} L ${px(0.85)} ${py(0)} L ${px(0)} ${py(0.85)} L ${px(-0.85)} ${py(0)} Z`
    const topology = `M ${px(0)} ${py(-0.85)} L ${px(0)} ${py(0.85)} M ${px(0.85)} ${py(0)} L ${px(-0.85)} ${py(0)}`

    return (
        <>
            <path d={outline} stroke={COLORS.LIGHT} strokeWidth={s * 0.18} strokeLinejoin="round" fill="none" />
            <path d={topology} stroke={COLORS.LIGHT} strokeWidth={s * 0.1} strokeLinecap="round" fill="none" />
        </>
    )
}

const ReferenceGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62

    return (
        <>
            <circle cx={s} cy={s} r={r * 0.8} stroke={COLORS.LIGHT} strokeWidth={s * 0.16} fill="none" />
            <circle cx={s} cy={s} r={r * 0.28} fill={COLORS.LIGHT} />
        </>
    )
}

const portTypeGlyphs: Record<NodePen.DataTreeValueType, (props: GlyphProps) => React.ReactElement> = {
    boolean: BooleanGlyph,
    integer: IntegerGlyph,
    number: NumberGlyph,
    string: TextGlyph,
    text: TextGlyph,
    point: PointGlyph,
    line: LineGlyph,
    box: BoxGlyph,
    brep: BrepGlyph,
    extrusion: ExtrusionGlyph,
    circle: CircleGlyph,
    curve: CurveGlyph,
    mesh: MeshGlyph,
    surface: SurfaceGlyph,
    reference: ReferenceGlyph,
}

export const getPortTypeGlyph = (typeName: NodePen.DataTreeValueType | undefined, s: number): React.ReactElement | null => {
    if (!typeName) {
        return null
    }

    const Glyph = portTypeGlyphs[typeName]

    return Glyph ? <Glyph s={s} /> : null
}
