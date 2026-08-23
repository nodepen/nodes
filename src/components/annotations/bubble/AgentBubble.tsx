import { AgentSparkleIcon } from "@/components/icons/AgentSparkleIcon"
import { COLORS } from "@/constants"
import { useStore } from "@/store"
import React from "react"
import { shallow } from "zustand/shallow"

type Props = {
    bubbleId: string
}

const AgentBubble = ({ bubbleId }: Props) => {
    const bubbleData = useStore((state) => state.registry.agent.bubbles[bubbleId], shallow)

    if (!bubbleData) {
        return null
    }

    const margin = 24
    const width = 200

    const { ref, position, message, type } = bubbleData
    const { x, y } = position

    return <g id={`agent-bubble-${bubbleId}`}>
        {/* <rect x={x - margin} y={y - margin} width={width + 2 * margin} height={margin * 2} rx={6} ry={6} fill={COLORS.PALE} /> */}
        <svg width={32} height={32} x={x - 16} y={y - 16}>
            <AgentSparkleIcon width={32} height={32} fill={COLORS.DARK} />
        </svg>
        <path id={`bubble-title-path-${bubbleId}`} d={`M ${x + margin} ${y + 1} L ${x + width - margin} ${y + 1}`} />
        {/* <text
            className="np-font-panel np-select-none np-pointer-events-none"
            fill={COLORS.DARK}
            fontSize={16}
            dominantBaseline="middle"
        >
            <textPath href={`#bubble-title-path-${bubbleId}`} startOffset="0%" textAnchor="start">
                {message}
            </textPath>
        </text> */}
        <foreignObject x={x - margin} y={y + margin} width={width + 2 * margin} height={500} className="np-overflow-visible">
            <div ref={ref} className="np-w-full np-overflow-visible" />
        </foreignObject>
    </g>
}

export default React.memo(AgentBubble)