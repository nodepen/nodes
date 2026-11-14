import type * as NodePen from '@/types'
import GraphMapperPort from './GraphMapperPort'
import { getGraphMapperPortTemplate } from '@/utils/templates/getGenericParameterDefinition'

type GraphMapperPortsProps = {
    node: NodePen.DocumentNode
    template: NodePen.NodeTemplate
}

export const GraphMapperPorts = ({ node, template }: GraphMapperPortsProps) => {
    return (
        <>
            <GraphMapperPort nodeInstanceId={node.instanceId} portInstanceId="input" template={getGraphMapperPortTemplate(template, 'input')} />
            <GraphMapperPort nodeInstanceId={node.instanceId} portInstanceId="output" template={getGraphMapperPortTemplate(template, 'output')} />
        </>
    )
}
