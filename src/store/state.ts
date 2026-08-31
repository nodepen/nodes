import React from 'react'
import { freeze } from 'immer'
import type * as NodePen from '@/types'
import type { ContextMenu, Tooltip } from '@/views/document-view/layers/transient-element-overlay/types'
import type { NodePortReference, WireEditMode } from '@/types'
import type { ModelGeometryType } from '@/types/geometry'
import type { InterfacePanelTarget } from '@/types/Interface'
import { DEFAULT_DOCUMENT_PREFERENCES } from '@/constants'

export type NodesAppState = {
    document: NodePen.Document
    templates: {
        [templateId: string]: NodePen.NodeTemplate
    }
    solution: {
        // Internal id of latest tacked solution
        id: string
        // Externally-supplied solution data
        data: NodePen.DocumentSolutionData | null
        // Internally-set flags computed from above
        flags: NodePen.DocumentSolutionFlags
        // Internally-set details about overall status
        messages: {
            document: NodePen.DocumentSolutionStatusMessage
            model: NodePen.DocumentSolutionStatusMessage
        }
    }
    assets: NodePen.DocumentAssets
    camera: {
        /** container div innerWidth / innerHeight in screen space */
        aspect: number
        /** coordinates of center pixel in container div in graph space */
        position: {
            x: number
            y: number
        }
        /** ratio of screen space pixel to graph space unit */
        zoom: number
    }
    app: {
        flags: NodePen.AppFlags
        features: NodePen.AppFeatures
    }
    ui: {
        preferences: NodePen.DocumentPreferences
        cursor: {
            x: number
            y: number
        }
        search: {
            target: {
                x: number
                y: number
            }
            action: 'agent-ask' | 'agent-edit' | 'add-node'
            actionId: string
        }
        sidebar: {
            isComponentLibraryOpen: boolean
            isParameterLibraryOpen: boolean
            isDocumentControlsOpen: boolean
            isAgentOpen: boolean
        }
        model: {
            selection: {
                [sourceKey: string]: string[]
            }
        } & (
            | {
                mode: 'default'
            }
            | {
                mode: 'select'
                selectionFilter: ModelGeometryType[]
                source: {
                    nodeInstanceId: string
                    portInstanceId: string
                }
            }
        )
    }
    geometry: {
        showGrid: boolean
    }
    presence: NodePen.DocumentPresence
    layout: {
        fileUpload: {
            isActive: boolean
            activeFile: File | null
            uploadStatus: 'none' | 'pending' | 'success' | 'failure'
        }
        nodePlacement: {
            isActive: boolean
            activeNodeId: string | null
            openOnEnd: ('agent')[]
        }
        viewConfiguration: Record<number, number>
        // activeView: string | null
    }
    clipboard: {
        pasteCount: number,
        nodes: NodePen.DocumentNode[]
    }
    registry: {
        canvasRoot: React.RefObject<HTMLDivElement | null>
        numberSliderInputRef: React.RefObject<HTMLInputElement | null>
        contextMenus: {
            [menuKey: string]: ContextMenu
        }
        documentControls: {
            activeDrawer: 'components' | 'params' | null
        }
        dialogRoot: React.RefObject<HTMLDivElement | null>
        shadows: {
            containerRef: React.RefObject<HTMLDivElement | null> | null
            proxyRefs: {
                [proxyKey: string]: React.RefObject<HTMLDivElement | null>
            }
            targets: {
                [shadowId: string]: {
                    ref: React.RefObject<HTMLDivElement | null>
                    /** The optional alternate element to observe for resize. */
                    resizeProxyKey?: string
                }
            }
        }
        hover: {
            nodeInstanceId: string | null
            portInstanceId: string | null
            branch: {
                path: string
                entryIndex: string
            } | null
        }
        drag: {
            isActive: boolean
            // If true, the active drag should be creating a copy of the selected items
            isCopyActive: boolean
            dx: number
            dy: number
        }
        selection: {
            nodes: string[]
            groups: string[]
            region:
            | {
                isActive: false
            }
            | {
                isActive: true
                /** World space */
                from: {
                    x: number
                    y: number
                }
                /** World space */
                to: {
                    x: number
                    y: number
                }
                pointerId: number
            }
        }
        tooltips: {
            [tooltipKey: string]: Tooltip
        }
        views: {
            [viewKey: string]: {
                label: string
                order: number
            }
        }
        wires: {
            underlayContainerRef: React.RefObject<SVGGElement | null>
            underlayContainerReady: boolean
            maskRef: React.RefObject<SVGMaskElement | null>
            maskReady: boolean
            live: {
                /** The current position of the cursor pointer in page space. */
                cursor: {
                    pointerId: number
                    position: {
                        x: number
                        y: number
                    }
                } | null
                /** The live wire connections to draw. */
                connections: {
                    [liveConnectionKey: string]: {
                        /** The port to connect one end of the wire to. */
                        portAnchor: NodePortReference
                        /** The end of the wire to connect to the given port. */
                        portAnchorType: 'output' | 'input'
                    }
                }
                /** The 'candidate' connection claimed on hover. Used for connection snapping. */
                target: NodePortReference | null
                mode: WireEditMode | null
            }
        }
        annotations: {
            overlayContainerRef: React.RefObject<SVGGElement | null>
            overlayContainerReady: boolean
            underlayContainerRef: React.RefObject<SVGGElement | null>
            underlayContainerReady: boolean
        }
        agent: {
            bubbles: {
                [bubbleId: string]: {
                    type: 'ask' | 'edit'
                    ref: React.RefObject<HTMLDivElement | null>
                    position: {
                        x: number
                        y: number
                    }
                    message: string
                }
            }
        }
        interface: Record<InterfacePanelTarget, React.RefObject<HTMLDivElement | null> | null>
    }
    callbacks: NodesAppCallbacks
    internalCallbacks: {
        zoomToExtents?: (nodeInstanceId?: string, portInstanceId?: string) => void
    }
}

export type NodesAppCallbacks = {
    // Document lifecycle
    onSaveDocument?: (state: NodesAppState) => void
    onModelUpload?: (state: NodesAppState) => void
    onUndo?: (state: NodesAppState) => void
    onRedo?: (state: NodesAppState) => void
    onThumbnailReady?: (state: NodesAppState) => void
    onHomePageReady?: (state: NodesAppState) => void
    // Interface buttons
    onClickAgent?: (state: NodesAppState) => void
    onClickHome?: (state: NodesAppState) => void
    onClickProfile?: (state: NodesAppState) => void
    onClickShare?: (state: NodesAppState) => void
    onClickFeedback?: (state: NodesAppState) => void
    onClickSettings?: (state: NodesAppState) => void
    onClickNewScript?: (state: NodesAppState) => void
    onClickSaveCopy?: (state: NodesAppState) => void
    onClickExport?: (state: NodesAppState) => void
    onClickImport?: (state: NodesAppState) => void
    onClickViewVersions?: (state: NodesAppState) => void
    onClickSaveVersion?: (state: NodesAppState) => void
    onClickRunDocument?: (state: NodesAppState) => void
    onSubmitSearch?: (state: NodesAppState) => void,
    // Presence
    onCameraMove?: (state: NodesAppState) => void,
    onCursorMove?: (state: NodesAppState) => void,
    onDrag?: (state: NodesAppState) => void,
    onDragEnd?: (state: NodesAppState) => void,
    onSelectionUpdated?: (state: NodesAppState) => void,
    onSelectionRegionUpdated?: (state: NodesAppState) => void,
    onWiresUpdated?: (state: NodesAppState) => void,
}

export const initialState: NodesAppState = {
    document: {
        id: 'default-id',
        meta: {
            name: 'default'
        },
        nodes: {},
        groups: {},
        controls: {
            input: [],
            output: [],
        },
        settings: {
            units: 'mm'
        },
        version: 1,
    },
    templates: freeze({}),
    solution: {
        id: 'initial',
        data: null,
        flags: {
            isExpired: false,
            isModelExpired: false,
            isFailed: false
        },
        messages: {
            document: {
                status: 'ok',
                message: 'Solver ready.'
            },
            model: {
                status: 'ok',
                message: 'Model ready.'
            }
        }
    },
    assets: {
        models: {}
    },
    presence: {
        sessionId: '',
        sessions: {},
        cursors: {},
        cameras: {},
        selection: {},
        selectionRegions: {},
        drag: {},
        wires: {},
        ghostNodes: {}
    },
    camera: {
        aspect: 1.5,
        position: {
            x: 0,
            y: 0,
        },
        zoom: 1
    },
    app: {
        features: {
            enableFileSave: true,
            enableFileSaveCopy: true,
            enableFileExport: true,
            enableFileImport: true,
            enableDocumentControls: true,
            enableDocumentVersions: true,
            enableShareButton: true,
            enableFeedbackButton: true,
            enableProfileButton: true,
            enableAgentButton: false
        },
        flags: {
            isEditable: true,
            isThumbnail: false,
            hideInterface: false,
            hideDocumentMenu: false,
            hideScript: false,
            hideControls: false
        }
    },
    ui: {
        preferences: DEFAULT_DOCUMENT_PREFERENCES,
        cursor: {
            x: 0,
            y: 0
        },
        search: {
            target: {
                x: 0,
                y: 0
            },
            action: 'add-node',
            actionId: ''
        },
        sidebar: {
            isComponentLibraryOpen: false,
            isParameterLibraryOpen: false,
            isDocumentControlsOpen: false,
            isAgentOpen: false
        },
        model: {
            mode: 'default',
            selection: {}
        }
    },
    geometry: {
        showGrid: true
    },
    layout: {
        fileUpload: {
            isActive: false,
            activeFile: null,
            uploadStatus: 'none',
        },
        nodePlacement: {
            isActive: false,
            activeNodeId: null,
            openOnEnd: [],
        },
        viewConfiguration: {
            0: 1,
            1: 0
        }
    },
    clipboard: {
        pasteCount: 0,
        nodes: []
    },
    registry: {
        canvasRoot: React.createRef<HTMLDivElement>(),
        numberSliderInputRef: React.createRef<HTMLInputElement>(),
        contextMenus: {},
        documentControls: {
            activeDrawer: null
        },
        dialogRoot: React.createRef<HTMLDivElement>(),
        shadows: {
            containerRef: null,
            proxyRefs: {
                controls: React.createRef<HTMLDivElement>(),
            },
            targets: {},
        },
        hover: {
            nodeInstanceId: null,
            portInstanceId: null,
            branch: null
        },
        drag: {
            isActive: false,
            isCopyActive: false,
            dx: 0,
            dy: 0
        },
        selection: {
            nodes: [],
            groups: [],
            region: {
                isActive: false,
            },
        },
        tooltips: {},
        views: {},
        wires: {
            underlayContainerRef: React.createRef<SVGGElement>(),
            underlayContainerReady: false,
            maskRef: React.createRef<SVGMaskElement>(),
            maskReady: false,
            live: {
                cursor: null,
                target: null,
                connections: {},
                mode: null,
            },
        },
        annotations: {
            overlayContainerRef: React.createRef<SVGGElement>(),
            overlayContainerReady: false,
            underlayContainerRef: React.createRef<SVGGElement>(),
            underlayContainerReady: false,
        },
        agent: {
            bubbles: {}
        },
        interface: {
            agent: null,
            controls: React.createRef<HTMLDivElement>(),
            versions: React.createRef<HTMLDivElement>()
        }
    },
    callbacks: {},
    internalCallbacks: {}
}
