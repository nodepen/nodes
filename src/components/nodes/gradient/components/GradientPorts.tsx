import type * as NodePen from '@/types'
import { getFallbackPortTemplate } from '@/utils/templates/getGenericParameterDefinition'
import GenericNodePort from '../../generic-node/components/GenericNodePort'
import GradientOutputPort from './GradientOutputPort'

type GradientPortsProps = {
    node: NodePen.DocumentNode
    template: NodePen.NodeTemplate
}

export const GradientPorts = ({ node, template }: GradientPortsProps) => {
    return (
        <>
            {Object.entries(node.inputs).map(([portInstanceId, order]) => (
                <GenericNodePort
                    key={`gradient-input-${portInstanceId}`}
                    nodeInstanceId={node.instanceId}
                    portInstanceId={portInstanceId}
                    template={template.inputs[order] ?? getFallbackPortTemplate(template, 'input', order)}
                    nodeType="color-gradient"
                />
            ))}
            {Object.entries(node.outputs).map(([portInstanceId, order]) => (
                <GradientOutputPort
                    key={`gradient-output-${portInstanceId}`}
                    nodeInstanceId={node.instanceId}
                    portInstanceId={portInstanceId}
                    template={template.outputs[order] ?? getFallbackPortTemplate(template, 'output', order)}
                />
            ))}
        </>
    )
}
