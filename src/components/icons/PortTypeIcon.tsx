import React, { useCallback, useEffect, useRef } from 'react'
import { COLORS } from '@/constants'
import { useDispatch } from '@/store'
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

    const svgRef = useRef<SVGSVGElement>(null)
    const tooltipKey = useRef(`port-type-icon-${newGuid()}`)

    const { apply } = useDispatch()

    const activeTimeout = useRef<ReturnType<typeof setTimeout>>(null)
    const tooltipIsVisible = useRef(false)

    const updateTooltip = useCallback(() => {
        const svgEl = svgRef.current

        if (!svgEl) {
            return
        }

        if (!typeName) {
            return
        }

        const { left, width, top, height } = svgEl.getBoundingClientRect()

        const cx = left + (width / 2)
        const cy = top + (height / 2)

        const [a, ...rest] = typeName
        const label = `${a.toUpperCase()}${rest.join('')}`

        apply((state) => {
            state.registry.tooltips[tooltipKey.current] = {
                configuration: {
                    position: {
                        x: cx,
                        y: cy + ((height / -2) - 10)
                    },
                    isSticky: true
                },
                context: {
                    type: 'generic-text',
                    textContent: label
                }
            }
        })
    }, [typeName])

    useEffect(() => {
        if (tooltipIsVisible.current) {
            updateTooltip()
        }
    }, [typeName])

    const handlePointerEnter = useCallback((_e: React.PointerEvent<SVGSVGElement>) => {
        activeTimeout.current = setTimeout(() => {
            tooltipIsVisible.current = true
            updateTooltip()
        }, 150);
    }, [updateTooltip])

    const handlePointerLeave = useCallback((_e: React.PointerEvent<SVGSVGElement>) => {
        if (activeTimeout.current) {
            clearTimeout(activeTimeout.current)
            activeTimeout.current = null
        }

        apply((state) => {
            delete state.registry.tooltips[tooltipKey.current]
        })

        tooltipIsVisible.current = false
    }, [])

    return (
        <svg ref={svgRef} x={x} y={y} width={px} height={px} viewBox={`0 0 ${s * 2} ${s * 2}`} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave} className='np-pointer-events-auto'>
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

const ColorGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62

    // Scale the drop down so its extents sit within the circle glyph's (r * 0.8).
    const dropScale = 0.8
    const px = (fx: number) => s + fx * r * dropScale
    const py = (fy: number) => s + fy * r * dropScale

    const drop = `M ${px(0)} ${py(-1)} `
        + `C ${px(-0.53)} ${py(-0.55)} ${px(-0.8)} ${py(-0.15)} ${px(-0.8)} ${py(0.18)} `
        + `C ${px(-0.8)} ${py(0.68)} ${px(-0.42)} ${py(1)} ${px(0)} ${py(1)} `
        + `C ${px(0.42)} ${py(1)} ${px(0.8)} ${py(0.68)} ${px(0.8)} ${py(0.18)} `
        + `C ${px(0.8)} ${py(-0.15)} ${px(0.53)} ${py(-0.55)} ${px(0)} ${py(-1)} Z`

    return (
        <path d={drop} stroke={COLORS.LIGHT} strokeWidth={s * 0.2} strokeLinejoin="round" fill="none" />
    )
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

const VectorGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62
    const px = (fx: number) => s + fx * r
    const py = (fy: number) => s + fy * r

    const width = s * 0.22

    const head = `M ${px(0.55)} ${py(-0.19)} L ${px(0.75)} ${py(-0.65)} L ${px(0.27)} ${py(-0.52)}`

    return (
        <>
            <line x1={px(-0.75)} y1={py(0.65)} x2={px(0.75)} y2={py(-0.65)} stroke={COLORS.LIGHT} strokeWidth={width} strokeLinecap="round" />
            <path d={head} stroke={COLORS.LIGHT} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </>
    )
}

const BoxGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62
    const px = (fx: number) => s + fx * r
    const py = (fy: number) => s + fy * r

    const width = s * 0.15

    const outline = `M ${px(0)} ${py(-0.787)} L ${px(0.707)} ${py(-0.433)} L ${px(0.707)} ${py(0.433)} L ${px(0)} ${py(0.787)} L ${px(-0.707)} ${py(0.433)} L ${px(-0.707)} ${py(-0.433)} Z`
    const edges = `M ${px(0)} ${py(-0.079)} L ${px(0.707)} ${py(-0.433)} `
        + `M ${px(0)} ${py(-0.079)} L ${px(0)} ${py(0.787)} `
        + `M ${px(0)} ${py(-0.079)} L ${px(-0.707)} ${py(-0.433)}`

    return (
        <>
            <path d={outline} stroke={COLORS.LIGHT} strokeWidth={width} strokeLinejoin="round" fill={COLORS.DARK} />
            <path d={edges} stroke={COLORS.LIGHT} strokeWidth={width} strokeLinecap="round" fill="none" />
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

    const width = s * 0.15

    const outline = `M ${px(0)} ${py(-1.09)} L ${px(0.707)} ${py(-0.736)} L ${px(0.707)} ${py(0.736)} L ${px(0)} ${py(1.09)} L ${px(-0.707)} ${py(0.736)} L ${px(-0.707)} ${py(-0.736)} Z`
    const edges = `M ${px(0)} ${py(-0.383)} L ${px(0.707)} ${py(-0.736)} `
        + `M ${px(0)} ${py(-0.383)} L ${px(0)} ${py(1.09)} `
        + `M ${px(0)} ${py(-0.383)} L ${px(-0.707)} ${py(-0.736)}`

    return (
        <>
            <path d={outline} stroke={COLORS.LIGHT} strokeWidth={width} strokeLinejoin="round" fill={COLORS.DARK} />
            <path d={edges} stroke={COLORS.LIGHT} strokeWidth={width} strokeLinecap="round" fill="none" />
        </>
    )
}

const CircleGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62

    return (
        <circle cx={s} cy={s} r={r * 0.8} stroke={COLORS.LIGHT} strokeWidth={s * 0.2} fill="none" />
    )
}

const PlaneGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62
    const px = (fx: number) => s + fx * r
    const py = (fy: number) => s + fy * r

    const outline = `M ${px(-0.7)} ${py(-0.7)} L ${px(0.7)} ${py(-0.7)} L ${px(0.7)} ${py(0.7)} L ${px(-0.7)} ${py(0.7)} Z`

    const crosshair = `M ${px(-0.22)} ${py(0)} L ${px(0.22)} ${py(0)} `
        + `M ${px(0)} ${py(-0.22)} L ${px(0)} ${py(0.22)}`

    return (
        <>
            <path d={outline} stroke={COLORS.LIGHT} strokeWidth={s * 0.18} strokeLinejoin="round" fill="none" />
            <path d={crosshair} stroke={COLORS.LIGHT} strokeWidth={s * 0.1} strokeLinecap="round" fill="none" />
        </>
    )
}

const RectangleGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62
    const px = (fx: number) => s + fx * r
    const py = (fy: number) => s + fy * r

    const outline = `M ${px(-0.8)} ${py(-0.55)} L ${px(0.8)} ${py(-0.55)} L ${px(0.8)} ${py(0.55)} L ${px(-0.8)} ${py(0.55)} Z`

    return <path d={outline} stroke={COLORS.LIGHT} strokeWidth={s * 0.18} strokeLinejoin="round" fill="none" />
}

const DomainGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62
    const py = (fy: number) => s + fy * r

    const width = s * 0.2
    const dotHalf = width / 2
    const gap = width
    const dotOffset = r * 0.9
    const lineHalf = dotOffset - dotHalf - gap

    return (
        <>
            <line x1={s - lineHalf} y1={py(0)} x2={s + lineHalf} y2={py(0)} stroke={COLORS.LIGHT} strokeWidth={width} strokeLinecap="butt" />
            <line x1={s - dotOffset - dotHalf} y1={py(0)} x2={s - dotOffset + dotHalf} y2={py(0)} stroke={COLORS.LIGHT} strokeWidth={width} strokeLinecap="butt" />
            <line x1={s + dotOffset - dotHalf} y1={py(0)} x2={s + dotOffset + dotHalf} y2={py(0)} stroke={COLORS.LIGHT} strokeWidth={width} strokeLinecap="butt" />
        </>
    )
}

const Domain2Glyph = ({ s }: GlyphProps) => {
    return (
        <>
            <DomainGlyph s={s} />
            <g transform={`rotate(90 ${s} ${s})`}>
                <DomainGlyph s={s} />
            </g>
        </>
    )
}

const MatrixGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62
    const px = (fx: number) => s + fx * r
    const py = (fy: number) => s + fy * r

    const width = s * 0.18

    const brackets = `M ${px(-0.35)} ${py(-0.7)} L ${px(-0.7)} ${py(-0.7)} L ${px(-0.7)} ${py(0.7)} L ${px(-0.35)} ${py(0.7)} `
        + `M ${px(0.35)} ${py(-0.7)} L ${px(0.7)} ${py(-0.7)} L ${px(0.7)} ${py(0.7)} L ${px(0.35)} ${py(0.7)}`

    return (
        <>
            <path d={brackets} stroke={COLORS.LIGHT} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {[-0.3, 0.3].map((fy) => [-0.3, 0.3].map((fx) => (
                <circle key={`${fx}-${fy}`} cx={px(fx)} cy={py(fy)} r={r * 0.2} fill={COLORS.LIGHT} />
            )))}
        </>
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

const DataGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62
    const px = (fx: number) => s + fx * r
    const py = (fy: number) => s + fy * r

    return (
        <>
            <circle cx={px(-0.72)} cy={py(0)} r={r * 0.2} fill={COLORS.LIGHT} />
            <circle cx={px(0)} cy={py(0)} r={r * 0.2} fill={COLORS.LIGHT} />
            <circle cx={px(0.72)} cy={py(0)} r={r * 0.2} fill={COLORS.LIGHT} />
        </>
    )
}

const MeshFaceGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62
    const px = (fx: number) => s + fx * r
    const py = (fy: number) => s + fy * r

    const outline = `M ${px(-0.8)} ${py(-0.55)} L ${px(0.8)} ${py(-0.55)} L ${px(0.8)} ${py(0.55)} L ${px(-0.8)} ${py(0.55)} Z`
    const diagonal = `M ${px(-0.8)} ${py(-0.55)} L ${px(0.8)} ${py(0.55)}`

    return (
        <>
            <path d={outline} stroke={COLORS.LIGHT} strokeWidth={s * 0.18} strokeLinejoin="round" fill="none" />
            <path d={diagonal} stroke={COLORS.LIGHT} strokeWidth={s * 0.1} strokeLinecap="round" fill="none" />
        </>
    )
}

const SubDGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62
    const px = (fx: number) => s + fx * r
    const py = (fy: number) => s + fy * r

    const cage = `M ${px(-0.715)} ${py(-0.585)} `
        + `L ${px(-0.585)} ${py(-0.715)} Q ${px(0)} ${py(-1.3)} ${px(0.585)} ${py(-0.715)} `
        + `L ${px(0.715)} ${py(-0.585)} Q ${px(1.3)} ${py(0)} ${px(0.715)} ${py(0.585)} `
        + `L ${px(0.585)} ${py(0.715)} Q ${px(0)} ${py(1.3)} ${px(-0.585)} ${py(0.715)} `
        + `L ${px(-0.715)} ${py(0.585)} Q ${px(-1.3)} ${py(0)} ${px(-0.715)} ${py(-0.585)} Z`

    const diagonals = `M ${px(-0.65)} ${py(-0.65)} L ${px(0.65)} ${py(0.65)} `
        + `M ${px(-0.65)} ${py(0.65)} L ${px(0.65)} ${py(-0.65)}`

    return (
        <>
            <path d={cage} stroke={COLORS.LIGHT} strokeWidth={s * 0.2} strokeLinejoin="round" fill="none" />
            <path d={diagonals} stroke={COLORS.LIGHT} strokeWidth={s * 0.1} strokeLinecap="round" fill="none" />
        </>
    )
}


// BoxGlyph but all dark and twisted
const TwistedBoxGlyph = ({ s }: GlyphProps) => {
    return (
        <g transform={`rotate(15 ${s} ${s})`}>
            <BoxGlyph s={s} />
        </g>
    )
}


const TransformGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62
    const px = (fx: number) => s + fx * r
    const py = (fy: number) => s + fy * r

    const width = s * 0.15

    const before = `M ${px(-0.8)} ${py(0)} L ${px(0)} ${py(0)} L ${px(0)} ${py(0.8)} L ${px(-0.8)} ${py(0.8)} Z`
    const after = `M ${px(0)} ${py(-0.8)} L ${px(0.8)} ${py(-0.8)} L ${px(0.8)} ${py(0)} L ${px(0)} ${py(0)} Z`

    return (
        <>
            <path d={before} stroke={COLORS.LIGHT} strokeWidth={width} strokeLinejoin="round" fill="none" />
            <path d={after} stroke={COLORS.LIGHT} strokeWidth={width} strokeLinejoin="round" fill="none" />
        </>
    )
}

const FieldGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62
    const px = (fx: number) => s + fx * r
    const py = (fy: number) => s + fy * r

    const dotR = r * 0.2
    const ringRadius = 0.72

    const ringAngles = [0, 45, 90, 135, 180, 225, 270, 315]

    return (
        <>
            <circle cx={px(0)} cy={py(0)} r={dotR} fill={COLORS.LIGHT} />
            {ringAngles.map((deg) => {
                const rad = (deg * Math.PI) / 180
                const fx = ringRadius * Math.cos(rad)
                const fy = ringRadius * Math.sin(rad)
                return <circle key={deg} cx={px(fx)} cy={py(fy)} r={dotR} fill={COLORS.LIGHT} />
            })}
        </>
    )
}

const GeometryGlyph = ({ s }: GlyphProps) => {
    const r = s * 0.62
    const px = (fx: number) => s + fx * r
    const py = (fy: number) => s + fy * r

    const triangle = `M ${px(0)} ${py(-0.5625)} L ${px(0.6)} ${py(0.5625)} L ${px(-0.6)} ${py(0.5625)} Z`

    return (
        <path d={triangle} stroke={COLORS.LIGHT} strokeWidth={s * 0.2} strokeLinejoin="round" fill="none" />
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
    color: ColorGlyph,
    line: LineGlyph,
    box: BoxGlyph,
    brep: BrepGlyph,
    extrusion: ExtrusionGlyph,
    circle: CircleGlyph,
    domain: DomainGlyph,
    'domain²': Domain2Glyph,
    curve: CurveGlyph,
    mesh: MeshGlyph,
    'mesh face': MeshFaceGlyph,
    subd: SubDGlyph,
    surface: SurfaceGlyph,
    plane: PlaneGlyph,
    rectangle: RectangleGlyph,
    vector: VectorGlyph,
    'twisted box': TwistedBoxGlyph,
    transform: TransformGlyph,
    matrix: MatrixGlyph,
    field: FieldGlyph,
    geometry: GeometryGlyph,
    data: DataGlyph,
    reference: ReferenceGlyph,
}

export const getPortTypeGlyph = (typeName: NodePen.DataTreeValueType | undefined, s: number): React.ReactElement | null => {
    if (!typeName) {
        return null
    }

    const Glyph = portTypeGlyphs[typeName]

    return Glyph ? <Glyph s={s} /> : null
}
