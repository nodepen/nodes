import { useStore } from "$"
import React, { useRef } from "react"
import { Layer } from "../common"
import { useViewRegistry } from "../common/hooks"

const ModelView = () => {
    const [position, preciseWidth] = useViewRegistry({ key: 'model', label: 'Model' })

    const containerRef = useRef<HTMLDivElement>(null)

    const solutionData = useStore((state) => state.solution)

    const width = Math.round(preciseWidth * 1000) / 1000
    const translation = (100 - (width * 100)) / -2

    return (
        <Layer id="np-model-layer" position={position} z={10}>
            <div className="np-w-full np-h-full np-pointer-events-auto np-bg-pale" ref={containerRef} style={{ transform: `translateX(${translation}%)` }} />
        </Layer>
    )
}

export default React.memo(ModelView)