import type React from 'react'
import { useCallback, useRef } from 'react'
import { useDispatch } from '$'
import { useImperativeEvent } from '@/hooks'

export const useSelectableNode = (nodeInstanceId: string): React.RefObject<SVGGElement> => {
  const nodeRef = useRef<SVGGElement>(null)

  const { apply } = useDispatch()

  const handlePointerDown = useCallback((e: PointerEvent): void => {
    const container = nodeRef.current

    if (!container) {
      return
    }

    switch (e.pointerType) {
      case 'pen':
      case 'touch': {
        return
      }
      case 'mouse': {
        switch (e.button) {
          case 0: {
            // Do NOT stop propagation!

            if (e.ctrlKey) {
              // TODO: Handle remove from selection
              return
            }

            if (e.shiftKey) {
              // TODO: Handle add to selection
              return
            }

            // Handle set as selection
            apply((state) => {
              // Set node as selected on node
              const node = state.document.nodes[nodeInstanceId]

              if (!node) {
                console.log('🐍 Could not find node for selection event!')
                return
              }

              node.status.isSelected = true

              // Set node as selected in registry
              state.registry.selection.nodes = [nodeInstanceId]
            })
          }
        }
      }
    }
  }, [])

  useImperativeEvent(nodeRef, 'pointerdown', handlePointerDown)

  return nodeRef
}
