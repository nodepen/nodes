import type * as NodePen from '@/types'
import ColorSwatchPort from './ColorSwatchPort'
import { getColorSwatchPortTemplate } from '@/utils/templates/getGenericParameterDefinition'

type ColorSwatchPortsProps = {
    node: NodePen.DocumentNode
    template: NodePen.NodeTemplate
}

export const ColorSwatchPorts = ({ node, template }: ColorSwatchPortsProps) => {
    return (
        <>
            <ColorSwatchPort nodeInstanceId={node.instanceId} portInstanceId='output' template={getColorSwatchPortTemplate(template, 'output')} />
        </>
    )
}
