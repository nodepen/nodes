import { useEffect } from 'react'
import type * as NodePen from '@nodepen/core'

export const useDebugRender = (node: NodePen.DocumentNode, template: NodePen.NodeTemplate): void => {
    useEffect(() => {
        console.log(`⚙️⚙️⚙️ Rendered generic node [${node.instanceId.split('-')[0]}] (${template.nickName})`)
    })
}