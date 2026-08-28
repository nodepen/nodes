import { getNodeTypeForTemplate } from '@/utils/templates/getNodeTypeForTemplate'
import type { PortContextMenuContext } from '../../../types'
import { useStore } from '$'
import { PARAMS } from '@/constants'

type PortContextMenuButtons = {
    enableSetLabel: boolean
    enablePin: boolean
    enableSetValue: boolean
    enablePickGeometry: boolean
    enableZoomToGeometry: boolean
}

export const getPortContextMenuButtons = (context: PortContextMenuContext): PortContextMenuButtons => {
    const { portTemplate, nodeInstanceId } = context
    const { __direction: direction, typeName } = portTemplate

    const node = useStore.getState().document.nodes[nodeInstanceId]
    const nodeType = getNodeTypeForTemplate(node ? useStore.getState().templates[node.templateId] : undefined)

    const supportedPrimitiveTypeNames: readonly string[] = PARAMS.PRIMITIVE
    const supportedGeometricTypeNames: readonly string[] = PARAMS.GEOMETRY

    switch (nodeType) {
        case 'generic-node': {
            return {
                enableSetLabel: false,
                enablePin: false,
                enableSetValue: false,
                enablePickGeometry: false,
                enableZoomToGeometry: direction === 'output'
            }
        }
        case 'generic-parameter': {
            return {
                enableSetLabel: true,
                enableSetValue: supportedPrimitiveTypeNames.includes(typeName),
                enablePickGeometry: supportedGeometricTypeNames.includes(typeName),
                enablePin: true,
                enableZoomToGeometry: false,
            }
        }
        case 'number-slider': {
            return {
                enableSetLabel: false,
                enableSetValue: false,
                enablePickGeometry: false,
                enablePin: true,
                enableZoomToGeometry: false
            }
        }
        case 'boolean-toggle': {
            return {
                enableSetLabel: false,
                enableSetValue: false,
                enablePickGeometry: false,
                enablePin: true,
                enableZoomToGeometry: false
            }
        }
        default: {
            return {
                enableSetLabel: false,
                enablePin: false,
                enableSetValue: false,
                enablePickGeometry: false,
                enableZoomToGeometry: false
            }
        }
    }
}
