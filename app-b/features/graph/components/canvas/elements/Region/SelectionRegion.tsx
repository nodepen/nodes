import React, { useCallback, useEffect, useRef } from 'react'
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
  const { deleteElement, updateLiveElement } = useGraphDispatch()

  const lockRegion = useRef(false)

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
      // alert(`from: [${fromX}, ${fromY}] | to: [${toX}, ${toY}]`)
      setMode('idle')
      deleteElement(region.id)
    },
    [mode, setMode, updateLiveElement, deleteElement, region.id, pointer, fromX, fromY, toX, toY]
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

  return (
    <div
      className="absolute z-20"
      style={{ left: min.x, top: min.y, width: Math.abs(max.x - min.x), height: Math.abs(max.y - min.y) }}
    >
      <div
        className={`${fromX > toX ? 'border-dashed' : ''} ${
          mode === 'default' ? '' : mode === 'add' ? 'bg-blue-500' : 'bg-red-500'
        } w-full h-full rounded-md border-darkgreen`}
        style={{ borderWidth: cameraZoom > 1 ? 2 : `${2 / cameraZoom}px` }}
      />
    </div>
  )
}

export default React.memo(SelectionRegion)
