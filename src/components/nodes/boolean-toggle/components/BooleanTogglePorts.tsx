import type * as NodePen from '@/types'
import BooleanTogglePort from './BooleanTogglePort'
import { getBooleanTogglePortTemplate } from '@/utils/templates/getGenericParameterDefinition'

type BooleanTogglePortsProps = {
    node: NodePen.DocumentNode
    template: NodePen.NodeTemplate
}

export const BooleanTogglePorts = ({ node, template }: BooleanTogglePortsProps) => {
    return (
        <>
            <BooleanTogglePort nodeInstanceId={node.instanceId} portInstanceId='output' template={getBooleanTogglePortTemplate(template, 'output')} />
        </>
    )
}
