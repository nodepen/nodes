import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NodePen } from 'glib'
import { CommonRegion } from './lib'
import { useGraphDispatch } from 'features/graph/store/graph/hooks'
import { useCameraDispatch } from 'features/graph/store/camera/hooks'
import { useSessionManager } from 'context/session'

type SelectionRegionProps = {
  region: NodePen.Element<'region'>
}

const SelectionRegion = ({ region }: SelectionRegionProps): React.ReactElement => {
  const { current, template } = region

  const { pointer } = template

  const {
    from: [fromX, fromY],
    to: [toX, toY],
    selection: mode,
  } = current

  const { device } = useSessionManager()
  const { setMode } = useCameraDispatch()
  const { deleteElement } = useGraphDispatch()

  const regionRef = useRef<HTMLDivElement>(null)

  const handlePointerMove = useCallback((e: PointerEvent | React.PointerEvent<HTMLDivElement>): void => {
    const { pageX, pageY } = e
    console.log([pageX, pageY])
  }, [])

  const handlePointerUp = useCallback((): void => {
    setMode('idle')
    deleteElement(region.id)
  }, [setMode, deleteElement, region.id])

  const [fallbackToWindow, setFallbackToWindow] = useState(false)

  useEffect(() => {
    if (!fallbackToWindow) {
      return
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  })

  useEffect(() => {
    if (device.iOS) {
      setFallbackToWindow(true)
      return
    }

    if (!regionRef.current) {
      return
    }

    try {
      regionRef.current.setPointerCapture(pointer)
    } catch {
      setFallbackToWindow(true)
    }
  }, [])

  // Watch pointer motion from here

  return (
    <div
      ref={regionRef}
      onGotPointerCapture={(e) => e.preventDefault()}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <CommonRegion style={{}} />
    </div>
  )
}

export default React.memo(SelectionRegion)
