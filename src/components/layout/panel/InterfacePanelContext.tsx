
import React, { useContext, useLayoutEffect, useState } from "react"
import type * as NodePen from '@/types'
import { useDispatch } from "@/store"

export type InterfacePanelCallbacks = {
    apply: ReturnType<typeof useDispatch>['apply']
}

const InterfacePanelCallbacksContext = React.createContext<InterfacePanelCallbacks | undefined>(undefined)

type ProviderProps = React.PropsWithChildren<{}>

export const InterfacePanelCallbacksProvider = ({ children }: ProviderProps) => {
    const { apply } = useDispatch()

    const [callbacks, setCallbacks] = useState<InterfacePanelCallbacks>()

    useLayoutEffect(() => {
        setCallbacks({ apply })
    }, [apply])

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