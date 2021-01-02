import React, { MouseEvent, useEffect, useRef, useState } from 'react'
import { Glasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'
import { StaticComponent } from '../elements'

type ControlMode = 'idle' | 'panning'

export const GraphCanvas = (): React.ReactElement => {
  const { store: { elements, camera }, dispatch } = useGraphManager()

  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    dispatch({ type: 'graph/register-camera', ref: canvasRef })
  }, [])

  const [mode, setMode] = useState<ControlMode>('idle')
  const [[ax, ay], setAnchor] = useState<[number, number]>([0, 0])
  const [prev, setPrev] = useState(0)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (mode !== 'idle') {
      return
    }

    const { pageX, pageY } = e

    setAnchor([pageX, pageY])
    setPrev(Date.now())

    switch (e.button) {
      case 0:
        break
      case 2:
        setMode('panning')
        e.preventDefault()
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (Date.now() - prev < 50) {
      return
    }

    switch (mode) {
      case 'panning': {
        const { pageX: ex, pageY: ey } = e

        const [dx, dy] = [ax - ex, ay - ey]

        dispatch({ type: 'camera/pan', dx, dy })

        setAnchor([ex, ey])
        setPrev(Date.now())
      }
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>): void => {
    setMode('idle')
  }

  const blockContextMenu = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault()
  }

  const [dx, dy] = camera.position

  return (
    <div
      ref={canvasRef}
      className="w-full flex-grow bg-pale z-0 overflow-visible relative"
      style={{
        backgroundSize: '25px 25px',
        backgroundPosition: `${-dx % 25}px ${-dy % 25}px`,
        backgroundImage:
          'linear-gradient(to right, #98e2c6 0.3mm, transparent 1px, transparent 10px), linear-gradient(to bottom, #98e2c6 0.3mm, transparent 1px, transparent 10px)',
      }}
      onContextMenu={blockContextMenu}
      onMouseDown={handleMouseDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {
        canvasRef.current ? (
          <div id="element-container" className="w-full h-full relative overflow-visible" style={{ transform: `translate(${-dx}px, ${-dy}px)`, left: canvasRef.current.clientWidth / 2, top: canvasRef.current.clientHeight / 2 }}>
            {Object.values(elements).map((element) => {
              switch (element.template.type) {
                case 'static-component': {
                  return <StaticComponent key={`el-${element.id}`} instanceId={element.id} />
                }
              }
            })}
          </div>
        ) : null
      }
    </div>
  )
}