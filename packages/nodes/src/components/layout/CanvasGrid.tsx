import React, { useEffect, useRef, useState } from 'react'
import { useStore } from '$'
import { CAMERA, COLORS } from '@/constants'

type GridDetailLevel = 'low' | 'medium' | 'high'

const CanvasGrid = (): React.ReactElement | null => {
  const [detailLevel, setDetailLevel] = useState<GridDetailLevel>('medium')

  const previousDetailLevel = useRef<GridDetailLevel>(detailLevel)
  useEffect(
    () =>
      useStore.subscribe((state) => {
        const zoom = state.camera.zoom

        let nextDetailLevel: GridDetailLevel = 'low'

        if (zoom > CAMERA.ZOOM_BREAKPOINT_NEAR) {
          nextDetailLevel = 'high'
        } else if (zoom > CAMERA.ZOOM_BREAKPOINT_FAR) {
          nextDetailLevel = 'medium'
        } else {
          nextDetailLevel = 'low'
        }

        if (previousDetailLevel.current !== nextDetailLevel) {
          setDetailLevel(nextDetailLevel)
        }

        previousDetailLevel.current = nextDetailLevel
      }),
    []
  )

  const getGridSpacing = (detail: GridDetailLevel): number => {
    switch (detail) {
      case 'low': {
        return 200
      }
      case 'medium': {
        return 100
      }
      case 'high': {
        return 50
      }
    }
  }

  const getGridCount = (detail: GridDetailLevel): number => {
    switch (detail) {
      case 'low': {
        return 50
      }
      case 'medium': {
        return 100
      }
      case 'high': {
        return 200
      }
    }
  }

  const GRID_SPACING = getGridSpacing(detailLevel)
  const GRID_COUNT = getGridCount(detailLevel)

  const lineProps: Partial<React.SVGProps<SVGLineElement>> = {
    fill: 'none',
    stroke: COLORS.GREEN,
    strokeWidth: '0.3mm',
    vectorEffect: 'non-scaling-stroke',
  }

  return (
    <>
      {Array(GRID_COUNT)
        .fill('')
        .map((_, i) => {
          const n = i * GRID_SPACING
          const extent = GRID_SPACING * GRID_COUNT

          return (
            <React.Fragment key={`grid-position-${i}`}>
              <line {...lineProps} x1={n} y1={0} x2={n} y2={extent} />
              <line {...lineProps} x1={0} y1={n} x2={extent} y2={n} />
            </React.Fragment>
          )
        })}
    </>
  )
}

export default React.memo(CanvasGrid)
