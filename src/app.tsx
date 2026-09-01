import React, { useCallback, useEffect, useLayoutEffect } from 'react'
import type * as NodePen from '@/types'
import { useDispatch, useStore } from '$'
import type { NodesAppCallbacks } from '$'
import { DEFAULT_DOCUMENT_PREFERENCES } from '@/constants'
import { deepEqual } from '@/utils/common'
import { ControlsContainer } from '@/components'
import { PseudoShadowsContainer } from './views/common'
import { StaticDialogLayer } from './views/static/dialog-layer'
import { DocumentView, ModelView } from './views'
import { InterfacePanelCallbacksProvider } from './components/layout/panel/InterfacePanelContext'

type NodesAppProps = {
    document: NodePen.Document
    solution: NodePen.DocumentSolutionData | null
    templates: NodePen.NodeTemplate[]
    assets: NodePen.DocumentAssets
    preferences?: NodePen.DocumentPreferences
    presence?: NodePen.DocumentPresence
    flags?: NodePen.AppFlags
    features?: NodePen.AppFlags
} & NodesAppCallbacks & {
    children?: React.ReactNode
}

export const NodesApp = ({
    document,
    templates,
    solution,
    assets,
    presence,
    preferences,
    flags,
    features,
    children,
    ...callbacks
}: NodesAppProps): React.ReactElement => {
    const { apply, loadDocument, loadTemplates, loadSolutionData, loadPreferences } = useDispatch()

    useEffect(() => {
        loadDocument(document)
    }, [document])

    useEffect(() => {
        apply((state) => {
            state.assets = assets
        })
    }, [assets])

    useEffect(() => {
        loadTemplates(templates ?? [])
    }, [templates])

    useEffect(() => {
        loadPreferences({ ...DEFAULT_DOCUMENT_PREFERENCES, ...preferences })
    }, [preferences])

    useEffect(() => {
        apply((state) => {
            state.callbacks = callbacks
        })
    }, [callbacks])

    useLayoutEffect(() => {
        apply((state) => {
            state.app.features = {
                ...state.app.features,
                ...features
            }
            state.app.flags = {
                ...state.app.flags,
                ...flags
            }
        })
    }, [features, flags])

    useEffect(() => {
        loadSolutionData(solution)
    }, [solution])

    // Mutate presence record to preserve object identity
    const syncPresenceRecord = useCallback(<T,>(current: Record<string, T>, next: Record<string, T> | undefined): void => {
        const source = next ?? {}

        for (const key of Object.keys(current)) {
            const nextEntry = source[key]
            if (nextEntry === undefined) {
                delete current[key]
            } else if (!deepEqual(current[key], nextEntry)) {
                current[key] = nextEntry
            }
        }
        for (const [key, nextEntry] of Object.entries(source)) {
            if (current[key] === undefined) {
                current[key] = nextEntry as T
            }
        }
    }, [])

    useEffect(() => {
        apply((state) => {
            state.presence.sessionId = presence?.sessionId ?? ''
            syncPresenceRecord(state.presence.sessions, presence?.sessions)
            syncPresenceRecord(state.presence.cursors, presence?.cursors)
            syncPresenceRecord(state.presence.cameras, presence?.cameras)
            syncPresenceRecord(state.presence.selection, presence?.selection)
            syncPresenceRecord(state.presence.selectionRegions, presence?.selectionRegions)
            syncPresenceRecord(state.presence.wires, presence?.wires)
            syncPresenceRecord(state.presence.drag, presence?.drag)
        })
    }, [
        presence?.sessionId,
        presence?.sessions,
        presence?.cursors,
        presence?.cameras,
        presence?.selection,
        presence?.selectionRegions,
        presence?.wires,
        presence?.drag,
    ])

    return <NodesAppInternal>{children}</NodesAppInternal>
}

const NodesAppInternal = React.memo(({ children }: React.PropsWithChildren<{}>) => {
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

    return (<InterfacePanelCallbacksProvider>
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
            {children}
        </div>
    </InterfacePanelCallbacksProvider>
    )
})
