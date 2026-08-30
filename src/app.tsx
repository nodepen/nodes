import React, { useCallback, useEffect, useLayoutEffect } from 'react'
import type * as NodePen from '@/types'
import { freeze } from 'immer'
import { useDispatch, useStore } from '$'
import type { NodesAppCallbacks } from '$'
import { DEFAULT_DOCUMENT_PREFERENCES } from '@/constants'
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
        // apply((state) => {
        //     state.ui.sidebar.isDocumentControlsOpen = (document.controls.input.length > 0) || (document.controls.output.length > 0)
        // })
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

    useEffect(() => {
        apply((state) => {
            state.presence.sessionId = presence?.sessionId ?? ''
        })
    }, [presence?.sessionId])

    useEffect(() => {
        apply((state) => {
            for (const key of Object.keys(state.presence.sessions)) {
                const nextEntry = presence?.sessions?.[key]
                if (nextEntry === undefined) {
                    delete state.presence.sessions[key]
                } else if (JSON.stringify(state.presence.sessions[key]) !== JSON.stringify(nextEntry)) {
                    state.presence.sessions[key] = nextEntry
                }
            }
            for (const [key, nextEntry] of Object.entries(presence?.sessions ?? {})) {
                if (state.presence.sessions[key] === undefined) {
                    state.presence.sessions[key] = nextEntry
                }
            }
        })
    }, [presence?.sessions])

    useEffect(() => {
        apply((state) => {
            for (const key of Object.keys(state.presence.cursors)) {
                const nextEntry = presence?.cursors?.[key]
                if (nextEntry === undefined) {
                    delete state.presence.cursors[key]
                } else if (JSON.stringify(state.presence.cursors[key]) !== JSON.stringify(nextEntry)) {
                    state.presence.cursors[key] = nextEntry
                }
            }
            for (const [key, nextEntry] of Object.entries(presence?.cursors ?? {})) {
                if (state.presence.cursors[key] === undefined) {
                    state.presence.cursors[key] = nextEntry
                }
            }
        })
    }, [presence?.cursors])

    useEffect(() => {
        apply((state) => {
            for (const key of Object.keys(state.presence.cameras)) {
                const nextEntry = presence?.cameras?.[key]
                if (nextEntry === undefined) {
                    delete state.presence.cameras[key]
                } else if (JSON.stringify(state.presence.cameras[key]) !== JSON.stringify(nextEntry)) {
                    state.presence.cameras[key] = nextEntry
                }
            }
            for (const [key, nextEntry] of Object.entries(presence?.cameras ?? {})) {
                if (state.presence.cameras[key] === undefined) {
                    state.presence.cameras[key] = nextEntry
                }
            }
        })
    }, [presence?.cameras])

    useEffect(() => {
        apply((state) => {
            for (const key of Object.keys(state.presence.selection)) {
                const nextEntry = presence?.selection?.[key]
                if (nextEntry === undefined) {
                    delete state.presence.selection[key]
                } else if (JSON.stringify(state.presence.selection[key]) !== JSON.stringify(nextEntry)) {
                    state.presence.selection[key] = nextEntry
                }
            }
            for (const [key, nextEntry] of Object.entries(presence?.selection ?? {})) {
                if (state.presence.selection[key] === undefined) {
                    state.presence.selection[key] = nextEntry
                }
            }
        })
    }, [presence?.selection])

    useEffect(() => {
        apply((state) => {
            for (const key of Object.keys(state.presence.selectionRegions)) {
                const nextEntry = presence?.selectionRegions?.[key]
                if (nextEntry === undefined) {
                    delete state.presence.selectionRegions[key]
                } else if (JSON.stringify(state.presence.selectionRegions[key]) !== JSON.stringify(nextEntry)) {
                    state.presence.selectionRegions[key] = nextEntry
                }
            }
            for (const [key, nextEntry] of Object.entries(presence?.selectionRegions ?? {})) {
                if (state.presence.selectionRegions[key] === undefined) {
                    state.presence.selectionRegions[key] = nextEntry
                }
            }
        })
    }, [presence?.selectionRegions])

    useEffect(() => {
        apply((state) => {
            for (const key of Object.keys(state.presence.wires)) {
                const nextEntry = presence?.wires?.[key]
                if (nextEntry === undefined) {
                    delete state.presence.wires[key]
                } else if (JSON.stringify(state.presence.wires[key]) !== JSON.stringify(nextEntry)) {
                    state.presence.wires[key] = nextEntry
                }
            }
            for (const [key, nextEntry] of Object.entries(presence?.wires ?? {})) {
                if (state.presence.wires[key] === undefined) {
                    state.presence.wires[key] = nextEntry
                }
            }
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

    useEffect(() => {
        apply((state) => {
            const nextGhostNodes = presence?.ghostNodes ?? {}

            const previousGhostIds = new Set<string>()
            for (const nodes of Object.values(state.presence.ghostNodes)) {
                for (const node of nodes) {
                    previousGhostIds.add(node.instanceId)
                }
            }

            for (const key of Object.keys(state.presence.ghostNodes)) {
                const nextEntry = nextGhostNodes[key]
                if (nextEntry === undefined) {
                    delete state.presence.ghostNodes[key]
                } else if (JSON.stringify(state.presence.ghostNodes[key]) !== JSON.stringify(nextEntry)) {
                    state.presence.ghostNodes[key] = nextEntry
                }
            }
            for (const [key, nextEntry] of Object.entries(nextGhostNodes)) {
                if (state.presence.ghostNodes[key] === undefined) {
                    state.presence.ghostNodes[key] = nextEntry
                }
            }

            const liveGhostIds = new Set<string>()
            for (const nodes of Object.values(state.presence.ghostNodes)) {
                for (const node of nodes) {
                    liveGhostIds.add(node.instanceId)
                    state.document.nodes[node.instanceId] = {
                        ...node,
                        status: {
                            ...node.status,
                            isProvisional: true
                        }
                    }
                }
            }

            for (const nodeId of previousGhostIds) {
                if (liveGhostIds.has(nodeId)) {
                    continue
                }

                const placed = state.document.nodes[nodeId]

                if (placed && !placed.status.isProvisional) {
                    continue
                }

                delete state.document.nodes[nodeId]
            }
        })
    }, [presence?.ghostNodes, document])

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
