import type * as NodePen from '@/types'
import RelayPort from './RelayPort'
import { getRelayPortTemplate } from '@/utils/templates/getGenericParameterDefinition'
import { useStore } from '$'

type RelayPortsProps = {
    node: NodePen.DocumentNode
}

export const RelayPorts = ({ node }: RelayPortsProps) => {
    const { instanceId: id } = node

    const template = useStore.getState().templates[node.templateId]

    return (
        <>
            <RelayPort nodeInstanceId={id} portInstanceId='input' template={getRelayPortTemplate(template, 'input')} />
            <RelayPort nodeInstanceId={id} portInstanceId='output' template={getRelayPortTemplate(template, 'output')} />
        </>
    )
}
