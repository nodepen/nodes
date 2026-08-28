import type React from 'react'
import { useCallback, useRef } from 'react'
import { useDispatch } from '$'
import type * as NodePen from '@/types'
import { useImperativeEvent, usePageSpaceToOverlaySpace } from '@/hooks'
import { getWireEditModalityFromEvent } from '@/utils/wires'
import { getPortContextMenuKey } from '@/utils/keys/getPortContextMenuKey'
import { current } from 'immer'
import { useIsEditable } from '@/hooks/useIsEditable'
import { useRightClick } from '@/hooks/useRightClick'
import { getNodeTypeForTemplate } from '@/utils/templates/getNodeTypeForTemplate'
import { useStore } from '$'

export const usePort = (
    nodeInstanceId: string,
    portInstanceId: string,
    portTemplate: NodePen.PortTemplate
): React.RefObject<SVGGElement | null> => {
    const portRef = useRef<SVGGElement>(null)

    const isEditable = useIsEditable()

    const { apply } = useDispatch()
    const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

    const { __direction: direction, nickName } = portTemplate

    const handleContextMenu = useCallback((e: PointerEvent): void => {
        e.stopPropagation()
        e.preventDefault()

        if (!isEditable) {
            return
        }

        const node = useStore.getState().document.nodes[nodeInstanceId]
        const nodeType = getNodeTypeForTemplate(node ? useStore.getState().templates[node.templateId] : undefined)

        if (nodeType !== 'generic-node') {
            return
        }

        const { pageX, pageY } = e

        const key = getPortContextMenuKey(nodeInstanceId, portInstanceId)

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
    }, [isEditable])

    useRightClick(handleContextMenu, true, portRef)

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


                        if (!isEditable) {
                            return
                        }

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
                                mode: getWireEditModalityFromEvent(e),
                            }
                            state.callbacks.onWiresUpdated?.(current(state))
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
    }, [isEditable])

    const handlePointerEnter = useCallback((e: PointerEvent): void => {
        if (!isEditable) {
            return
        }

        switch (e.pointerType) {
            case 'pen':
            case 'touch': {
                break
            }
            case 'mouse': {
                apply((state) => {
                    // Set initial cursor state, if relevant
                    state.registry.wires.live.mode = getWireEditModalityFromEvent(e)

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

                    state.callbacks.onWiresUpdated?.(current(state))
                })
            }
        }
    }, [isEditable])

    const handlePointerMove = useCallback((e: PointerEvent): void => {
        const { pageX, pageY } = e

        if (!isEditable) {
            return
        }

        switch (e.pointerType) {
            case 'pen':
            case 'touch': {
                break
            }
            case 'mouse': {
                apply((state) => {
                    state.registry.wires.live.cursor = {
                        pointerId: e.pointerId,
                        position: {
                            x: pageX,
                            y: pageY,
                        },
                    }
                })
            }
        }
    }, [isEditable])

    const handlePointerLeave = useCallback((e: PointerEvent): void => {
        switch (e.pointerType) {
            case 'pen':
            case 'touch': {
                break
            }
            case 'mouse': {
                apply((state) => {
                    // Release live wire capture
                    state.registry.wires.live.target = null

                    state.callbacks.onWiresUpdated?.(current(state))

                    if (Object.keys(state.registry.wires.live.connections).length > 0) {
                        return
                    }

                    // No connections are live, clear cursor
                    state.registry.wires.live.cursor = null
                })
            }
        }
    }, [])

    useImperativeEvent(portRef, 'contextmenu', handleContextMenu)
    useImperativeEvent(portRef, 'pointerdown', handlePointerDown)
    useImperativeEvent(portRef, 'pointerenter', handlePointerEnter)
    useImperativeEvent(portRef, 'pointermove', handlePointerMove)
    useImperativeEvent(portRef, 'pointerleave', handlePointerLeave)

    return portRef
}
