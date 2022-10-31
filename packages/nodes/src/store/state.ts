import React from 'react'
import type * as NodePen from '@nodepen/core'

export type NodesAppState = {
  document: NodePen.Document,
  templates: {
    [templateId: string]: NodePen.NodeTemplate
  },
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
  },
  layout: {
    fileUpload: {
      isActive: boolean
      activeFile: File | null
      uploadStatus: 'none' | 'pending' | 'success' | 'failure'
    }
    activeView: string | null
  }
  stream: {
    id: string
    objectIds: string[]
  }
  registry: {
    canvasRoot: React.RefObject<HTMLDivElement>
    pseudoShadowTargets: {
      [shadowId: string]: React.RefObject<HTMLDivElement>
    }
    views: {
      [viewKey: string]: {
        label: string
        order: number
      }
    }
  }
  callbacks: NodesAppCallbacks
}

export type NodesAppCallbacks = {
  onDocumentChange?: (state: NodesAppState) => void
  onExpireSolution?: (state: NodesAppState) => void
  onFileUpload?: (state: NodesAppState) => Promise<void> | void
}

export const initialState: NodesAppState = {
  document: {
    id: 'default-id',
    nodes: {},
    configuration: {
      pinnedPorts: []
    },
    version: 1
  },
  templates: {},
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
      uploadStatus: 'none'
    },
    activeView: null
  },
  stream: {
    id: 'b0d3a3c122',
    objectIds: []
  },
  registry: {
    canvasRoot: React.createRef<HTMLDivElement>(),
    pseudoShadowTargets: {},
    views: {}
  },
  callbacks: {
    onDocumentChange: () => { console.log('From library!') },
    onExpireSolution: () => { console.log('From library!') }
  }
}