import { NodePen, Grasshopper } from 'glib'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSetCameraPosition } from 'features/graph/hooks'
import { useDebugRender } from '@/hooks'
import {
  useCameraDispatch,
  useCameraStaticPosition,
  useCameraStaticZoom,
  useGraphDispatch,
} from 'features/graph/store/hooks'
import { screenSpaceToCameraSpace } from 'features/graph/utils'

type StaticComponentParameterProps = {
  parent: NodePen.Element<'static-component'>
  template: Grasshopper.Parameter & { id: string }
  mode: 'input' | 'output'
}

const StaticComponentParameter = ({ parent, template, mode }: StaticComponentParameterProps): React.ReactElement => {
  const { current, id: elementId } = parent
  const { name, nickname, type, id: parameterId } = template

  useDebugRender(`StaticComponentParameter | ${parent.template.name} | ${name} | ${parameterId}`)

  const { registerElementAnchor } = useGraphDispatch()
  const cameraZoom = useCameraStaticZoom()
  const cameraPosition = useCameraStaticPosition()

  const { setMode } = useCameraDispatch()
  const setCameraPosition = useSetCameraPosition()

  const gripRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gripRef.current) {
      return
    }

    const { width, height, left, top } = gripRef.current.getBoundingClientRect()

    const [sx, sy] = [left + width / 2, top + height / 2]

    const [x, y] = screenSpaceToCameraSpace(
      { offset: [0, 48 + 36], position: [sx, sy] },
      { zoom: cameraZoom, position: cameraPosition }
    )

    const [ex, ey] = current.position
    const [dx, dy] = [x - ex, y - ey]

    registerElementAnchor({ elementId, anchorId: parameterId, position: [dx, dy] })
  }, [])

  const grip = useMemo(() => {
    const tx = mode === 'input' ? 'translateX(-9px)' : 'translateX(9px)'
    const d = mode === 'input' ? 'M5,2 a1,1 0 0,0 0,8' : 'M5,10 a1,1 0 0,0 0,-8'

    return (
      <div ref={gripRef} className="w-4 h-4 overflow-visible" style={{ transform: tx }}>
        <svg className="w-4 h-4 overflow-visible" viewBox="0 0 10 10">
          <path d={d} fill="#333" stroke="#333" strokeWidth="2px" vectorEffect="non-scaling-stroke" />
          <circle cx="5" cy="5" r="4" stroke="#333" strokeWidth="2px" vectorEffect="non-scaling-stroke" fill="#FFF" />
        </svg>
      </div>
    )
  }, [mode])

  const body = useMemo(() => {
    return mode === 'input' ? (
      <>
        {grip}
        <p>{nickname}</p>
      </>
    ) : (
      <>
        <p>{nickname}</p>
        {grip}
      </>
    )
  }, [grip, mode, nickname])

  const border = mode === 'input' ? 'border-l-2 rounded-tr-md rounded-br-md' : 'border-r-2 rounded-tl-md rounded-bl-md'
  const p = mode === 'input' ? 'pr-4' : 'pl-4'

  const handleClick = (): void => {
    const [x, y] = current.position
    const [dx, dy] = current.anchors[parameterId]

    setCameraPosition(x + dx, y + dy, mode === 'input' ? 'TR' : 'TL', 45)
  }

  const pointerStartTime = useRef(0)
  const pointerStartPosition = useRef<[number, number]>([0, 0])
  const pointerIsMoving = useRef(false)
  const pointerIsWire = useRef(false)

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>): void => {
    console.log('param!')
    e.stopPropagation()
    e.preventDefault()
    setMode('locked')

    pointerStartTime.current = Date.now()
    pointerIsMoving.current = true
    pointerIsWire.current = false

    const { pageX, pageY } = e

    pointerStartPosition.current = [pageX, pageY]

    if (!gripRef.current) {
      return
    }

    gripRef.current.setPointerCapture(e.pointerId)
  }

  const [debug, setDebug] = useState('')

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>): void => {
    if (['iPhone', 'iPod', 'iPad'].includes(process.browser ? navigator.platform : '')) {
      return
    }

    e.preventDefault()

    if (!pointerIsMoving.current) {
      return
    }

    const { pageX: ex, pageY: ey } = e
    const [sx, sy] = pointerStartPosition.current

    setDebug(ex.toString())

    const [dx, dy] = [Math.abs(ex - sx), Math.abs(ey - sy)]

    if (dx > 20 || dy > 20) {
      pointerIsWire.current = true
      setMode('idle')
      console.log('Creating wire!')
    }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLButtonElement>): void => {
    if (!['iPhone', 'iPod', 'iPad'].includes(process.browser ? navigator.platform : '')) {
      return
    }

    e.preventDefault()

    if (e.touches.length < 1) {
      return
    }

    const { screenX: ex, screenY: ey } = e.touches[0]
    const [sx, sy] = pointerStartPosition.current

    setDebug(ex.toString())

    const [dx, dy] = [Math.abs(ex - sx), Math.abs(ey - sy)]

    if (dx > 20 || dy > 20) {
      pointerIsWire.current = true
      setMode('idle')
      console.log('Creating wire!')
    }
  }

  const handlePointerUp = (): void => {
    pointerIsMoving.current = false
    setMode('idle')
  }

  return (
    <>
      <button
        className={`${p} ${border} flex-grow pt-2 pb-2 flex flex-row justify-start items-center border-dark transition-colors duration-75 hover:bg-gray-300 overflow-visible`}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handlePointerUp}
        style={{ touchAction: 'none' }}
      >
        {debug}
        {body}
      </button>
    </>
  )
}

export default React.memo(StaticComponentParameter)
