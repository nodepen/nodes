import React, { useCallback, useMemo } from 'react'
import { useDispatch, useStore } from '$'
import { usePageSpaceToWorldSpace } from '@/hooks'
import { expireSolution } from '@/store/utils'

const NodePlacementOverlay = () => {
  const { apply } = useDispatch()
  const { isActive, activeNodeId } = useStore((state) => state.layout.nodePlacement)

  const [activeNodeWidth, activeNodeHeight] = useMemo((): [number, number] => {
    if (!activeNodeId) {
      return [0, 0]
    }

    const activeNode = useStore.getState().document.nodes[activeNodeId]

    return [activeNode.dimensions.width, activeNode.dimensions.height]
  }, [activeNodeId])

  const pageSpaceToWorldSpace = usePageSpaceToWorldSpace()

  const resetOverlayState = useCallback(() => {
    apply((state) => {
      state.layout.nodePlacement = {
        isActive: false,
        activeNodeId: null,
      }
    })
  }, [])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isActive || !activeNodeId) {
        return
      }

      const { pageX, pageY } = e

      const [x, y] = pageSpaceToWorldSpace(pageX, pageY)

      apply((state) => {
        state.document.nodes[activeNodeId].position = {
          x: x - activeNodeWidth / 2,
          y: y - activeNodeHeight / 2,
        }
      })
    },
    [activeNodeId]
  )

  const handlePointerUp = useCallback(
    (_e: React.PointerEvent<HTMLDivElement>) => {
      if (!activeNodeId) {
        return
      }

      apply((state) => {
        state.document.nodes[activeNodeId].status.isProvisional = false
        expireSolution(state)
      })

      resetOverlayState()
    },
    [activeNodeId, resetOverlayState]
  )

  return (
    <div
      className={`${isActive ? 'np-pointer-events-auto' : 'np-pointer-events-none'} np-w-full np-h-full`}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    />
  )
}

export default React.memo(NodePlacementOverlay)
