import type React from 'react'
import { useCallback, useRef } from 'react'
import type * as NodePen from '@nodepen/core'
import { useImperativeEvent } from '@/hooks'

export const usePort = (nodeInstanceId: string, portInstanceId: string, template: NodePen.PortTemplate): React.RefObject<SVGGElement> => {
    const portRef = useRef<SVGGElement>(null)

    const { __direction: direction } = template

    const handleContextMenu = useCallback((e: MouseEvent): void => {
        e.stopPropagation()
        e.preventDefault()
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
                        // Handle left click
                        e.stopPropagation()

                        console.log(`L ${nodeInstanceId} ${direction}`)
                        break
                    }
                    case 1: {
                        // Handle middle click
                        break
                    }
                    case 2: {
                        // Handle right click
                        console.log(`R ${nodeInstanceId} ${direction}`)
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