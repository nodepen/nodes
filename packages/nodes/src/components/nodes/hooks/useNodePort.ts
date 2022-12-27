import { useImperativeEvent } from '@/hooks'
import type React from 'react'
import { useCallback, useRef } from 'react'

export const useNodePort = (nodeInstanceId: string, nodePortId: string): React.RefObject<SVGGElement> => {
    const portRef = useRef<SVGGElement>(null)

    const handlePointerDown = useCallback((e: PointerEvent): void => {
        switch (e.pointerType) {
            case 'pen':
            case 'touch': {
                break
            }
            case 'mouse': {
                switch (e.button) {
                    case 0: {
                        // Handle left click
                        break
                    }
                    case 1: {
                        // Handle middle click
                        break
                    }
                    case 2: {
                        // Handle right click
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

    useImperativeEvent(portRef, 'pointerdown', handlePointerDown)

    return portRef
}