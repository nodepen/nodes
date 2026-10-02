import { createPortal } from 'react-dom'
import { useStore } from "$"
import { shallow } from "zustand/shallow"

type AgentBubbleContentProps = React.PropsWithChildren<{
    bubbleId: string
}>

export const AgentBubbleContent = ({ bubbleId, children }: AgentBubbleContentProps) => {
    const containerRef = useStore((state) => state.registry.agent.bubbles[bubbleId]?.ref ?? null, shallow)

    if (!containerRef || !containerRef.current) {
        return null
    }

    return createPortal(children, containerRef.current)
}