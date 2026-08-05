import React from 'react'
import { freeze } from 'immer'
import type * as NodePen from '@/types'
import type { ContextMenu, Tooltip } from '@/views/document-view/layers/transient-element-overlay/types'
import type { NodePortReference, WireEditMode } from '@/types'
import type { ModelGeometryType } from '@/types/geometry'

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

    user?: {
        name?: string
        email?: string
        image?: string
        token?: string
    }
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
    ui: {
        cursor: {
            x: number
            y: number
        }
        sidebar: {
            isComponentLibraryOpen: boolean
            isParameterLibraryOpen: boolean
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
            maskRef: React.RefObject<SVGMaskElement | null>
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
            underlayContainerRef: React.RefObject<SVGGElement | null>
        }
    }
    callbacks: NodesAppCallbacks
    internalCallbacks: {
        zoomToExtents?: (nodeInstanceId?: string, portInstanceId?: string) => void
    }
}

export type NodesAppCallbacks = {
    onSaveDocument?: (state: NodesAppState) => void
    onModelUpload?: (state: NodesAppState) => void
    onClickHome?: (state: NodesAppState) => void
    onClickProfile?: (state: NodesAppState) => void
    onClickShare?: (state: NodesAppState) => void
    onClickFeedback?: (state: NodesAppState) => void
    onClickSettings?: (state: NodesAppState) => void
    onCursorMove?: (state: NodesAppState) => void,
    onDrag?: (state: NodesAppState) => void,
    onDragEnd?: (state: NodesAppState) => void,
    onSelectionUpdated?: (state: NodesAppState) => void,
    onSelectionRegionUpdated?: (state: NodesAppState) => void,
    onWiresUpdated?: (state: NodesAppState) => void,
    onUndo?: (state: NodesAppState) => void
    onRedo?: (state: NodesAppState) => void
}

export const initialState: NodesAppState = {
    document: {
        id: 'default-id',
        meta: {
            name: 'default'
        },
        nodes: {},
        controls: {
            inputs: [],
            outputs: [],
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
        wires: {}
    },
    camera: {
        aspect: 1.5,
        position: {
            x: 0,
            y: 0,
        },
        zoom: 1
    },
    ui: {
        cursor: {
            x: 0,
            y: 0
        },
        sidebar: {
            isComponentLibraryOpen: false,
            isParameterLibraryOpen: false
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
            region: {
                isActive: false,
            },
        },
        tooltips: {},
        views: {},
        wires: {
            underlayContainerRef: React.createRef<SVGGElement>(),
            maskRef: React.createRef<SVGMaskElement>(),
            live: {
                cursor: null,
                target: null,
                connections: {},
                mode: null,
            },
        },
        annotations: {
            overlayContainerRef: React.createRef<SVGGElement>(),
            underlayContainerRef: React.createRef<SVGGElement>()
        }
    },
    callbacks: {},
    internalCallbacks: {}
}
