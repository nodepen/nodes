import type React from "react"
import { createPortal } from 'react-dom'
import { useStore } from '@/store'
import type { InterfacePanelTarget } from "@/types/Interface"
import { shallow } from "zustand/shallow"

type InterfacePanelProps = React.PropsWithChildren<{
    target: InterfacePanelTarget
    targetId?: string
}>

export const InterfacePanel = ({ target, targetId, children }: InterfacePanelProps) => {
    const targetRef = useStore((state) => state.registry.interface[target], shallow)

    if (!targetRef || !targetRef.current) {
        return null
    }

    return createPortal(children, targetRef.current)
}