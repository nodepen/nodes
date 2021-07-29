import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { NodePen } from 'glib'
import { useGraphDispatch } from 'features/graph/store/graph/hooks'
import { useCameraDispatch, useCameraStaticPosition, useCameraStaticZoom } from 'features/graph/store/camera/hooks'
import { screenSpaceToCameraSpace } from '@/features/graph/utils'

type SelectionRegionProps = {
  region: NodePen.Element<'region'>
}

const SelectionRegion = ({ region }: SelectionRegionProps): React.ReactElement => {
  const { current, template } = region

  const { pointer } = template

  const {
    from: [fromX, fromY],
    to: [toX, toY],
    selection: { mode },
  } = current

  const { setMode } = useCameraDispatch()
  const cameraZoom = useCameraStaticZoom()
  const cameraPosition = useCameraStaticPosition()
  const { deleteElement, updateLiveElement, updateSelection } = useGraphDispatch()

  const lockRegion = useRef(false)

  useEffect(() => {
    // Clear existing selection on mount
    updateSelection({ mode: 'default', type: 'id', ids: [] })
  }, [])

  const handleMouseDown = useCallback((e: MouseEvent): void => {
    switch (e.button) {
      case 2: {
        lockRegion.current = true
      }
    }
  }, [])

  const handleMouseUp = useCallback((e: MouseEvent): void => {
    switch (e.button) {
      case 2: {
        lockRegion.current = false
      }
    }
  }, [])

  const handlePointerDown = useCallback(
    (e: PointerEvent | React.PointerEvent<HTMLDivElement>): void => {
      if (e.pointerId === pointer) {
        // This shouldn't happen, but we don't care regardless
        return
      }
    },
    [pointer]
  )

  const handlePointerMove = useCallback(
    (e: PointerEvent | React.PointerEvent<HTMLDivElement>): void => {
      if (lockRegion.current) {
        return
      }

      if (e.pointerId !== pointer) {
        return
      }

      const [cx, cy] = cameraPosition
      const { pageX: ex, pageY: ey } = e
      const [x, y] = screenSpaceToCameraSpace(
        { offset: [0, 48 + 36], position: [ex, ey] },
        { zoom: cameraZoom, position: [cx, cy] }
      )

      updateLiveElement({
        id: region.id,
        type: 'region',
        data: { to: [x, y] },
      })
    },
    [pointer, cameraPosition, cameraZoom, region.id, updateLiveElement]
  )

  const handlePointerUp = useCallback(
    (e: PointerEvent | React.PointerEvent<HTMLDivElement>): void => {
      if (e.pointerType === 'mouse' && e.button === 2) {
        lockRegion.current = false
        return
      }

      if (e.pointerId !== pointer) {
        // Toggle region setting on second tap
        const settingOrder: { [key: string]: typeof mode } = {
          default: 'add',
          add: 'remove',
          remove: 'default',
        }

        const nextSetting = settingOrder[mode]

        updateLiveElement({ id: region.id, type: 'region', data: { selection: { mode: nextSetting } } })
        return
      }
      // Do selection
      updateSelection({
        type: 'region',
        mode: mode,
        includeIntersection: fromX > toX,
        region: { from: [fromX, fromY], to: [toX, toY] },
      })

      setMode('idle')
      deleteElement(region.id)
    },
    [mode, setMode, updateSelection, updateLiveElement, deleteElement, region.id, pointer, fromX, fromY, toX, toY]
  )

  useEffect(() => {
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.addEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  })

  // Watch pointer motion from here
  const [min, max] = [
    { x: Math.min(fromX, toX), y: Math.min(fromY, toY) },
    { x: Math.max(fromX, toX), y: Math.max(fromY, toY) },
  ]

  const selectionModeIcon = useMemo(() => {
    switch (mode) {
      case 'add': {
        return (
          <div className="pr-3 flex items-center rounded-full bg-green">
            <div className="w-8 h-8 flex justify-center items-center">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="#093824"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-darkgreen whitespace-nowrap">Add to selection</p>
          </div>
        )
      }
      case 'remove': {
        return (
          <div className="pr-3 flex items-center rounded-full bg-green">
            <div className="w-8 h-8 flex justify-center items-center">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="#093824"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-darkgreen whitespace-nowrap">Remove from selection</p>
          </div>
        )
      }
      default: {
        return null
      }
    }
  }, [mode])

  return (
    <div
      className="absolute z-20"
      style={{ left: min.x, top: min.y, width: Math.abs(max.x - min.x), height: Math.abs(max.y - min.y) }}
    >
      <div
        className={`${
          fromX > toX ? 'border-dashed' : ''
        } flex justify-center items-center w-full h-full rounded-md border-darkgreen overflow-hidden`}
        style={{ borderWidth: cameraZoom > 1 ? 2 : `${2 / cameraZoom}px` }}
      >
        <div className="m-2 h-8 flex items-center">{selectionModeIcon}</div>
      </div>
    </div>
  )
}

export default React.memo(SelectionRegion)
