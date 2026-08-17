import { useEffect } from 'react'
import type * as NodePen from '@/types'

export const useDebugRender = (node: NodePen.DocumentNode | undefined, template: NodePen.NodeTemplate): void => {
    useEffect(() => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`⚙️⚙️⚙️ Rendered generic node [${node?.instanceId.split('-')[0]}] (${template.nickName})`)
        }
    })
}
