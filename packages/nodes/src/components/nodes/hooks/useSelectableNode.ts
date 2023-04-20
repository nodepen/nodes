import type React from 'react'
import { useCallback, useRef } from 'react'
import { useStore, useDispatch } from '$'
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

            // Handle remove from selection
            if (e.ctrlKey) {
              apply((state) => {
                const node = state.document.nodes[nodeInstanceId]

                if (!node) {
                  console.log('🐍 Could not find node for selection event!')
                  return
                }

                // Set node as selected on node
                node.status.isSelected = false

                // Set node as selected in registry
                const currentSelection = state.registry.selection.nodes
                state.registry.selection.nodes = currentSelection.filter((id) => id !== nodeInstanceId)
              })

              return
            }

            // Handle add to selection
            if (e.shiftKey) {
              apply((state) => {
                const node = state.document.nodes[nodeInstanceId]

                if (!node) {
                  console.log('🐍 Could not find node for selection event!')
                  return
                }

                // Set node as selected on node
                node.status.isSelected = true

                // Set node as selected in registry
                if (!state.registry.selection.nodes.includes(nodeInstanceId)) {
                  state.registry.selection.nodes.push(nodeInstanceId)
                }
              })

              return
            }

            // Bail out if we are in a multi-select mode
            if (useStore.getState().registry.selection.nodes.length > 1) {
              return
            }

            // Handle set as selection
            apply((state) => {
              const node = state.document.nodes[nodeInstanceId]

              if (!node) {
                console.log('🐍 Could not find node for selection event!')
                return
              }

              // Set node as selected on node
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
