import type * as NodePen from '@/types'
import ValueListPort from './ValueListPort'
import { getValueListPortTemplate } from '@/utils/templates/getGenericParameterDefinition'

type ValueListPortsProps = {
    node: NodePen.DocumentNode
    template: NodePen.NodeTemplate
}

export const ValueListPorts = ({ node, template }: ValueListPortsProps) => {
    return (
        <>
            <ValueListPort nodeInstanceId={node.instanceId} portInstanceId='output' template={getValueListPortTemplate(template, 'output')} />
        </>
    )
}
