import type * as NodePen from '@/types'

// Infer a "fake" port template from the current portConfiguration
export const getPortTemplateFromConfiguration = (
    node: NodePen.DocumentNode,
    portInstanceId: string,
    direction: 'input' | 'output'
): NodePen.PortTemplate | null => {
    const configuration = node.portConfigurations[portInstanceId]
    const order = node[`${direction}s`][portInstanceId]

    if (!configuration || order === undefined) {
        return null
    }

    return {
        __order: order,
        __direction: direction,
        name: configuration.label ?? '',
        nickName: configuration.label ?? '',
        description: configuration.description ?? '',
        typeName: configuration.typeName ?? 'data',
        keywords: [],
        isOptional: false,
    }
}
