import { NodePen, Grasshopper } from 'glib'
import React, { useEffect, useMemo, useRef } from 'react'
import { useSetCameraPosition } from 'features/graph/hooks'
import { useDebugRender } from '@/hooks'
import { useGraphDispatch, useGraphMode } from 'features/graph/store/graph/hooks'
import { useCameraDispatch, useCameraStaticZoom, useCameraStaticPosition } from 'features/graph/store/camera/hooks'
import { useOverlayDispatch, useParameterMenuConnection } from 'features/graph/store/overlay/hooks'
import { screenSpaceToCameraSpace } from 'features/graph/utils'
import { useSessionManager } from 'context/session'

type StaticComponentParameterProps = {
  parent: NodePen.Element<'static-component'>
  template: Grasshopper.Parameter & { id: string }
  mode: 'input' | 'output'
}

const StaticComponentParameter = ({ parent, template, mode }: StaticComponentParameterProps): React.ReactElement => {
  const { current, id: elementId } = parent
  const { name, nickname, id: parameterId } = template

  const { device } = useSessionManager()

  useDebugRender(`StaticComponentParameter | ${parent.template.name} | ${name} | ${parameterId}`)

  const {
    registerElementAnchor,
    setProvisionalWire,
    // startLiveWire,
    // updateLiveWire,
    // endLiveWire,
    startLiveWires,
    captureLiveWires,
    releaseLiveWires,
    // captureLiveWire,
    // releaseLiveWire,
  } = useGraphDispatch()
  const graphMode = useGraphMode()

  const { show, setParameterMenuConnection } = useOverlayDispatch()
  const { from, to } = useParameterMenuConnection()

  const { setMode } = useCameraDispatch()
  const cameraZoom = useCameraStaticZoom()
  const cameraPosition = useCameraStaticPosition()

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

    const capture = mode === 'input' ? 'M5,-10 a1,1 0 0,0 0,30' : 'M5,20 a1,1 0 0,0 0,-30'

    return (
      <div ref={gripRef} className="w-4 h-4 overflow-visible" style={{ transform: tx }}>
        <svg className="w-4 h-4 overflow-visible" viewBox="0 0 10 10">
          <path d={d} fill="#333" stroke="#333" strokeWidth="2px" vectorEffect="non-scaling-stroke" />
          <circle cx="5" cy="5" r="4" stroke="#333" strokeWidth="2px" vectorEffect="non-scaling-stroke" fill="#FFF" />
          <path
            d={capture}
            fill="#FFF"
            opacity="0"
            stroke="none"
            onPointerUp={() => console.log('up')}
            onTouchMove={() => console.log('touch')}
          />
        </svg>
      </div>
    )
  }, [mode])

  const body = useMemo(() => {
    return mode === 'input' ? (
      <>
        {grip}
        <p className="font-panel font-semibold select-none" style={{ transform: 'translateY(1px)' }}>
          {nickname}
        </p>
      </>
    ) : (
      <>
        <p className="font-panel font-semibold select-none" style={{ transform: 'translateY(1px)' }}>
          {nickname}
        </p>
        {grip}
      </>
    )
  }, [grip, mode, nickname])

  const border = mode === 'input' ? 'border-l-2 rounded-tr-md rounded-br-md' : 'border-r-2 rounded-tl-md rounded-bl-md'
  const p = mode === 'input' ? 'pr-4' : 'pl-4'

  const handleClick = (): void => {
    switch (graphMode) {
      case 'idle': {
        const [x, y] = current.position
        const [dx, dy] = current.anchors[parameterId]

        setCameraPosition(x + dx, y + dy, mode === 'input' ? 'TR' : 'TL', 45)

        setTimeout(() => {
          show({ menu: 'parameterMenu', sourceType: mode, sourceElementId: elementId, sourceParameterId: parameterId })
        }, 350)
        break
      }
      case 'connecting': {
        // Validation handled by reducer
        setParameterMenuConnection({ type: mode, elementId, parameterId })

        const provisionalFrom = mode === 'input' ? from : { elementId, parameterId }
        const provisionalTo = mode === 'input' ? { elementId, parameterId } : to

        if (!provisionalFrom || !provisionalTo) {
          break
        }

        setProvisionalWire({ from: provisionalFrom, to: provisionalTo })

        break
      }
    }
  }

  const pointerStartTime = useRef(0)
  const pointerStartPosition = useRef<[number, number]>([0, 0])
  const pointerIsMoving = useRef(false)
  const pointerPrimaryId = useRef<number>()

  // const [pointerIsWire, setPointerIsWire] = useState(false)

  // const wireMode = useWireMode(pointerPrimaryId.current)

  // const handleWirePointerMove = (e: PointerEvent): void => {
  //   if (!pointerIsWire) {
  //     return
  //   }

  //   if (e.pointerId !== pointerPrimaryId.current) {
  //     return
  //   }

  //   const { pageX, pageY } = e

  //   const [x, y] = screenSpaceToCameraSpace(
  //     { offset: [0, 48 + 36], position: [pageX, pageY] },
  //     { zoom: cameraZoom, position: cameraPosition }
  //   )

  //   updateLiveWire({ type: mode === 'input' ? 'to' : 'from', position: [x, y] })
  // }

  // const handleWirePointerUp = (e: PointerEvent): void => {
  //   if (e.pointerId !== pointerPrimaryId.current) {
  //     return
  //   }

  //   endLiveWire(wireMode)
  //   setPointerIsWire(false)
  //   pointerPrimaryId.current = undefined
  // }

  // useEffect(() => {
  //   if (!pointerIsWire) {
  //     return
  //   }

  //   window.addEventListener('pointermove', handleWirePointerMove)
  //   window.addEventListener('pointerup', handleWirePointerUp)

  //   return () => {
  //     window.removeEventListener('pointermove', handleWirePointerMove)
  //     window.removeEventListener('pointerup', handleWirePointerUp)
  //   }
  // })

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation()
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>): void => {
    console.log('param!')
    e.stopPropagation()
    e.preventDefault()
    setMode('locked')

    if (graphMode !== 'idle') {
      return
    }

    pointerStartTime.current = Date.now()
    pointerIsMoving.current = true
    pointerPrimaryId.current = e.pointerId

    // setPointerIsWire(false)

    const { pageX, pageY } = e

    pointerStartPosition.current = [pageX, pageY]

    if (!gripRef.current) {
      return
    }

    gripRef.current.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>): void => {
    if (device.iOS) {
      return
    }

    e.preventDefault()

    if (!pointerIsMoving.current) {
      return
    }

    const { pageX: ex, pageY: ey } = e
    const [sx, sy] = pointerStartPosition.current

    // console.log(ex.toString())

    const [dx, dy] = [Math.abs(ex - sx), Math.abs(ey - sy)]

    if (dx > 20 || dy > 20) {
      const map = {
        from:
          mode === 'output'
            ? {
                elementId,
                parameterId,
              }
            : undefined,
        to:
          mode === 'output'
            ? undefined
            : {
                elementId,
                parameterId,
              },
      } as any
      startLiveWires({
        templates: [
          {
            type: 'wire',
            mode: 'live',
            initial: {
              pointer: e.pointerId,
              mode: 'default',
            },
            transpose: false,
            ...map,
          },
        ],
        origin: {
          elementId,
          parameterId,
        },
      })

      // setPointerIsWire(true)
      // setMode('idle')
      // pointerIsMoving.current = false

      // startLiveWire({ type: mode, elementId, parameterId })

      pointerIsMoving.current = false
      setMode('idle')

      if (!gripRef.current) {
        return
      }

      gripRef.current.releasePointerCapture(e.pointerId)
    }
  }

  // const handleTouchMove = (e: React.TouchEvent<HTMLButtonElement>): void => {
  //   if (!device.iOS) {
  //     return
  //   }

  //   e.preventDefault()

  //   if (e.touches.length < 1) {
  //     return
  //   }

  //   const { screenX: ex, screenY: ey } = e.touches[0]
  //   const [sx, sy] = pointerStartPosition.current

  //   console.log(ex.toString())

  //   const [dx, dy] = [Math.abs(ex - sx), Math.abs(ey - sy)]

  //   if (!pointerIsWire && (dx > 20 || dy > 20)) {
  //     setPointerIsWire(true)
  //     setMode('idle')
  //     pointerIsMoving.current = false

  //     startLiveWire({ type: mode, elementId, parameterId })
  //   }
  // }

  // const handlePointerUp = (): void => {
  //   pointerIsMoving.current = false
  //   setMode('idle')
  // }

  const handlePointerEnter = (): void => {
    if (pointerIsMoving.current) {
      return
    }

    captureLiveWires({ type: mode, elementId, parameterId })
  }

  const handlePointerLeave = (): void => {
    if (pointerIsMoving.current) {
      return
    }

    releaseLiveWires()
  }

  return (
    <>
      <button
        className={`${p} ${border} flex-grow pt-2 pb-2 flex flex-row justify-start items-center border-dark transition-colors duration-75 hover:bg-gray-300 overflow-visible`}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        // onPointerUp={handlePointerUp}
        // onTouchMove={handleTouchMove}
        // onTouchEnd={handlePointerUp}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        style={{ touchAction: 'none' }}
      >
        {body}
      </button>
    </>
  )
}

export default React.memo(StaticComponentParameter)
