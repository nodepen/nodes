import { useLayoutEffect, useRef, useState } from "react"
import type { TooltipConfiguration } from "../../types"
import type { GenericTextTooltipContext } from "../../types/TooltipContext"
import { useTooltip } from "../hooks"
import { clamp } from "@/utils"

type Props = {
    tooltipKey: string
    config: TooltipConfiguration
    context: GenericTextTooltipContext
}

export const GenericTextTooltip = ({ tooltipKey, config, context }: Props) => {
    const { position } = config
    const { textContent, hotkeys } = context

    const { x: cx, y: cy } = position

    const containerRef = useRef<HTMLDivElement>(null)

    const [left, setLeft] = useState(cx)
    const [top, setTop] = useState(cy)

    const pageMargin = 24

    useLayoutEffect(() => {
        const el = containerRef.current

        if (!el) {
            return
        }

        const { left, width, top, height } = el.getBoundingClientRect()

        const nextLeft = clamp(cx - (width / 2), pageMargin, document.documentElement.clientWidth - width - pageMargin)

        setLeft(nextLeft)
        setTop(cy - (height / 2))
    }, [textContent])

    return <div ref={containerRef} className="np-absolute np-p-1 np-pl-2 np-pr-2 np-rounded-full np-bg-light np-shadow-main" style={{ left, top }}>
        <p className="np-text-xs np-text-dark np-font-panel">
            {textContent}
        </p>
    </div>
}