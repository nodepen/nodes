import { useImperativeEvent } from '@/hooks'
import type React from 'react'
import { useCallback, useRef } from 'react'

export const useNodePort = (nodeInstanceId: string, portInstanceId: string, direction: 'input' | 'output'): React.RefObject<SVGGElement> => {
    const portRef = useRef<SVGGElement>(null)

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

                        console.log(`${nodeInstanceId} ${direction}`)
                        break
                    }
                    case 1: {
                        // Handle middle click
                        break
                    }
                    case 2: {
                        // Handle right click
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