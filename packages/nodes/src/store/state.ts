import React from 'react'
import { freeze } from 'immer'
import type * as NodePen from '@nodepen/core'
import type { ContextMenu, Tooltip } from '@/views/document-view/layers/transient-element-overlay/types'
import type { NodePortReference, WireEditMode } from '@/types'

export type NodesAppState = {
  document: NodePen.Document
  templates: {
    [templateId: string]: NodePen.NodeTemplate
  }
  solution: NodePen.DocumentSolutionData
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
    activeView: string | null
  }
  stream: {
    id: string
    objectIds: string[]
  }
  registry: {
    canvasRoot: React.RefObject<HTMLDivElement>
    contextMenus: {
      [menuKey: string]: ContextMenu
    }
    dialogRoot: React.RefObject<HTMLDivElement>
    shadows: {
      containerRef: React.RefObject<HTMLDivElement> | null
      proxyRefs: {
        [proxyKey: string]: React.RefObject<HTMLDivElement>
      }
      targets: {
        [shadowId: string]: {
          ref: React.RefObject<HTMLDivElement>
          /** The optional alternate element to observe for resize. */
          resizeProxyKey?: string
        }
      }
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
      underlayContainerRef: React.RefObject<SVGGElement>
      maskRef: React.RefObject<SVGMaskElement>
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
  }
  lifecycle: {
    solution: 'expired' | 'ready'
    model: {
      status: 'expired' | 'loading' | 'ready'
      /** A value between 0 & 1 */
      progress: number
      objectCount: number
    }
  }
  cache: {
    portSolutionData: {
      [cacheKey: string]: NodePen.PortSolutionData
    }
  }
  callbacks: NodesAppCallbacks
}

export type NodesAppCallbacks = {
  onExpireSolution?: (state: NodesAppState) => void
  onFileUpload?: (state: NodesAppState) => Promise<void> | void
  getPortSolutionData?: (nodeInstanceId: string, portInstanceId: string) => Promise<NodePen.PortSolutionData | null>
}

export const initialState: NodesAppState = {
  document: {
    id: 'default-id',
    nodes: {},
    configuration: {
      inputs: [],
      outputs: [],
    },
    version: 1,
  },
  templates: freeze({}),
  solution: freeze({
    solutionId: 'initial',
    documentRuntimeData: {
      durationMs: 0,
    },
    nodeSolutionData: [],
  }),
  camera: {
    aspect: 1.5,
    position: {
      x: 0,
      y: 0,
    },
    zoom: 1,
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
    activeView: null,
  },
  stream: {
    id: 'b0d3a3c122',
    objectIds: [],
  },
  registry: {
    canvasRoot: React.createRef<HTMLDivElement>(),
    contextMenus: {},
    dialogRoot: React.createRef<HTMLDivElement>(),
    shadows: {
      containerRef: null,
      proxyRefs: {
        controls: React.createRef<HTMLDivElement>(),
      },
      targets: {},
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
  },
  lifecycle: {
    solution: 'expired',
    model: {
      status: 'expired',
      progress: 0,
      objectCount: 0,
    },
  },
  cache: {
    portSolutionData: {},
  },
  callbacks: {},
}
