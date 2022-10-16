import React from 'react'
import type * as NodePen from '@nodepen/core'
import type { LayoutTab } from '@/types'

export type RootState = {
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
  callbacks: {
    onChange: (document: NodePen.Document) => void
  }
}

export const initialState: RootState = {
  document: {
    id: 'document-id',
    nodes: {
      'test-element-id-a': {
        instanceId: 'test-element-id-a',
        templateId: '845527a6-5cea-4ae9-a667-96ae1667a4e8',
        position: {
          x: 475,
          y: -375
        },
        dimensions: {
          width: 20,
          height: 20,
        },
        sources: {},
        values: {
          ['input-a']: {},
          ['input-b']: {
            '{0}': [
              {
                type: 'number',
                value: 3
              }
            ]
          },
          ['input-c']: {
            '{0}': [
              {
                type: 'number',
                value: 6
              }
            ]
          },
          ['input-d']: {}
        },
        inputs: {
          ['input-a']: 0,
          ['input-b']: 1,
          ['input-c']: 2,
          ['input-d']: 3
        },
        outputs: {
          ['output-a']: 0,
          ['output-b']: 1
        },
      },
    },
    configuration: {
      pinnedPorts: [
        {
          nodeInstanceId: 'test-element-id-a',
          portInstanceId: 'input-b'
        },
        {
          nodeInstanceId: 'test-element-id-a',
          portInstanceId: 'input-c'
        }
      ]
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
  },
  callbacks: {
    onChange: () => { console.log('🐍 Incorrect [onChange] callback called!') }
  }
}