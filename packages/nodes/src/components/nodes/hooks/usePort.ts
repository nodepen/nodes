import type React from 'react'
import { useCallback, useRef } from 'react'
import { useDispatch } from '$'
import type * as NodePen from '@nodepen/core'
import { useImperativeEvent } from '@/hooks'

export const usePort = (nodeInstanceId: string, portInstanceId: string, template: NodePen.PortTemplate): React.RefObject<SVGGElement> => {
    const portRef = useRef<SVGGElement>(null)

    const { apply } = useDispatch()

    const { __direction: direction, nickName } = template

    const handleContextMenu = useCallback((e: MouseEvent): void => {
        e.stopPropagation()
        e.preventDefault()

        const { pageX, pageY } = e

        console.log(`R ${nickName} ${direction}`)

        apply((state) => {
            state.registry.contextMenus['test'] = {
                position: {
                    x: pageX,
                    y: pageY
                },
                context: {
                    type: 'port',
                    direction,
                    nodeInstanceId,
                    portInstanceId,
                    portTemplate: template
                }
            }
        })
    }, [])

    const handlePointerDown = useCallback((e: PointerEvent): void => {
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

    useImperativeEvent(portRef, 'contextmenu', handleContextMenu)
    useImperativeEvent(portRef, 'pointerdown', handlePointerDown)

    return portRef
}