import type * as NodePen from '@/types'
import { useStore } from '$'
import { COMPONENTS } from '@/constants'
import NumberSliderPort from './NumberSliderPort'
import { getNumberSliderPortTemplate } from '@/utils/templates/getGenericParameterDefinition'

type NumberSliderPortsProps = {
    node: NodePen.DocumentNode
}

export const NumberSliderPorts = ({ node }: NumberSliderPortsProps) => {
    const template = useStore.getState().templates[COMPONENTS.NUMBER_SLIDER]

    return (
        <>
            <NumberSliderPort nodeInstanceId={node.instanceId} portInstanceId='output' template={getNumberSliderPortTemplate(template)} />
        </>
    )
}