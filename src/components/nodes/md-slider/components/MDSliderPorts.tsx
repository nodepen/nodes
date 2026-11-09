import type * as NodePen from '@/types'
import MDSliderPort from './MDSliderPort'
import { getMDSliderPortTemplate } from '@/utils/templates/getGenericParameterDefinition'

type MDSliderPortsProps = {
    node: NodePen.DocumentNode
    template: NodePen.NodeTemplate
}

export const MDSliderPorts = ({ node, template }: MDSliderPortsProps) => {
    return (
        <MDSliderPort nodeInstanceId={node.instanceId} portInstanceId="output" template={getMDSliderPortTemplate(template, 'output')} />
    )
}
