import { getNodeTypeForTemplate } from '@/utils/templates/getNodeTypeForTemplate'
import type { PortContextMenuContext } from '../../../types'
import { useStore } from '$'
import { PARAMS } from '@/constants'

type PortContextMenuButtons = {
    enablePin: boolean
    enableSetValue: boolean
    enablePickGeometry: boolean
    enableZoomToGeometry: boolean
}

export const getPortContextMenuButtons = (context: PortContextMenuContext): PortContextMenuButtons => {
    const { portTemplate, nodeInstanceId } = context
    const { __direction: direction, typeName } = portTemplate

    const nodeType = getNodeTypeForTemplate(useStore.getState().templates[useStore.getState().document.nodes[nodeInstanceId].templateId])

    const pinnableNodeTypes: (typeof nodeType)[] = [
        'generic-parameter',
        'number-slider'
    ]

    const supportedPrimitiveTypeNames: readonly string[] = PARAMS.PRIMITIVE

    const supportedGeometricTypeNames: readonly string[] = PARAMS.GEOMETRY

    const enablePin = direction === 'input' && pinnableNodeTypes.includes(nodeType)
    const enableSetValue = direction === 'input' && supportedPrimitiveTypeNames.includes(typeName)

    const enablePickGeometry = direction === 'input' && supportedGeometricTypeNames.includes(typeName)
    const enableZoomToGeometry = direction === 'output'

    return { enablePin, enableSetValue, enablePickGeometry, enableZoomToGeometry }
}
