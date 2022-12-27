import type React from 'react'
import { useRef } from 'react'

export const useNodePort = (nodeInstanceId: string, nodePortId: string): React.RefObject<SVGGElement> => {
    const portRef = useRef<SVGGElement>(null)



    return portRef
}