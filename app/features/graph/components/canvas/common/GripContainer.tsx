import React, { useCallback, useRef } from 'react'
import { NodePen } from 'glib'
import { GripContext } from './GripContext'
import { useGraphDispatch } from '@/features/graph/store/graph/hooks'
import { useScreenSpaceToCameraSpace } from '@/features/graph/hooks'
import { useAppStore } from '@/features/common/store'
import { getWireMode } from '@/features/graph/store/hotkey/utils'

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

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>): void => {
    e.stopPropagation()

    endLiveWires(getWireMode(store.getState().hotkey))
  }

  return (
    <GripContext gripRef={gripRef} register={handleRegister}>
      <div
        className="w-full h-full"
        onPointerUp={handlePointerUp}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        {children}
      </div>
    </GripContext>
  )
}

export default React.memo(GripContainer)
