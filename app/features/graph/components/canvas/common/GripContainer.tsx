import React, { useCallback, useRef, useState } from 'react'
import { NodePen } from 'glib'
import { GripContext } from './GripContext'
import { useGraphDispatch } from '@/features/graph/store/graph/hooks'
import { useScreenSpaceToCameraSpace } from '@/features/graph/hooks'
import { useAppStore } from '@/features/common/store'
import { getWireMode } from '@/features/graph/store/hotkey/utils'
import { getLiveWires } from '@/features/graph/store/graph/utils'
import { PointerTooltip } from '../../overlay'
import { WireModeTooltip } from '../elements/StaticComponent/lib'

type GripContainerProps = {
  elementId: string
  parameterId: string
  mode: 'input' | 'output'
  children: JSX.Element
}

/**
 * The generic grip container wraps its child and attaches all wire creation events and logic.
 */
const GripContainer = ({ elementId, parameterId, mode, children }: GripContainerProps): React.ReactElement => {
  const store = useAppStore()
  const { registerElementAnchor, captureLiveWires, releaseLiveWires, endLiveWires } = useGraphDispatch()

  const screenSpaceToCameraSpace = useScreenSpaceToCameraSpace()

  const gripRef = useRef<HTMLDivElement>(null)

  const handleRegister = useCallback(
    (offset: [ox: number, oy: number]) => {
      if (!gripRef.current) {
        console.log(`🐍 Attempted to register grip before its ref existed!`)
        return
      }

      const parentElement = store.getState().graph.present.elements[elementId]

      if (!parentElement) {
        console.log(`🐍 Attempted to register a grip as an anchor for an element that doesn't exist!`)
        return
      }

      const { width, height, left, top } = gripRef.current.getBoundingClientRect()

      const [sx, sy] = [left + width / 2, top + height / 2]

      const [x, y] = screenSpaceToCameraSpace([sx, sy])

      const [ex, ey] = parentElement.current.position
      const [dx, dy] = [x - ex, y - ey]

      // Allow children to adjust expected result
      const [offsetX, offsetY] = offset

      registerElementAnchor({ elementId, anchorId: parameterId, position: [dx + offsetX, dy + offsetY] })
    },
    [store, elementId, parameterId, gripRef, registerElementAnchor, screenSpaceToCameraSpace]
  )

  const pointerIsMoving = useRef(false)

  const [showWireTooltip, setShowWireTooltip] = useState(false)
  const wireTooltipPosition = useRef<[number, number]>([0, 0])

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (pointerIsMoving.current) {
      // Prevent self-collision
      return
    }

    switch (e.pointerType) {
      case 'mouse': {
        const { pageX, pageY } = e

        const liveWires = getLiveWires(store.getState().graph.present)

        if (liveWires.length === 0) {
          wireTooltipPosition.current = [pageX, pageY]
          setShowWireTooltip(true)
          return
        }
      }
    }

    captureLiveWires({ type: mode, elementId, parameterId })
  }

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (pointerIsMoving.current) {
      // Prevent self-collision
      return
    }

    switch (e.pointerType) {
      case 'mouse': {
        if (showWireTooltip) {
          setShowWireTooltip(false)
        }
      }
    }

    releaseLiveWires()
  }

  // const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>): void => {
  //   if (pointerIsMoving.current) {
  //     return
  //   }

  //   switch (e.pointerType) {
  //     case 'mouse': {
  //       const { pageX, pageY } = e
  //       setWireTooltipPosition([pageX, pageY])
  //     }
  //   }
  // }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>): void => {
    e.stopPropagation()
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>): void => {
    e.stopPropagation()

    endLiveWires(getWireMode(store.getState().hotkey))
  }

  return (
    <GripContext gripRef={gripRef} register={handleRegister}>
      <>
        <div
          className="w-full h-full"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          role="presentation"
          onMouseDown={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
        {showWireTooltip ? (
          <PointerTooltip
            initialPosition={wireTooltipPosition.current}
            offset={[25, 25]}
            pointerFilter={[]}
            pointerTypeFilter={['mouse']}
          >
            <WireModeTooltip source={{ elementId, parameterId }} />
          </PointerTooltip>
        ) : null}
      </>
    </GripContext>
  )
}

export default React.memo(GripContainer)
