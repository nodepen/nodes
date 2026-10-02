import type { CSSProperties } from "react"
import { COLORS } from "@/constants"

type IconProps = {
    width?: number
    height?: number
    fill?: string
    /**
     * `static` draws the rays at rest. `thinking` sends them darting in to touch the circle one
     * at a time, sequentially around the ring — the next ray starts moving in just as the
     * previous one touches. `idle` does the same in-and-touch-and-out motion, but as two
     * alternating groups (the four rays 90° apart, and the four rays offset 45° from those) —
     * one group starts moving in just as the other touches.
     */
    mode?: 'static' | 'thinking' | 'idle'
}

// Real units: fixed regardless of the icon's overall size, so a bigger width/height only
// stretches the rays outward rather than rescaling the mark itself.
const CIRCLE_RADIUS = 3
const STROKE_WIDTH = 2
const RAY_COUNT = 8
// Distance from the circle's edge to where a ray starts. Wider at rest in the animated modes so
// there's room to see the dart inward before a ray touches the circle.
const RAY_GAP_STATIC = 2
const RAY_GAP_ANIMATED = 5

const THINKING_DURATION_MS = 1600 // one full lap of all 8 rays taking their turn
const IDLE_DURATION_MS = 2400 // one full breath, split across the 2 alternating groups

const getRays = (width: number, height: number, gap: number) => {
    const centerX = width / 2
    const centerY = height / 2
    const innerRadius = CIRCLE_RADIUS + gap
    const outerRadius = Math.min(width, height) / 2 // reaches the edge of the viewBox

    return Array.from({ length: RAY_COUNT }, (_, i) => {
        const angle = (i * 2 * Math.PI) / RAY_COUNT
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)

        return {
            x1: centerX + innerRadius * cos,
            y1: centerY + innerRadius * sin,
            x2: centerX + outerRadius * cos,
            y2: centerY + outerRadius * sin,
            // Translation that carries the ray inward, along its own axis, until its inner tip
            // meets the circle. Moving back out is just this animated in reverse.
            dx: -cos * gap,
            dy: -sin * gap,
        }
    })
}

/**
 * A simple four-point sparkle. `kind` on a presence session is presentational only — an agent
 * acts with the token of the person who asked for it — but a session reading as just another
 * person in the roster is the thing most likely to confuse someone, so anywhere a session is
 * drawn should use this in place of the usual initial for `kind: 'agent'`.
 */
export const AgentIcon = ({ width = 14, height = 14, fill = 'currentColor', mode = 'static' }: IconProps) => {
    const gap = mode === 'static' ? RAY_GAP_STATIC : RAY_GAP_ANIMATED
    const rays = getRays(width, height, gap)

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill={fill} className={`${mode === 'static' ? '' : 'np-animate-march-rotate'} np-overflow-visible`} style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDuration: '10000ms' }}>
            <circle cx={width / 2} cy={height / 2} r={width / 2} fill={COLORS.DARK} fillOpacity={0.001} />
            <circle cx={width / 2} cy={height / 2} r={CIRCLE_RADIUS} stroke={COLORS.DARK} strokeWidth={STROKE_WIDTH} fill={COLORS.LIGHT} />
            {rays.map((ray, i) => {
                const style = {
                    '--np-ray-dx': `${ray.dx}px`,
                    '--np-ray-dy': `${ray.dy}px`,
                } as CSSProperties

                if (mode === 'thinking') {
                    // Staggered by 1/8 of the cycle so each ray starts moving in the instant
                    // the previous one touches the circle.
                    style.animation = `agent-icon-ray-thinking ${THINKING_DURATION_MS}ms ease-in-out infinite`
                    style.animationDelay = `${(i * THINKING_DURATION_MS) / RAY_COUNT}ms`
                } else if (mode === 'idle') {
                    // Two groups, alternating by angle: rays 90° apart (0, 90, 180, 270) vs.
                    // rays offset 45° from those. One group starts moving in the instant the
                    // other touches.
                    const group = i % 2
                    style.animation = `agent-icon-ray-idle ${IDLE_DURATION_MS}ms ease-in-out infinite`
                    style.animationDelay = `${(group * IDLE_DURATION_MS) / 2}ms`
                }

                return (
                    <line
                        key={i}
                        x1={ray.x1}
                        y1={ray.y1}
                        x2={ray.x2}
                        y2={ray.y2}
                        stroke={COLORS.DARK}
                        strokeWidth={STROKE_WIDTH}
                        strokeLinecap="butt"
                        style={style}
                    />
                )
            })}
        </svg>
    )
}
