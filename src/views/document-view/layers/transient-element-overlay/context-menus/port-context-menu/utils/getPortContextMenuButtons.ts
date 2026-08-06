import { getNodeTypeForTemplate } from '@/utils/templates/getNodeTypeForTemplate'
import type { PortContextMenuContext } from '../../../types'
import { useStore } from '$'

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
        // 'number-slider' TODO: SOOOOON
    ]

    const supportedPrimitiveTypeNames = [
        'number',
        'integer',
        'boolean',
        'text',
        'string'
    ]

    const supportedGeometricTypeNames = [
        'point',
        'circle',
        'curve',
        'line',
        'mesh',
        'surface',
        'extrusion',
        'brep'
    ]

    const enablePin = direction === 'input' && supportedPrimitiveTypeNames.includes(typeName) && pinnableNodeTypes.includes(nodeType)
    const enableSetValue = direction === 'input' && supportedPrimitiveTypeNames.includes(typeName)

    const enablePickGeometry = direction === 'input' && supportedGeometricTypeNames.includes(typeName)
    const enableZoomToGeometry = direction === 'output'

    return { enablePin, enableSetValue, enablePickGeometry, enableZoomToGeometry }
}
