
import React, { useContext, useLayoutEffect, useState } from "react"
import type * as NodePen from '@/types'
import { useDispatch, useStore } from "@/store"
import { usePageSpaceToWorldSpace } from "@/hooks"

const useNode = (instanceId: string): NodePen.DocumentNode | undefined =>
    useStore((state) => state.document.nodes[instanceId])

const usePreferences = (): NodePen.DocumentPreferences =>
    useStore((state) => state.ui.preferences)

export type InterfacePanelCallbacks = {
    apply: ReturnType<typeof useDispatch>['apply']
    pageSpaceToWorldSpace: ReturnType<typeof usePageSpaceToWorldSpace>
    useNode: typeof useNode
    usePreferences: typeof usePreferences
}

const InterfacePanelCallbacksContext = React.createContext<InterfacePanelCallbacks | undefined>(undefined)

type ProviderProps = React.PropsWithChildren<{}>

export const InterfacePanelCallbacksProvider = ({ children }: ProviderProps) => {
    const { apply } = useDispatch()

    const [callbacks, setCallbacks] = useState<InterfacePanelCallbacks>()

    const pageSpaceToWorldSpace = usePageSpaceToWorldSpace()

    useLayoutEffect(() => {
        setCallbacks({ apply, pageSpaceToWorldSpace, useNode, usePreferences })
    }, [apply, pageSpaceToWorldSpace])

    if (!callbacks) {
        return null
    }

    return <InterfacePanelCallbacksContext.Provider value={callbacks}>{children}</InterfacePanelCallbacksContext.Provider>
}

export const useInterfacePanelCallbacks = () => {
    const context = useContext(InterfacePanelCallbacksContext)

    if (!context) {
        throw new Error('Panel requires context!')
    }

    return context
}