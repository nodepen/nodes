import { NodePen, Grasshopper } from 'glib'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDebugRender } from '@/hooks'
import { useGraphDispatch, useGraphMode } from 'features/graph/store/graph/hooks'
import { useCameraDispatch, useCameraStaticZoom, useCameraStaticPosition } from 'features/graph/store/camera/hooks'
import { screenSpaceToCameraSpace } from 'features/graph/utils'
import { useAppStore } from '$'
import { MouseTooltip } from 'features/graph/components/overlay'
import WireModeTooltip from './WireModeTooltip'

type StaticComponentParameterProps = {
  parent: NodePen.Element<'static-component'>
  template: Grasshopper.Parameter & { id: string }
  mode: 'input' | 'output'
}

const StaticComponentParameter = ({ parent, template, mode }: StaticComponentParameterProps): React.ReactElement => {
  const { current, id: elementId } = parent
  const { name, nickname, id: parameterId } = template

  const store = useAppStore()

  useDebugRender(`StaticComponentParameter | ${parent.template.name} | ${name} | ${parameterId}`)

  const { registerElementAnchor, startLiveWires, captureLiveWires, releaseLiveWires } = useGraphDispatch()
  const graphMode = useGraphMode()

  const { setMode: setCameraMode } = useCameraDispatch()
  const cameraZoom = useCameraStaticZoom()
  const cameraPosition = useCameraStaticPosition()

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
          <path d={capture} fill="#FFF" opacity="0" stroke="none" />
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
        // const [x, y] = current.position
        // const [dx, dy] = current.anchors[parameterId]

        // Open menu or something

        break
      }
      case 'connecting': {
        // Set provisional wire connection

        // setProvisionalWire({ from: provisionalFrom, to: provisionalTo })

        break
      }
    }
  }

  const pointerStartTime = useRef(0)
  const pointerStartPosition = useRef<[number, number]>([0, 0])
  const pointerIsMoving = useRef(false)
  const pointerPrimaryId = useRef<number>()

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation()
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>): void => {
    e.stopPropagation()
    e.preventDefault()

    setCameraMode('locked')

    if (graphMode !== 'idle') {
      return
    }

    pointerStartTime.current = Date.now()
    pointerIsMoving.current = true
    pointerPrimaryId.current = e.pointerId

    const { pageX, pageY } = e

    pointerStartPosition.current = [pageX, pageY]

    if (!gripRef.current) {
      return
    }

    gripRef.current.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>): void => {
    e.preventDefault()

    if (!pointerIsMoving.current) {
      return
    }

    if (e.pointerId !== pointerPrimaryId.current) {
      return
    }

    const { pageX: ex, pageY: ey } = e
    const [sx, sy] = pointerStartPosition.current

    const [dx, dy] = [Math.abs(ex - sx), Math.abs(ey - sy)]

    if (dx > 20 || dy > 20) {
      const { Shift: shiftKey, Control: controlKey } = store.getState().hotkey

      const getInitialMode = (shift: boolean, control: boolean): 'default' | 'add' | 'remove' | 'transpose' => {
        if (shift && !control) {
          return 'add'
        }

        if (!shift && control) {
          return 'remove'
        }

        if (shift && control) {
          return 'transpose'
        }

        return 'default'
      }

      const initialMode = getInitialMode(shiftKey, controlKey)

      console.log({ initialMode })

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
              mode: initialMode === 'transpose' ? 'default' : 'add',
            },
            transpose: initialMode === 'transpose',
            ...map,
          },
        ],
        origin: {
          elementId,
          parameterId,
        },
      })

      pointerIsMoving.current = false
      setCameraMode('idle')

      if (!gripRef.current) {
        return
      }

      gripRef.current.releasePointerCapture(e.pointerId)
    }
  }

  const handlePointerEnter = (): void => {
    if (pointerIsMoving.current) {
      // Prevent self-collision
      return
    }

    captureLiveWires({ type: mode, elementId, parameterId })
  }

  const handlePointerLeave = (): void => {
    if (pointerIsMoving.current) {
      // Prevent self-collision
      return
    }

    releaseLiveWires()
  }

  const [showTooltip, setShowTooltip] = useState(false)
  const tooltipPosition = useRef<[number, number]>([0, 0])

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>): void => {
    const { pageX, pageY } = e

    tooltipPosition.current = [pageX, pageY]
    setShowTooltip(true)
  }, [])

  const handleMouseLeave = useCallback((): void => {
    setShowTooltip(false)
  }, [])

  return (
    <>
      <button
        className={`${p} ${border} flex-grow pt-2 pb-2 flex flex-row justify-start items-center border-dark transition-colors duration-75 hover:bg-gray-300 overflow-visible cursor-default`}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        style={{ touchAction: 'none' }}
      >
        {body}
      </button>
      {showTooltip ? (
        <MouseTooltip initialPosition={tooltipPosition.current} offset={[25, 25]}>
          <WireModeTooltip source={{ elementId, parameterId }} />
        </MouseTooltip>
      ) : null}
    </>
  )
}

export default React.memo(StaticComponentParameter)
