import React from 'react'
import { CanvasGrid } from './canvas-grid'

const AnnotationContainer = (): React.ReactElement => {
  return <CanvasGrid />
}

export default React.memo(AnnotationContainer)
