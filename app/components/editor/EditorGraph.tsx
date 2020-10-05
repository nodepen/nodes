import React, { useState, useEffect, useContext } from 'react'
import { store } from './lib/state'

type PointerMoveMode = 'idle' | 'pan' | 'select'

export const EditorGraph = (): JSX.Element => {
  const { state, dispatch } = useContext(store)

  const [tx, ty] = state.camera.position

  //const [[tx, ty], setPosition] = useState<[number, number]>([0, 0])
  const [[sx, sy], setStart] = useState<[number, number]>([0, 0])
  const [[ax, ay], setAnchor] = useState<[number, number]>([0, 0])
  const [previous, setPrevious] = useState(0)

  const [mode, setMode] = useState<PointerMoveMode>('idle')

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if (mode !== 'idle') {
      return
    }

    const { pageX, pageY } = e
    setStart([pageX, pageY])
    setAnchor([pageX, pageY])

    switch (e.button) {
      case 0:
        setMode('select')
        break
      case 2:
        setMode('pan')
        e.preventDefault()
    }
  }

  const handlePointerMove = (e: PointerEvent): void => {
    const now = Date.now()

    if (now - previous < 25) {
      return
    }

    setPrevious(now)

    const [x, y] = [e.pageX, e.pageY]

    switch (mode) {
      case 'idle':
        return
      case 'pan': {
        const dx = x - ax
        const dy = y - ay

        dispatch({ type: 'camera/pan-camera', delta: [dx, dy] })
        setAnchor([x, y])
        return
      }
      case 'select':
        setAnchor([x, y])
        return
    }
  }

  const handlePointerUp = (e: PointerEvent): void => {
    setMode('idle')
  }

  const handleMouseUp = (e: MouseEvent): void => {
    switch (e.button) {
      case 0:
        if (mode !== 'select') {
          return
        }
        setMode('idle')
        return
      case 2:
        if (mode !== 'pan') {
          return
        }
        setMode('idle')
        return
    }
  }

  // Add pointermove and pointerup handlers to document
  useEffect(() => {
    document.documentElement.addEventListener('pointermove', handlePointerMove)
    document.documentElement.addEventListener('pointerup', handlePointerUp)
    document.documentElement.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.documentElement.removeEventListener('pointermove', handlePointerMove)
      document.documentElement.removeEventListener('pointerup', handlePointerUp)
      document.documentElement.removeEventListener('mouseup', handleMouseUp)
    }
  })

  return (
    <div
      className="w-full flex-grow bg-pale overflow-hidden"
      onMouseDown={handleMouseDown}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        backgroundSize: '25px 25px',
        backgroundPosition: `${tx % 25}px ${ty % 25}px`,
        backgroundImage:
          'linear-gradient(to right, #98e2c6 0.3mm, transparent 1px, transparent 10px), linear-gradient(to bottom, #98e2c6 0.3mm, transparent 1px, transparent 10px)',
      }}
    >
      <div
        className="relative border-2 border-dark rounded-sm transition-opacity duration-100"
        style={{
          left: Math.min(ax, sx),
          top: Math.min(ay, sy) - 115,
          width: Math.abs(ax - sx),
          height: Math.abs(ay - sy),
          opacity: mode === 'select' ? 100 : 0,
        }}
      />
    </div>
  )
}
