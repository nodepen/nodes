import { useDispatch, useStore } from "@/store"
import { useLayoutEffect, useRef } from "react"

export const AgentPanel = () => {
    const containerRef = useRef<HTMLDivElement>(null)

    const { apply } = useDispatch()

    useLayoutEffect(() => {
        apply((state) => {
            state.registry.interface.agent = containerRef
        })
    }, [])

    return <div ref={containerRef} className="np-w-full np-h-full" />
}