import React from 'react'
import type * as NodePen from '@nodepen/core'

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
  registry: {
    canvasRoot: React.RefObject<HTMLDivElement>
  }
}

export const initialState: RootState = {
  document: {
    id: 'document-id',
    nodes: {
      'test-element-id-a': {
        id: 'test-element-id-a',
        template: 'test-template-id',
        position: {
          x: 5,
          y: -5
        },
        dimensions: {
          width: 20,
          height: 20,
        }
      },
      'test-element-id-b': {
        id: 'test-element-id-b',
        template: 'test-template-id',
        position: {
          x: 5,
          y: -200
        },
        dimensions: {
          width: 20,
          height: 20,
        }
      }
    },
    templates: {},
    version: 1
  },
  camera: {
    aspect: 1.5,
    position: {
      x: 250,
      y: 0,
    },
    zoom: 1,
  },
  registry: {
    canvasRoot: React.createRef<HTMLDivElement>()
  }
}