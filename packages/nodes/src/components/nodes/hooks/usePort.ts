import type React from 'react'
import { useCallback, useRef } from 'react'
import { useDispatch } from '$'
import type * as NodePen from '@nodepen/core'
import { useImperativeEvent, usePageSpaceToOverlaySpace } from '@/hooks'
import { getWireEditModalityFromEvent } from '@/utils/wires'

export const usePort = (
  nodeInstanceId: string,
  portInstanceId: string,
  portTemplate: NodePen.PortTemplate
): React.RefObject<SVGGElement> => {
  const portRef = useRef<SVGGElement>(null)

  const { apply } = useDispatch()
  const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

  const { __direction: direction, nickName } = portTemplate

  const handleContextMenu = useCallback((e: MouseEvent): void => {
    e.stopPropagation()
    e.preventDefault()

    const { pageX, pageY } = e

    const key = `${nodeInstanceId}-${portInstanceId}-${direction}-${nickName}`

    const [x, y] = pageSpaceToOverlaySpace(pageX + 6, pageY + 6)

    apply((state) => {
      state.registry.contextMenus[key] = {
        position: {
          x,
          y,
        },
        context: {
          type: 'port',
          direction,
          nodeInstanceId,
          portInstanceId,
          portTemplate,
        },
      }
    })
  }, [])

  const handlePointerDown = useCallback((e: PointerEvent): void => {
    const { pageX, pageY, pointerId } = e

    switch (e.pointerType) {
      case 'pen':
      case 'touch': {
        // Handle touch input
        break
      }
      case 'mouse': {
        switch (e.button) {
          case 0: {
            // Handle left mouse button
            e.stopPropagation()

            console.log('!')

            apply((state) => {
              state.registry.wires.live = {
                cursor: {
                  pointerId,
                  position: {
                    x: pageX,
                    y: pageY,
                  },
                },
                connections: {
                  [portInstanceId]: {
                    portAnchor: {
                      nodeInstanceId,
                      portInstanceId,
                    },
                    portAnchorType: direction,
                  },
                },
                target: null,
              }
            })
            break
          }
          case 1: {
            // Handle middle mouse button
            break
          }
          case 2: {
            // Handle right mouse button
            break
          }
        }
        break
      }
      default: {
        console.log(`🐍 Unhandled pointer type ${e.pointerType}`)
        break
      }
    }
  }, [])

  const handlePointerEnter = useCallback((e: PointerEvent): void => {
    const { pageX, pageY } = e

    switch (e.pointerType) {
      case 'pen':
      case 'touch': {
        break
      }
      case 'mouse': {
        const wireEditTarget = {
          nodeInstanceId,
          portInstanceId,
          portDirection: direction,
        }

        apply((state) => {
          // Update cursor
          state.registry.cursors[portInstanceId] = {
            configuration: {
              position: {
                x: pageX,
                y: pageY,
              },
            },
            context: {
              type: 'wire-edit',
              mode: getWireEditModalityFromEvent(e),
              target: wireEditTarget,
            },
          }

          // Update live wire capture
          for (const connection of Object.values(state.registry.wires.live.connections)) {
            if (connection.portAnchorType === direction) {
              return
            }

            if (connection.portAnchor.nodeInstanceId === nodeInstanceId) {
              return
            }
          }

          state.registry.wires.live.target = {
            nodeInstanceId,
            portInstanceId,
          }
        })
      }
    }
  }, [])

  const handlePointerMove = useCallback((e: PointerEvent): void => {
    const { pageX, pageY } = e

    console.log('A')

    switch (e.pointerType) {
      case 'pen':
      case 'touch': {
        break
      }
      case 'mouse': {
        apply((state) => {
          if (!state.registry.cursors[portInstanceId]) {
            console.log(`🐍 Attempted to edit a port cursor that did not exist!`)
            return
          }

          state.registry.cursors[portInstanceId].configuration = {
            position: {
              x: pageX,
              y: pageY,
            },
          }

          // if (!state.registry.wires.live.cursor) {
          //   return
          // }

          // state.registry.wires.live.cursor.position = {
          //   x: pageX,
          //   y: pageY,
          // }
        })
      }
    }
  }, [])

  const handlePointerLeave = useCallback((e: PointerEvent): void => {
    switch (e.pointerType) {
      case 'pen':
      case 'touch': {
        break
      }
      case 'mouse': {
        apply((state) => {
          // Clear wire edit cursor
          delete state.registry.cursors[portInstanceId]

          // Release live wire capture
          state.registry.wires.live.target = null
        })
      }
    }
  }, [])

  useImperativeEvent(portRef, 'contextmenu', handleContextMenu)
  useImperativeEvent(portRef, 'pointerdown', handlePointerDown)
  useImperativeEvent(portRef, 'pointerenter', handlePointerEnter)
  // useImperativeEvent(portRef, 'pointermove', handlePointerMove)
  useImperativeEvent(portRef, 'pointerleave', handlePointerLeave)

  return portRef
}
