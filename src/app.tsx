import React, { useCallback, useEffect } from 'react'
import type * as NodePen from '@/types'
import { freeze } from 'immer'
import { useDispatch, useStore } from '$'
import type { NodesAppCallbacks } from '$'
import { ControlsContainer } from '@/components'
import { PseudoShadowsContainer } from './views/common'
import { StaticDialogLayer } from './views/static/dialog-layer'
import { DocumentView, ModelView } from './views'

type NodesAppProps = {
    document: NodePen.Document
    solution: NodePen.DocumentSolutionData | null
    templates: NodePen.NodeTemplate[]
    assets: NodePen.DocumentAssets
    presence?: NodePen.DocumentPresence
} & NodesAppCallbacks

export const NodesApp = ({
    document,
    templates,
    solution,
    assets,
    presence,
    ...callbacks
}: NodesAppProps): React.ReactElement => {
    const { apply, loadDocument, loadTemplates, loadSolutionData } = useDispatch()

    useEffect(() => {
        loadDocument(document)
    }, [document])

    useEffect(() => {
        // Resets on new document
    }, [document.id])

    useEffect(() => {
        apply((state) => {
            state.assets = assets
        })
    }, [assets])

    useEffect(() => {
        loadTemplates(templates ?? [])
    }, [templates])

    useEffect(() => {
        apply((state) => {
            state.callbacks = callbacks
        })
    }, [callbacks])

    useEffect(() => {
        loadSolutionData(solution)
    }, [solution])

    useEffect(() => {
        apply((state) => {
            state.presence.sessionId = presence?.sessionId ?? ''
        })
    }, [presence?.sessionId])

    useEffect(() => {
        apply((state) => {
            state.presence.sessions = presence?.sessions ?? {}
        })
    }, [presence?.sessions])

    useEffect(() => {
        apply((state) => {
            state.presence.cursors = presence?.cursors ?? {}
        })
    }, [presence?.cursors])

    useEffect(() => {
        apply((state) => {
            state.presence.cameras = presence?.cameras ?? {}
        })
    }, [presence?.cameras])

    useEffect(() => {
        apply((state) => {
            state.presence.selection = presence?.selection ?? {}
        })
    }, [presence?.selection])

    useEffect(() => {
        apply((state) => {
            state.presence.selectionRegions = presence?.selectionRegions ?? {}
        })
    }, [presence?.selectionRegions])

    useEffect(() => {
        apply((state) => {
            state.presence.wires = presence?.wires ?? {}
        })
    }, [presence?.wires])

    useEffect(() => {
        apply((state) => {
            for (const [nodeInstanceId, currentSessionData] of Object.entries(state.presence.drag)) {
                const nextSessionData = presence?.drag?.[nodeInstanceId] ?? {}
                if (JSON.stringify(currentSessionData) !== JSON.stringify(nextSessionData)) {
                    state.presence.drag[nodeInstanceId] = nextSessionData
                }
            }
            for (const [nodeInstanceId, nextSessionData] of Object.entries(presence?.drag ?? {})) {
                const currentSessionData = state.presence.drag[nodeInstanceId] ?? {}
                if (JSON.stringify(currentSessionData) !== JSON.stringify(nextSessionData)) {
                    state.presence.drag[nodeInstanceId] = nextSessionData
                }
            }
        })
    }, [presence?.drag])

    return <NodesAppInternal />
}

const NodesAppInternal = React.memo(() => {
    const canvasRootRef = useStore((state) => state.registry.canvasRoot)

    const { apply } = useDispatch()

    const handleDragEnter = useCallback((_e: React.DragEvent<HTMLDivElement>) => {
        apply((state) => {
            if (state.layout.fileUpload.isActive) {
                return
            }

            state.layout.fileUpload = {
                isActive: true,
                activeFile: null,
                uploadStatus: 'none',
            }
        })
    }, [])

    return (
        <div
            id="np-app-root"
            className="np-w-full np-h-full np-relative np-overflow-hidden no-drag"
            ref={canvasRootRef}
            onDragStart={(e) => e.preventDefault()}
        >
            {/* <FileUploadOverlayContainer /> */}
            <ControlsContainer />
            <PseudoShadowsContainer />
            <StaticDialogLayer />
            <DocumentView />
            <ModelView />
        </div>
    )
})
