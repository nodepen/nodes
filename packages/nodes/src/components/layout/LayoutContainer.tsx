import React from 'react'
import { CanvasGrid } from './canvas-grid'

const LayoutContainer = (): React.ReactElement => {
  return <CanvasGrid />
}

export default React.memo(LayoutContainer)
