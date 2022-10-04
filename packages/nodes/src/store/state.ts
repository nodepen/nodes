import React from 'react'
import type * as NodePen from '@nodepen/core'
import type { LayoutTab } from '@/types'

export type RootState = {
  document: NodePen.Document,
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
    tabs: {
      current: LayoutTab
      configuration: {
        [key in LayoutTab]: {
          order: number
        }
      }
    }
  }
  registry: {
    canvasRoot: React.RefObject<HTMLDivElement>
    modelRoot: React.RefObject<HTMLDivElement>
    pseudoShadowTargets: {
      [shadowId: string]: React.RefObject<HTMLDivElement>
    }
  }
}

export const initialState: RootState = {
  document: {
    id: 'document-id',
    nodes: {
      'test-element-id-a': {
        instanceId: 'test-element-id-a',
        templateId: 'test-template-id',
        position: {
          x: 250,
          y: -500
        },
        dimensions: {
          width: 20,
          height: 20,
        },
        sources: {},
        inputs: {},
        outputs: {},
      },
      'test-element-id-b': {
        instanceId: 'test-element-id-b',
        templateId: 'test-template-id',
        position: {
          x: 650,
          y: -450
        },
        dimensions: {
          width: 20,
          height: 20,
        },
        sources: {},
        inputs: {},
        outputs: {},
      }
    },
    templates: {},
    version: 1
  },
  camera: {
    aspect: 1.5,
    position: {
      x: 0,
      y: 0,
    },
    zoom: 1,
  },
  layout: {
    tabs: {
      current: 'graph',
      configuration: {
        'graph': {
          order: 0
        },
        'model': {
          order: 1
        }
      }
    }
  },
  registry: {
    canvasRoot: React.createRef<HTMLDivElement>(),
    modelRoot: React.createRef<HTMLDivElement>(),
    pseudoShadowTargets: {}
  }
}