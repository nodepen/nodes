import React, { useCallback, useEffect, useRef } from 'react'
import { NodePen } from 'glib'
import { CommonRegion } from './lib'
import { useGraphDispatch } from 'features/graph/store/graph/hooks'
import { useCameraDispatch } from 'features/graph/store/camera/hooks'

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

  const { setMode } = useCameraDispatch()
  const { deleteElement } = useGraphDispatch()

  const regionRef = useRef<HTMLDivElement>(null)

  const handlePointerMove = useCallback((e: PointerEvent): void => {
    const { pageX, pageY } = e
    console.log([pageX, pageY])
  }, [])

  const handlePointerUp = useCallback((): void => {
    setMode('idle')
    deleteElement(region.id)
  }, [setMode, deleteElement, region.id])

  const handleTouchEnd = useCallback((): void => {
    alert('touchend')
  }, [])

  const fallbackToWindow = useRef(false)

  useEffect(() => {
    if (!fallbackToWindow.current) {
      return
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  })

  useEffect(() => {
    window.navigator.vibrate(300)

    if (!regionRef.current) {
      return
    }

    try {
      regionRef.current.setPointerCapture(pointer)
    } catch {
      fallbackToWindow.current = true
    }
  }, [])

  // Watch pointer motion from here

  return (
    <div
      ref={regionRef}
      // onGotPointerCapture={() => alert('nice')}
      onPointerUp={(): void => {
        handlePointerUp()
      }}
    >
      <CommonRegion style={{}} />
    </div>
  )
}

export default React.memo(SelectionRegion)
