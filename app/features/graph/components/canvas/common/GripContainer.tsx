import React, { useCallback, useRef } from 'react'
import { NodePen } from 'glib'
import { GripContext } from './GripContext'
import { useGraphDispatch } from '@/features/graph/store/graph/hooks'
import { useScreenSpaceToCameraSpace } from '@/features/graph/hooks'
import { useAppStore } from '@/features/common/store'

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
  const { registerElementAnchor } = useGraphDispatch()

  const screenSpaceToCameraSpace = useScreenSpaceToCameraSpace()

  const gripRef = useRef<HTMLDivElement>(null)

  const handleRegister = useCallback(() => {
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

    registerElementAnchor({ elementId, anchorId: parameterId, position: [dx, dy] })
  }, [store, elementId, parameterId, gripRef, registerElementAnchor, screenSpaceToCameraSpace])

  return (
    <GripContext gripRef={gripRef} register={handleRegister}>
      <div className="w-full h-full">{children}</div>
    </GripContext>
  )
}

export default React.memo(GripContainer)
