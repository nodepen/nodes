import React, { useState, useEffect } from 'react'

type PointerMoveMode = 'idle' | 'pan' | 'select'

export const EditorGraph = (): JSX.Element => {
  const [[tx, ty], setPosition] = useState<[number, number]>([0, 0])
  const [[sx, sy], setStart] = useState<[number, number]>([0, 0])
  const [[ax, ay], setAnchor] = useState<[number, number]>([0, 0])
  const [previous, setPrevious] = useState(0)

  const [mode, setMode] = useState<PointerMoveMode>('idle')

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    const { screenX, screenY } = e
    setStart([screenX, screenY])
    setAnchor([screenX, screenY])

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

    if (now - previous < 50) {
      return
    }

    setPrevious(now)

    const [x, y] = [e.screenX, e.screenY]

    switch (mode) {
      case 'idle':
        return
      case 'pan': {
        const dx = x - ax
        const dy = y - ay

        setPosition([tx + dx, ty + dy])
        setAnchor([x, y])
        return
      }
      case 'select':
        console.log(`${sx},${sy} => ${x},${y}`)
        setAnchor([x, y])
        return
    }
  }

  const handlePointerUp = (e: PointerEvent): void => {
    setMode('idle')
  }

  const handleMouseUp = (e: MouseEvent): void => {
    setMode('idle')
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
    <div className="w-full flex-grow bg-pale" onMouseDown={handleMouseDown} onContextMenu={(e) => e.preventDefault()}>
      {tx}/{ty}
      {mode === 'select' ? (
        <div
          className="border-1 border-dark"
          style={{ position: 'fixed', left: sx, top: sy, width: ax - sx, height: ay - sy }}
        />
      ) : null}
    </div>
  )
}
