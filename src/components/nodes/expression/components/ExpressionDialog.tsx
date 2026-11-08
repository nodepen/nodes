import React from 'react'
import type * as NodePen from '@/types'
import { Dialog } from '@/views/components'
import { ExpressionConfigForm } from '../forms/ExpressionConfigForm'

type ExpressionDialogProps = {
    node: NodePen.DocumentNode
    onClose: () => void
}

export const ExpressionDialog = ({ node, onClose }: ExpressionDialogProps) => {
    const config = (node.nodeConfiguration as NodePen.ExpressionConfig | undefined) ?? { expression: '' }

    return (
        <Dialog onClose={onClose}>
            <ExpressionConfigForm node={node} config={config} onClose={onClose} />
        </Dialog>
    )
}
